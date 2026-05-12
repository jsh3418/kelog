const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const smoothScrollTo = (options: Omit<ScrollToOptions, "behavior">) => {
  window.scrollTo({
    ...options,
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
};

export const smoothScrollIntoView = (element: Element) => {
  element.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
  });
};
