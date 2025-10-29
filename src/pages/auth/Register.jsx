import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { PawPrint } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl text-white mb-4 shadow-soft"
          >
            <PawPrint className="w-8 h-8" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900">Junte-se ao Aumigo</h2>
          <p className="text-gray-600 mt-2">Crie sua conta e ajude a conectar pets com famílias</p>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-medium">
          <form className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome Completo
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Seu nome completo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            <Button type="submit" className="w-full" variant="gradient" size="lg">
              Criar Conta
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link
                to="/login"
                className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Entre aqui
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Register