import { createServerClient } from '@/lib/supabase/server'
import Link from 'next/link'

const POSTS_PER_PAGE = 6

export default async function Home({ searchParams }) {
  const { page = '1', search = '' } = await searchParams
  const currentPage = parseInt(page)
  const supabase = await createServerClient()

  // Build query with search
  let query = supabase
    .from('posts')
    .select('*, author:users(name)', { count: 'exact' })
  if (search) {
    query = query.or(`title.ilike.%${search}%,body.ilike.%${search}%`)
  }
  
  const { data: posts, count } = await query
    .range((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE - 1)
    .order('created_at', { ascending: false })

  const totalPages = Math.ceil((count || 0) / POSTS_PER_PAGE)
  const hasPosts = posts && posts.length > 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white py-20 mb-12 rounded-b-3xl shadow-xl">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-fade-in">
            Blog Platform
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
            Discover insightful articles, AI‑powered summaries, and join the conversation.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link 
              href="/posts/new" 
              className="bg-white text-indigo-600 px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
            >
              ✍️ Write a post
            </Link>
            <Link 
              href="#posts" 
              className="bg-transparent border-2 border-white px-6 py-3 rounded-full font-semibold hover:bg-white hover:text-indigo-600 transition"
            >
              Explore ↓
            </Link>
          </div>
        </div>
        {/* Decorative wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-12">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="currentColor" className="fill-gray-100"></path>
          </svg>
        </div>
      </section>

      {/* Search & Posts Section */}
      <div id="posts" className="container mx-auto px-4 pb-16">
        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <form method="GET" className="relative">
            <input
              name="search"
              defaultValue={search}
              placeholder="🔍 Search articles by title or content..."
              className="w-full px-6 py-4 rounded-full border-2 border-gray-200 shadow-md focus:border-indigo-400 focus:outline-none transition text-lg"
            />
            <button 
              type="submit" 
              className="absolute right-2 top-2 bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition font-medium"
            >
              Search
            </button>
          </form>
        </div>

        {/* Posts Grid */}
        {!hasPosts ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-2xl font-semibold text-gray-700">No posts found</h3>
            <p className="text-gray-500 mt-2">Try a different search term or be the first to create a post!</p>
            <Link href="/posts/new" className="inline-block mt-6 bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition">
              Create first post →
            </Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article 
                  key={post.id} 
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full"
                >
                  {post.image_url && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={post.image_url} 
                        alt={post.title} 
                        className="w-full h-full object-cover transition duration-500 hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <span>{post.author?.name || 'Anonymous'}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.summary || '✨ No summary available – click to read full post.'}
                    </p>
                    <div className="mt-auto flex justify-between items-center">
                      <Link 
                        href={`/posts/${post.id}`} 
                        className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-800 transition"
                      >
                        Read full article
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                      <span className="text-xs text-gray-400">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-12">
                {currentPage > 1 && (
                  <Link
                    href={`/?page=${currentPage - 1}&search=${search}`}
                    className="px-5 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition shadow-sm"
                  >
                    ← Previous
                  </Link>
                )}
                <span className="px-5 py-2 bg-indigo-600 text-white rounded-full shadow-md">
                  Page {currentPage} of {totalPages}
                </span>
                {currentPage < totalPages && (
                  <Link
                    href={`/?page=${currentPage + 1}&search=${search}`}
                    className="px-5 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition shadow-sm"
                  >
                    Next →
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p>© 2025 Blog Platform – Powered by Next.js, Supabase & Google AI</p>
          <p className="text-sm text-gray-400 mt-2">Share your thoughts, get AI summaries, and engage with the community.</p>
        </div>
      </footer>
    </div>
  )
}
