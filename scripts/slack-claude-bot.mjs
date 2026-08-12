import bolt from "@slack/bolt";
import { execSync } from "child_process";
import { randomBytes } from "crypto";
import "dotenv/config";

const { App } = bolt;

const REPO_PATH = process.env.REPO_PATH;
const CLAUDE_PATH =
  process.env.CLAUDE_PATH || "/Users/jsh3418/.local/bin/claude";

function run(cmd, opts = {}) {
  const result = execSync(cmd, {
    cwd: REPO_PATH,
    encoding: "utf-8",
    stdio: "pipe",
    ...opts,
  });
  return result.trim();
}

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

// 동시 실행 방지
let isRunning = false;

app.event("app_mention", async ({ event, say }) => {
  // 봇 멘션 텍스트에서 봇 ID 제거하여 작업 내용만 추출
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

    // 1. main 브랜치 최신화
    run("git checkout main && git pull origin main");

    // 2. 작업 브랜치 생성
    run(`git checkout -b ${branchName}`);

    // 3. Claude Code 실행
    const prompt = `You are working on the "kelog" blog repository. Read AGENTS.md and CLAUDE.md before making any changes.\n\nTask: ${task}\n\nAfter completing the task:\n1. Run "npm run lint" to check for errors.\n2. Run "npm run build" to verify the build succeeds.\n3. Fix any errors before finishing.`;

    const claudeResult = execSync(
      `${CLAUDE_PATH} -p ${JSON.stringify(prompt)} --allowedTools "Edit,Write,Bash,Read,Glob,Grep"`,
      {
        cwd: REPO_PATH,
        encoding: "utf-8",
        timeout: 10 * 60 * 1000,
        env: { ...process.env },
        maxBuffer: 10 * 1024 * 1024,
      },
    );
    console.log("Claude output:", claudeResult.slice(0, 500));

    // 4. 변경사항 확인
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

    // 5. 커밋 & 푸시
    run("git add -A");
    run(`git commit -m "feat: ${task.replace(/"/g, '\\"')}"`);
    run(`git push -u origin ${branchName}`);

    // 6. PR 생성
    const prUrl = run(
      `gh pr create --title "${task.replace(/"/g, '\\"')}" --body "Slack에서 요청된 자동 작업입니다.\n\nRequested by: <@${event.user}>"`,
    );

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

    // 에러 시 브랜치 정리
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
