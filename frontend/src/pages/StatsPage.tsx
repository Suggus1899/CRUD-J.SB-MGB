import { useState, useEffect, ReactNode } from 'react'
import api from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { StatsDto } from '@/types'
import { BarChart2, CheckCircle, Clock, AlertCircle, ListTodo } from 'lucide-react'
import toast from 'react-hot-toast'

export default function StatsPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<StatsDto | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [view, setView] = useState<'me' | 'global'>('me')

  async function loadStats(v: 'me' | 'global'): Promise<void> {
    setLoading(true)
    try {
      const endpoint = v === 'global' ? '/stats/global' : '/stats/me'
      const { data } = await api.get(endpoint)
      setStats(data)
    } catch {
      toast.error('Error al cargar estadísticas')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadStats(view) }, [view])

  if (loading) return <div className="flex justify-center py-24 text-slate-400">Cargando estadísticas…</div>
  if (!stats) return null

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BarChart2 className="text-indigo-600" size={22} />
          <h1 className="text-xl font-bold text-slate-900">Estadísticas</h1>
        </div>
        {user?.role === 'ROLE_ADMIN' && (
          <div className="flex rounded-lg overflow-hidden border border-slate-200">
            {['me', 'global'].map(v => (
              <button
                key={v}
                onClick={() => setView(v as 'me' | 'global')}
                className={`px-4 py-1.5 text-sm font-medium transition-colors ${view === v ? 'bg-indigo-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
              >
                {v === 'me' ? 'Mis tareas' : 'Global'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<ListTodo size={20} />} label="Total" value={stats.totalTasks} color="indigo" />
        <StatCard icon={<CheckCircle size={20} />} label="Completadas" value={stats.completedTasks} color="green" />
        <StatCard icon={<Clock size={20} />} label="En progreso" value={stats.inProgressTasks} color="blue" />
        <StatCard icon={<AlertCircle size={20} />} label="Vencidas" value={stats.overdueTasks} color="red" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* By Status */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Por estado</h2>
          <div className="flex flex-col gap-3">
            {Object.entries(stats.byStatus || {}).map(([status, count]) => (
              <BarRow
                key={status}
                label={status === 'PENDING' ? 'Pendiente' : status === 'IN_PROGRESS' ? 'En progreso' : 'Completada'}
                count={count}
                total={stats.totalTasks}
                color={status === 'COMPLETED' ? 'bg-green-500' : status === 'IN_PROGRESS' ? 'bg-blue-500' : 'bg-yellow-400'}
              />
            ))}
          </div>
        </div>

        {/* By Priority */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h2 className="font-semibold text-slate-800 mb-4">Por prioridad</h2>
          <div className="flex flex-col gap-3">
            {Object.entries(stats.byPriority || {}).map(([priority, count]) => (
              <BarRow
                key={priority}
                label={priority === 'LOW' ? 'Baja' : priority === 'MEDIUM' ? 'Media' : 'Alta'}
                count={count}
                total={stats.totalTasks}
                color={priority === 'HIGH' ? 'bg-red-500' : priority === 'MEDIUM' ? 'bg-orange-400' : 'bg-slate-300'}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: ReactNode; label: string; value: number; color: string }) {
  const colors: Record<string, string> = {
    indigo: 'bg-indigo-50 text-indigo-600',
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
  }
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col gap-2">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors[color] ?? ''}`}>{icon}</div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  )
}

function BarRow({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-700">{label}</span>
        <span className="font-medium text-slate-900">{count}</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
