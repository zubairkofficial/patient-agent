import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import authService from '@/services/auth.service'
import { useNavigate } from 'react-router-dom'

export function VerificationCodeForm() {
  const [countdown, setCountdown] = useState(49)
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Countdown timer effect
  useEffect(() => {
    const timer =
      countdown > 0 &&
      setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)

    return () => clearInterval(timer as any)
  }, [countdown])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    const otp = code.join('')
    const email = localStorage.getItem('resetEmail') // Assume email is stored during forgot-password

    if (!email) {
      setError('Email not found. Please go back and try again.')
      setLoading(false)
      return
    }

    const result = await authService.verifyOtp({ email, otp })

    if (result.success) {
      setMessage('Code verified! Redirecting to reset password...')
      setTimeout(() => {
        navigate('/reset-password') // Redirect to reset password page
      }, 1500)
    } else {
      setError(result.message)
    }

    setLoading(false)
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
          Code sent to: {localStorage.getItem('resetEmail') || 'your email'}
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          {message && <p className="text-sm text-green-600 text-center">{message}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Code'}
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
