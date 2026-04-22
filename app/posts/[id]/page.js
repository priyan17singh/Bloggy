import { createServerClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import CommentSection from '@/components/CommentSection'
import Link from 'next/link'
import { deletePost } from '@/app/actions/posts'

export default async function PostPage({ params }) {
  const { id } = await params
  const supabase = await createServerClient()
  const { data: post } = await supabase
    .from('posts')
    .select('*, author:users(id, name, role)')
    .eq('id', id)
    .single()
  if (!post) notFound()

  const { data: { user } } = await supabase.auth.getUser()
  let currentUser = null
  if (user) {
    const { data } = await supabase.from('users').select('*').eq('id', user.id).single()
    currentUser = data
  }

  const canEdit = currentUser && (currentUser.id === post.author.id || currentUser.role === 'admin')
  const canDelete = currentUser && currentUser.role === 'admin'

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold">{post.title}</h1>
      <p className="text-gray-600">By {post.author.name}</p>
      {post.image_url && <img src={post.image_url} alt={post.title} className="my-4 w-[80%] h-min rounded" />}
      <div className="prose max-w-none whitespace-pre-wrap">{post.body}</div>

      <div className="mt-4 flex gap-2">
        {canEdit && (
          <Link href={`/posts/${id}/edit`} className="bg-yellow-500 text-white px-3 py-1 rounded">
            Edit
          </Link>
        )}
        {canDelete && (
          <form action={async () => {
            'use server'
            await deletePost(id)
          }}>
            <button type="submit" className="bg-red-500 text-white px-3 py-1 rounded">
              Delete
            </button>
          </form>
        )}
      </div>

      <CommentSection postId={id} currentUser={currentUser} />
    </div>
  )
}