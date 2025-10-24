import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { TextInput } from '@/components/common/TextInput'
import { Button } from '@/components/common/Button'
import { Alert } from '@/components/common/Alert'
import { useRecoilValue } from 'recoil'
import { authErrorAtom } from '@/atoms/authAtom'

export const SignInPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signin, isSigningIn } = useAuth()
  const error = useRecoilValue(authErrorAtom)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    signin({ email, password }, {
      onSuccess: () => {
        navigate('/documents')
      },
    } as any)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Sign In</h2>
          <p className="mt-2 text-gray-600">Welcome back to AiQA</p>
        </div>
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          {error && (
            <div className="mb-4">
              <Alert type="error">{error}</Alert>
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
            <Button type="submit" className="w-full" loading={isSigningIn}>
              Sign In
            </Button>
          </form>
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Don't have an account? </span>
            <Link to="/auth/signup" className="text-blue-600 hover:text-blue-500">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
