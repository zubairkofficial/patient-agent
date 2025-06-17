interface AuthLayoutProps {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container relative min-h-screen flex flex-col items-center justify-center py-20">
        {children}
        <footer className="absolute bottom-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Patient Agent. All rights reserved.
        </footer>
      </div>
    </div>
  )
}
