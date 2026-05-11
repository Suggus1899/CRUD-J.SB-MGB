import { useState, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { CheckSquare } from 'lucide-react'
import toast from 'react-hot-toast'
import { getErrorMessage } from '@/lib/utils'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState<{ username: string; password: string }>({ username: '', password: '' })
  const [loading, setLoading] = useState<boolean>(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.username, form.password)
      navigate('/tasks')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Credenciales incorrectas'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 to-slate-100">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-indigo-100 text-indigo-600 rounded-full p-3 mb-3">
            <CheckSquare size={28} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">To-Do App</h1>
          <p className="text-slate-500 text-sm mt-1">Inicia sesión en tu cuenta</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Usuario"
            placeholder="tu_usuario"
            value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            required
          />
          <Input
            label="Contraseña"
            type="password"
            placeholder="••••••"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            required
          />
          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? 'Entrando…' : 'Iniciar sesión'}
          </Button>
        </form>
        <p className="text-center text-sm text-slate-500 mt-4">
          ¿No tienes cuenta?{' '}
          <Link to="/register" className="text-indigo-600 font-medium hover:underline">
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  )
}
