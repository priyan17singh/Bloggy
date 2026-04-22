export default function VerifyEmailPage({ searchParams }) {
  return (
    <div className="max-w-md mx-auto mt-20 text-center">
      <div className="bg-green-50 border border-green-200 rounded-lg p-8">
        <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
        <h1 className="text-2xl font-bold text-green-800 mb-2">Check Your Email</h1>
        <p className="text-green-700 mb-4">
          We've sent you a confirmation link to verify your email address.
        </p>
        <p className="text-sm text-green-600">
          After verifying, you can <a href="/auth/login" className="underline font-semibold">log in here</a>.
        </p>
      </div>
    </div>
  )
}