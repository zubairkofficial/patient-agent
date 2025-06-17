import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

export function VerificationCodeForm() {
  const [countdown, setCountdown] = useState(49)
  const [code, setCode] = useState(['', '', '', '', '', ''])

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code]
      newCode[index] = value
      setCode(newCode)

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`)
      prevInput?.focus()
    }
  }

  return (
    <Card className="w-full max-w-[400px] mx-auto">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-center mb-6">
          <img src="/logo.svg" alt="Patient Agent" className="h-8 w-8" />
          <span className="ml-2 text-2xl font-bold">Patient Agent</span>
        </div>
        <CardTitle className="text-2xl text-center">Verify Your Identity</CardTitle>
        <CardDescription className="text-center">
          Enter the 6-digit code sent to your email to reset your password
        </CardDescription>
        <p className="text-center text-sm text-muted-foreground">
          Code sent to: asdsad@gmail.com
        </p>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="flex justify-between max-w-[360px] mx-auto gap-2">
            {code.map((digit, index) => (
              <Input
                key={index}
                id={`code-${index}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                className="w-12 h-12 text-center text-lg"
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
              />
            ))}
          </div>
          <Button type="submit" className="w-full">
            Verify Code
          </Button>
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?
            </p>
            <p className="text-sm">
              Resend code in {countdown}s
            </p>
          </div>
          <div className="text-center">
            <Button variant="link" className="px-0" asChild>
              <a href="/forgot-password">← Back to Forgot Password</a>
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            For demo purposes, use code: 123456
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
