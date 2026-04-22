import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { createServerClient } from '@/lib/supabase/server'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Blog Platform',
  description: 'AI-powered blog with role-based access',
}

export default async function RootLayout({ children }) {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  let userRole = null
  if (user) {
    const { data } = await supabase.from('users').select('role').eq('id', user.id).single()
    userRole = data?.role
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between">
            <Link href="/" className="font-bold">Blog Platform</Link>
            <div className="space-x-4">
              {!user ? (
                <>
                  <Link href="/auth/login">Login</Link>
                  <Link href="/auth/signup">Sign Up</Link>
                </>
              ) : (
                <>
                  <span>{user.email}</span>
                  {userRole === 'author' && <Link href="/posts/new">New Post</Link>}
                  {userRole === 'admin' && <Link href="/admin">Admin</Link>}
                  <form action="/auth/logout" method="post" className="inline">
                    <button type="submit">Logout</button>
                  </form>
                </>
              )}
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  )
}