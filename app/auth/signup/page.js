'use client'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } }
    })
    
    if (error) {
      if (error.status === 429) {
        setError('Too many signup attempts. Please wait a minute and try again.')
      } else {
        setError(error.message)
      }
      setLoading(false)
    } else {
      // Redirect to email verification page
      router.push('/auth/login')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSignup} className="space-y-4">
        <input 
          type="text" 
          placeholder="Name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="w-full border p-2 rounded" 
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full border p-2 rounded" 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          className="w-full border p-2 rounded" 
          required 
        />
        <button 
          type="submit" 
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded w-full disabled:opacity-50"
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
      <p className="mt-4 text-center text-sm">
        Already have an account? <a href="/auth/login" className="text-blue-500">Login</a>
      </p>
    </div>
  )
}