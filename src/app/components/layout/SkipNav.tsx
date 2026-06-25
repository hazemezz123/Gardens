export function SkipNav() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-5 focus:py-3 focus:rounded-xl focus:text-sm focus:font-semibold focus:outline-2 focus:outline-offset-2 focus:outline-primary"
    >
      Skip to main content
    </a>
  );
}
