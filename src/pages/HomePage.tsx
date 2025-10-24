import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'

export const HomePage: React.FC = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-blue-600">AiQA</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          AI-powered document Q&A system. Upload your PDFs and ask questions to get instant,
          intelligent answers.
        </p>
        <div className="flex gap-4 justify-center">
          {user ? (
            <Link to="/documents">
              <Button size="lg">Go to Documents</Button>
            </Link>
          ) : (
            <>
              <Link to="/auth/signup">
                <Button size="lg">Get Started</Button>
              </Link>
              <Link to="/auth/signin">
                <Button variant="secondary" size="lg">
                  Sign In
                </Button>
              </Link>
            </>
          )}
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
            <p className="text-gray-600">Easily upload your PDF documents to the system</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-semibold mb-2">Ask Questions</h3>
            <p className="text-gray-600">Chat with AI about your document contents</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-lg font-semibold mb-2">Get Instant Answers</h3>
            <p className="text-gray-600">Receive intelligent responses powered by AI</p>
          </div>
        </div>
      </div>
    </div>
  )
}
