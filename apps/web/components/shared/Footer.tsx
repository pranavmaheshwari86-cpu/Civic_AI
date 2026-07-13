export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-muted/40 py-6 mt-12">
      <div className="container px-4 text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} CivicAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
