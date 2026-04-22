import { createPost } from '@/app/actions/posts'
import AuthGuard from '@/components/AuthGuard'

export default function NewPostPage() {
  return (
    <AuthGuard allowedRoles={['author', 'admin']}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
        <form action={createPost} className="space-y-4">
          <div>
            <label className="block font-medium">Title</label>
            <input name="title" required className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block font-medium">Image URL</label>
            <input name="image_url" className="w-full border p-2 rounded" />
          </div>
          <div>
            <label className="block font-medium">Body</label>
            <textarea name="body" rows="10" required className="w-full border p-2 rounded" />
          </div>
          <button type="submit" className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded">
            Publish Post
          </button>
        </form>
      </div>
    </AuthGuard>
  )
}