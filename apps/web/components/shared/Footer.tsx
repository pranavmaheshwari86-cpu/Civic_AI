export function Footer() {
  return (
    <footer className="w-full py-xl mt-xl bg-surface-container-highest dark:bg-surface-container-low border-t border-outline-variant/50 font-body-md text-label-sm text-on-surface-variant dark:text-outline">
      <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-2 items-center gap-md">
        <div className="flex flex-col gap-sm">
          <span className="font-headline-md text-headline-md text-primary dark:text-primary-fixed font-bold tracking-tight">Civic AI</span>
          <p>&copy; {new Date().getFullYear()} Civic AI (Smart Bharat). Government of India Initiative.</p>
        </div>
        <div className="flex flex-wrap md:justify-end gap-md">
          <a className="text-on-surface-variant hover:text-primary hover:opacity-80 transition-opacity duration-200" href="#">Privacy Policy</a>
          <a className="text-on-surface-variant hover:text-primary hover:opacity-80 transition-opacity duration-200" href="#">Terms of Service</a>
          <a className="text-on-surface-variant hover:text-primary hover:opacity-80 transition-opacity duration-200" href="#">Accessibility</a>
          <a className="text-on-surface-variant hover:text-primary hover:opacity-80 transition-opacity duration-200" href="#">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}
