import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { TextInput } from '@/components/common/TextInput'
import { Button } from '@/components/common/Button'
import { Alert } from '@/components/common/Alert'
import { useRecoilValue } from 'recoil'
import { authErrorAtom } from '@/atoms/authAtom'

export const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [localError, setLocalError] = useState('')
  const { signup, isSigningUp } = useAuth()
  const error = useRecoilValue(authErrorAtom)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError('')

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters')
      return
    }

    signup({ email, password }, {
      onSuccess: () => {
        navigate('/documents')
      },
    } as any)
  }

  const displayError = localError || error

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Sign Up</h2>
          <p className="mt-2 text-gray-600">Create your AiQA account</p>
        </div>
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          {displayError && (
            <div className="mb-4">
              <Alert type="error">{displayError}</Alert>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <TextInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <TextInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <TextInput
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            <Button type="submit" className="w-full" loading={isSigningUp}>
              Sign Up
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link to="/auth/signin" className="text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
