import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Heart, 
  Users, 
  PawPrint, 
  ArrowRight, 
  Star,
  Shield,
  Zap,
  Globe
} from 'lucide-react'

import { Button } from '@/components/ui/Button'

const Home = () => {
  const stats = [
    { label: 'Animais Adotados', value: '1,200+', icon: Heart },
    { label: 'ONGs Parceiras', value: '500+', icon: Users },
    { label: 'Cidades Atendidas', value: '50+', icon: Globe },
    { label: 'Famílias Felizes', value: '1,000+', icon: Star },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 lg:py-32">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <PawPrint className="w-4 h-4 mr-2" />
              Conectando corações e patas
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Encontre seu novo{' '}
              <span className="gradient-text">melhor amigo</span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Milhares de animais esperando por um lar cheio de amor e carinho. 
              Conectamos famílias amorosas com pets que precisam de um novo lar.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="xl" variant="gradient" asChild>
                <Link to="/animais" className="group">
                  Ver Animais Disponíveis
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild>
                <Link to="/sobre">Saiba Mais</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl text-white mb-4">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-16 h-16 bg-secondary/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-primary/5 rounded-full animate-float" style={{ animationDelay: '2s' }} />
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para fazer a diferença?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Junte-se à nossa comunidade e ajude a conectar animais com famílias amorosas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" variant="secondary" asChild>
                <Link to="/cadastro">Começar Agora</Link>
              </Button>
              <Button size="xl" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600" asChild>
                <Link to="/feed">Explorar Feed</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home