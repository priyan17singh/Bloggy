import { createServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { deletePost } from '@/app/actions/posts'
import { deleteComment } from '@/app/actions/comments'

export default async function AdminPage() {
  const supabase = await createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (userData?.role !== 'admin') redirect('/unauthorized')

  // Fetch all posts
  const { data: posts } = await supabase
    .from('posts')
    .select('*, author:users(name)')
    .order('created_at', { ascending: false })

  // Fetch all comments with post title
  const { data: comments } = await supabase
    .from('comments')
    .select('*, post:posts(title), user:users(name)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">All Posts</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Title</th>
              <th className="border p-2">Author</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts?.map((post) => (
              <tr key={post.id}>
                <td className="border p-2">{post.title}</td>
                <td className="border p-2">{post.author?.name}</td>
                <td className="border p-2 space-x-2">
                  <Link href={`/posts/${post.id}/edit`} className="text-blue-500">Edit</Link>
                  <form action={async () => {
                    'use server'
                    await deletePost(post.id)
                  }} className="inline">
                    <button type="submit" className="text-red-500 ml-2">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">All Comments</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Comment</th>
              <th className="border p-2">User</th>
              <th className="border p-2">Post</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {comments?.map((comment) => (
              <tr key={comment.id}>
                <td className="border p-2">{comment.comment_text}</td>
                <td className="border p-2">{comment.user?.name}</td>
                <td className="border p-2">{comment.post?.title}</td>
                <td className="border p-2">
                  <form action={async () => {
                    'use server'
                    await deleteComment(comment.id, comment.post_id)
                  }}>
                    <button type="submit" className="text-red-500">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}