import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft, PawPrint } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="text-8xl md:text-9xl font-bold gradient-text mb-4"
            >
              404
            </motion.div>
            
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full text-white mb-6"
            >
              <PawPrint className="w-10 h-10" />
            </motion.div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Oops! Página não encontrada
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            Parece que este pet se perdeu! A página que você está procurando não existe.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="gradient" asChild>
              <Link to="/" className="inline-flex items-center">
                <Home className="w-5 h-5 mr-2" />
                Voltar ao Início
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="w-5 h-5 mr-2" />
              Página Anterior
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound