import bolt from "@slack/bolt";
import { execSync } from "child_process";
import { randomBytes } from "crypto";
import "dotenv/config";
import { unlinkSync, writeFileSync } from "fs";
import { join } from "path";

const { App } = bolt;

const REPO_PATH = process.env.REPO_PATH;
const CLAUDE_PATH =
  process.env.CLAUDE_PATH || "/Users/jsh3418/.local/bin/claude";

function run(cmd, opts = {}) {
  return execSync(cmd, {
    cwd: REPO_PATH,
    encoding: "utf-8",
    stdio: "pipe",
    ...opts,
  }).trim();
}

function claude(prompt, timeoutMin = 10) {
  return execSync(
    `${CLAUDE_PATH} -p ${JSON.stringify(prompt)} --allowedTools "Edit,Write,Bash,Read,Glob,Grep"`,
    {
      cwd: REPO_PATH,
      encoding: "utf-8",
      timeout: timeoutMin * 60 * 1000,
      env: { ...process.env },
      maxBuffer: 10 * 1024 * 1024,
    },
  );
}

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

// 동시 실행 방지
let isRunning = false;

app.event("app_mention", async ({ event, say }) => {
  const task = event.text.replace(/<@[A-Z0-9]+>/g, "").trim();

  if (!task) {
    await say({
      text: "작업 내용을 입력해주세요. 예: `@claude-bot 블로그에 /about 페이지 추가해줘`",
      thread_ts: event.ts,
    });
    return;
  }

  if (isRunning) {
    await say({
      text: "이전 작업이 진행 중입니다. 완료 후 다시 요청해주세요.",
      thread_ts: event.ts,
    });
    return;
  }

  isRunning = true;
  const branchName = `claude/${Date.now()}-${randomBytes(3).toString("hex")}`;

  try {
    await say({ text: `작업을 시작합니다: *${task}*`, thread_ts: event.ts });

    // 1. main 브랜치 최신화 & 작업 브랜치 생성
    run("git checkout main && git pull origin main");
    run(`git checkout -b ${branchName}`);

    // 2. Claude Code로 코드 작업 실행
    const workPrompt = [
      `You are working on the "kelog" blog repository.`,
      `Read AGENTS.md and CLAUDE.md before making any changes.`,
      ``,
      `Task: ${task}`,
      ``,
      `After completing the task:`,
      `1. Run "npm run lint" to check for errors.`,
      `2. Run "npm run build" to verify the build succeeds.`,
      `3. Fix any errors before finishing.`,
    ].join("\n");

    const workOutput = claude(workPrompt);
    console.log("Claude work output:", workOutput.slice(0, 500));

    // 3. 변경사항 확인
    const status = run("git status --porcelain");
    if (!status) {
      await say({
        text: "변경사항이 없습니다. 작업이 필요하지 않거나 이미 완료된 상태입니다.",
        thread_ts: event.ts,
      });
      run("git checkout main");
      run(`git branch -D ${branchName}`);
      return;
    }

    // 4. Claude Code로 PR 제목/본문 생성
    const diff = run("git diff HEAD");
    const prPrompt = [
      `Based on the following git diff and the original task, generate a PR title and body in Korean.`,
      ``,
      `Original task: ${task}`,
      ``,
      `Git diff:`,
      "```",
      diff.slice(0, 8000),
      "```",
      ``,
      `Reply in EXACTLY this format (no other text):`,
      `TITLE: (concise PR title under 70 chars, in Korean)`,
      `BODY:`,
      `## 요약`,
      `(1-3 bullet points explaining what changed and why)`,
      ``,
      `## 변경 사항`,
      `(list of specific changes)`,
    ].join("\n");

    const prOutput = claude(prPrompt, 2);
    console.log("Claude PR output:", prOutput);

    // PR 출력에서 제목/본문 파싱
    const titleMatch = prOutput.match(/TITLE:\s*(.+)/);
    const bodyMatch = prOutput.match(/BODY:\s*([\s\S]+)/);
    const prTitle = titleMatch ? titleMatch[1].trim() : task;
    const prBody = bodyMatch ? bodyMatch[1].trim() : `Slack 요청: ${task}`;

    // 5. 커밋 & 푸시
    run("git add -A");
    run(`git commit -m ${JSON.stringify(prTitle)}`);
    run(`git push -u origin ${branchName}`);

    // 6. PR 생성 (임시 파일로 본문 전달하여 줄바꿈 보존)
    const fullBody = `${prBody}\n\n---\nRequested by: <@${event.user}> via Slack`;
    const bodyFile = join(REPO_PATH, ".pr-body-tmp.md");
    writeFileSync(bodyFile, fullBody, "utf-8");
    let prUrl;
    try {
      prUrl = run(
        `gh pr create --title ${JSON.stringify(prTitle)} --body-file ${JSON.stringify(bodyFile)}`,
      );
    } finally {
      try {
        unlinkSync(bodyFile);
      } catch {}
    }

    await say({ text: `PR 생성 완료: ${prUrl}`, thread_ts: event.ts });
  } catch (error) {
    const stderr = error.stderr?.toString() || "";
    const stdout = error.stdout?.toString() || "";
    const errMsg = stderr || stdout || error.message || "알 수 없는 에러";
    console.error("Error:", errMsg);
    await say({
      text: `작업 중 에러가 발생했습니다:\n\`\`\`${errMsg.slice(0, 500)}\`\`\``,
      thread_ts: event.ts,
    });

    try {
      run("git checkout main");
      run(`git branch -D ${branchName}`);
    } catch {
      // 정리 실패는 무시
    }
  } finally {
    isRunning = false;
  }
});

(async () => {
  await app.start();
  console.log("Slack Claude Bot is running (Socket Mode)");
})();
