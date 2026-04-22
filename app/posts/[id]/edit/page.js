import { createServerClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { updatePost } from '@/app/actions/posts'
import AuthGuard from '@/components/AuthGuard'

export default async function EditPostPage({ params }) {
  const { id } = await params
  const supabase = await createServerClient()
  const { data: post } = await supabase
    .from('posts')
    .select('*, author:users(id)')
    .eq('id', id)
    .single()
  if (!post) notFound()

  const { data: { user } } = await supabase.auth.getUser()
  const { data: userData } = await supabase.from('users').select('role').eq('id', user?.id).single()
  const isAuthor = user?.id === post.author.id
  const isAdmin = userData?.role === 'admin'
  if (!isAuthor && !isAdmin) redirect('/unauthorized')

  const updatePostWithId = async (formData) => {
    'use server'
    await updatePost(id, formData)
    redirect(`/posts/${id}`)
  }

  return (
    <AuthGuard allowedRoles={['author', 'admin']}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
        <form action={updatePostWithId} className="space-y-4">
          <div>
            <label className="block font-medium">Title</label>
            <input name="title" defaultValue={post.title} required className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block font-medium">Image URL</label>
            <input name="image_url" defaultValue={post.image_url || ''} className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block font-medium">Body</label>
            <textarea name="body" rows="10" required defaultValue={post.body} className="w-full border p-2 rounded" />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Save Changes
          </button>
        </form>
      </div>
    </AuthGuard>
  )
}