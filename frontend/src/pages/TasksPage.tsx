import { useState, useEffect, useCallback, FormEvent } from 'react'
import api from '@/lib/api'
import { TaskDto, TaskStatus, Priority, Page } from '@/types'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { formatDate, isOverdue } from '@/lib/utils'
import { Plus, Pencil, Trash2, MessageSquare, Clock, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import { CommentsModal } from '@/components/tasks/CommentsModal'

const STATUS_OPTIONS = ['PENDING', 'IN_PROGRESS', 'COMPLETED']
const PRIORITY_OPTIONS = ['LOW', 'MEDIUM', 'HIGH']

const STATUS_LABELS: Record<string, string> = { PENDING: 'Pendiente', IN_PROGRESS: 'En progreso', COMPLETED: 'Completada' }
const PRIORITY_LABELS: Record<string, string> = { LOW: 'Baja', MEDIUM: 'Media', HIGH: 'Alta' }

interface TaskForm {
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  tags: string
  dueDate: string
}

const emptyForm: TaskForm = { title: '', description: '', status: 'PENDING', priority: 'MEDIUM', tags: '', dueDate: '' }

export default function TasksPage() {
  const [tasks, setTasks] = useState<TaskDto[]>([])
  const [page, setPage] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [filters, setFilters] = useState<{ status: string; priority: string; tag: string }>({ status: '', priority: '', tag: '' })
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [editing, setEditing] = useState<TaskDto | null>(null)
  const [form, setForm] = useState<TaskForm>(emptyForm)
  const [commentsTaskId, setCommentsTaskId] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const fetchTasks = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), size: '10', sort: 'createdAt,desc' })
      if (filters.status) params.set('status', filters.status)
      if (filters.priority) params.set('priority', filters.priority)
      if (filters.tag) params.set('tag', filters.tag)
      const { data } = await api.get<Page<TaskDto>>(`/tasks?${params}`)
      setTasks(data.content)
      setTotalPages(data.totalPages)
    } catch {
      toast.error('Error al cargar tareas')
    } finally {
      setLoading(false)
    }
  }, [page, filters])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setModalOpen(true)
  }

  function openEdit(task: TaskDto): void {
    setEditing(task)
    setForm({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      tags: task.tags?.join(', ') || '',
      dueDate: task.dueDate || '',
    })
    setModalOpen(true)
  }

  async function handleSave(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    const payload = {
      title: form.title,
      description: form.description,
      status: form.status,
      priority: form.priority,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      dueDate: form.dueDate || null,
    }
    try {
      if (editing) {
        await api.put(`/tasks/${editing.id}`, payload)
        toast.success('Tarea actualizada')
      } else {
        await api.post('/tasks', payload)
        toast.success('Tarea creada')
      }
      setModalOpen(false)
      void fetchTasks()
    } catch {
      toast.error('Error al guardar la tarea')
    }
  }

  async function handleDelete(id: string): Promise<void> {
    if (!confirm('¿Eliminar esta tarea?')) return
    try {
      await api.delete(`/tasks/${id}`)
      toast.success('Tarea eliminada')
      fetchTasks()
    } catch {
      toast.error('Error al eliminar')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-slate-900">Mis Tareas</h1>
        <Button onClick={openCreate} size="sm">
          <Plus size={15} /> Nueva tarea
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <select
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={filters.status}
          onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPage(0) }}
        >
          <option value="">Todos los estados</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
        <select
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={filters.priority}
          onChange={e => { setFilters(f => ({ ...f, priority: e.target.value })); setPage(0) }}
        >
          <option value="">Todas las prioridades</option>
          {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
        </select>
        <input
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Filtrar por etiqueta…"
          value={filters.tag}
          onChange={e => { setFilters(f => ({ ...f, tag: e.target.value })); setPage(0) }}
        />
      </div>

      {/* Task list */}
      {loading ? (
        <div className="flex justify-center py-16 text-slate-400">Cargando…</div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-slate-400">
          <p className="text-lg">No hay tareas</p>
          <p className="text-sm mt-1">Crea tu primera tarea con el botón de arriba</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={openEdit}
              onDelete={handleDelete}
              onComments={setCommentsTaskId}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-6">
          <Button variant="secondary" size="sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>Anterior</Button>
          <span className="text-sm text-slate-600">Página {page + 1} de {totalPages}</span>
          <Button variant="secondary" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Siguiente</Button>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar tarea' : 'Nueva tarea'}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <Input label="Título *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required maxLength={100} />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700">Descripción</label>
            <textarea
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={3}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Estado</label>
              <select
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as TaskStatus }))}
              >
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-slate-700">Prioridad</label>
              <select
                className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value as Priority }))}
              >
                {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{PRIORITY_LABELS[p]}</option>)}
              </select>
            </div>
          </div>
          <Input label="Etiquetas (separadas por coma)" placeholder="trabajo, urgente, personal" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} />
          <Input label="Fecha límite" type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
          <div className="flex justify-end gap-2 mt-2">
            <Button type="button" variant="secondary" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit">{editing ? 'Guardar cambios' : 'Crear tarea'}</Button>
          </div>
        </form>
      </Modal>

      {/* Comments Modal */}
      {commentsTaskId && (
        <CommentsModal taskId={commentsTaskId} onClose={() => setCommentsTaskId(null)} />
      )}
    </div>
  )
}

interface TaskCardProps {
  task: TaskDto
  onEdit: (task: TaskDto) => void
  onDelete: (id: string) => void
  onComments: (id: string) => void
}

function TaskCard({ task, onEdit, onDelete, onComments }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate, task.status)
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow px-5 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-slate-900 truncate">{task.title}</h3>
            <Badge label={task.status === 'PENDING' ? 'Pendiente' : task.status === 'IN_PROGRESS' ? 'En progreso' : 'Completada'} variant={task.status} />
            <Badge label={task.priority === 'LOW' ? 'Baja' : task.priority === 'MEDIUM' ? 'Media' : 'Alta'} variant={task.priority} />
            {overdue && <Badge label="Vencida" variant="overdue" />}
          </div>
          {task.description && <p className="text-sm text-slate-500 truncate">{task.description}</p>}
          <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
            {task.dueDate && (
              <span className={`flex items-center gap-1 ${overdue ? 'text-red-500' : ''}`}>
                <Clock size={12} /> {formatDate(task.dueDate)}
              </span>
            )}
            {task.tags?.length > 0 && (
              <span className="flex items-center gap-1">
                <Tag size={12} />
                {task.tags.map(t => (
                  <span key={t} className="bg-slate-100 rounded px-1.5 py-0.5">{t}</span>
                ))}
              </span>
            )}
            <span>{task.comments?.length || 0} comentario(s)</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="sm" onClick={() => onComments(task.id)} title="Comentarios">
            <MessageSquare size={15} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(task)} title="Editar">
            <Pencil size={15} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(task.id)} title="Eliminar" className="hover:text-red-600">
            <Trash2 size={15} />
          </Button>
        </div>
      </div>
    </div>
  )
}
