import Link from 'next/link'

export default function VerifyEmailPage() {
  return (
    <div className="max-w-md mx-auto mt-20 text-center">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="text-6xl mb-4">📧</div>
        <h1 className="text-2xl font-bold mb-2">Check your email</h1>
        <p className="text-gray-600 mb-4">
          We've sent you a confirmation link. Please verify your email address to complete signup.
        </p>
        <p className="text-sm text-gray-500 mb-6">
          Didn't receive the email? Check your spam folder or try signing up again.
        </p>
        <Link 
          href="/auth/login" 
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
        >
          Go to Login
        </Link>
      </div>
    </div>
  )
}