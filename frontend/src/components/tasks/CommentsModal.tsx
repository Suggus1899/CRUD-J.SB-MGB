import React, { useState, useEffect } from 'react'
import api from '@/lib/api'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Trash2, Send } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { CommentDto } from '@/types'
import toast from 'react-hot-toast'

interface CommentsModalProps {
  taskId: string
  onClose: () => void
}

export function CommentsModal({ taskId, onClose }: CommentsModalProps) {
  const [comments, setComments] = useState<CommentDto[]>([])
  const [text, setText] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const { user } = useAuth()

  async function load() {
    const { data } = await api.get(`/tasks/${taskId}/comments`)
    setComments(data)
  }

  useEffect(() => { load() }, [taskId])

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!text.trim()) return
    setLoading(true)
    try {
      await api.post(`/tasks/${taskId}/comments`, { text })
      setText('')
      load()
      toast.success('Comentario agregado')
    } catch {
      toast.error('Error al agregar comentario')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(commentId: string) {
    try {
      await api.delete(`/tasks/${taskId}/comments/${commentId}`)
      load()
      toast.success('Comentario eliminado')
    } catch {
      toast.error('No tienes permiso para eliminar este comentario')
    }
  }

  return (
    <Modal open={true} onClose={onClose} title="Comentarios">
      <div className="flex flex-col gap-3 max-h-72 overflow-y-auto mb-4">
        {comments.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-4">Sin comentarios aún</p>
        )}
        {comments.map(c => (
          <div key={c.id} className="flex items-start gap-2 bg-slate-50 rounded-lg p-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-indigo-600">{c.authorUsername || 'Usuario'}</p>
              <p className="text-sm text-slate-700 mt-0.5">{c.text}</p>
              <p className="text-xs text-slate-400 mt-1">{formatDate(c.createdAt)}</p>
            </div>
            {(c.authorUsername === user?.username || user?.role === 'ROLE_ADMIN') && (
              <button onClick={() => handleDelete(c.id)} className="text-slate-300 hover:text-red-500 mt-0.5">
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Escribe un comentario…"
          value={text}
          onChange={e => setText(e.target.value)}
          maxLength={500}
        />
        <Button type="submit" size="sm" disabled={loading}>
          <Send size={14} />
        </Button>
      </form>
    </Modal>
  )
}
