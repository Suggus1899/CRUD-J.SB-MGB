import { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { CheckSquare, BarChart2, Users, LogOut } from 'lucide-react'

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 font-bold text-indigo-600 text-base">
              <CheckSquare size={20} />
              To-Do App
            </Link>
            <div className="flex items-center gap-1">
              <NavLink to="/tasks" icon={<CheckSquare size={15} />}>Tareas</NavLink>
              <NavLink to="/stats" icon={<BarChart2 size={15} />}>Stats</NavLink>
              {user?.role === 'ROLE_ADMIN' && (
                <NavLink to="/users" icon={<Users size={15} />}>Usuarios</NavLink>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">
              Hola, <span className="font-medium text-slate-800">{user?.username}</span>
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-red-600 transition-colors"
            >
              <LogOut size={15} /> Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

function NavLink({ to, icon, children }: { to: string; icon: ReactNode; children: ReactNode }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
    >
      {icon}{children}
    </Link>
  )
}
