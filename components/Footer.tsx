export const Footer = () => {
  return (
    <footer className="py-6 md:px-8 md:py-0 border-t">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with{' '}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Next.js
          </a>
          ,{' '}
          <a
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            shadcn/ui
          </a>
          , and{' '}
          <a
            href="https://tailwindcss.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Tailwind CSS
          </a>
          .
        </p>
      </div>
    </footer>
  )
}
