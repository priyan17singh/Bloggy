'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthGuard({ children, allowedRoles }) {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.push('/auth/login')
        return
      }
      const { data } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()
      if (data && allowedRoles.includes(data.role)) {
        setAuthorized(true)
      } else {
        router.push('/unauthorized')
      }
      setLoading(false)
    })
  }, [])

  if (loading) return <div className="p-4">Checking permissions...</div>
  return authorized ? children : null
}