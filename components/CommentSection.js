'use client'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { addComment, deleteComment } from '@/app/actions/comments'

export default function CommentSection({ postId, currentUser }) {
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const supabase = createClient()

  useEffect(() => {
    const fetchComments = async () => {
      const { data } = await supabase
        .from('comments')
        .select('*, user:users(name, id)')
        .eq('post_id', postId)
        .order('created_at', { ascending: false })
      setComments(data || [])
    }
    fetchComments()

    const channel = supabase
      .channel('comments')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments', filter: `post_id=eq.${postId}` }, fetchComments)
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [postId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('postId', postId)
    formData.append('comment_text', newComment)
    await addComment(formData)
    setNewComment('')
  }

  const handleDelete = async (commentId) => {
    await deleteComment(commentId, postId)
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold">Comments</h3>
      {currentUser && (
        <form onSubmit={handleSubmit} className="my-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full border p-2 rounded"
            rows="3"
            placeholder="Write a comment..."
            required
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
            Post Comment
          </button>
        </form>
      )}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="border p-3 rounded">
            <p><strong>{comment.user?.name || 'Anonymous'}</strong></p>
            <p>{comment.comment_text}</p>
            {(currentUser?.id === comment.user_id || currentUser?.role === 'admin') && (
              <button onClick={() => handleDelete(comment.id)} className="text-red-500 text-sm mt-1">
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}