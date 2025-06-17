import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function ForgotPasswordForm() {
  return (
    <Card className="w-full max-w-[400px] mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-6">
          <img src="/logo.svg" alt="Patient Agent" className="h-8 w-8" />
          <span className="ml-2 text-2xl font-bold">Patient Agent</span>
        </div>
        <CardTitle className="text-2xl text-center">Forgot Password</CardTitle>
        <CardDescription className="text-center">
          Enter your email address and we'll send you a link to reset your password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              placeholder="Enter your email address"
              type="email"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
          <div className="text-center">
            <Button variant="link" className="px-0" asChild>
              <a href="/login">← Back to Sign In</a>
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            For security reasons, we'll only send reset links to registered email addresses
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
