import { motion } from 'framer-motion'

const About = () => {
  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Sobre o <span className="gradient-text">Aumigo</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Somos uma plataforma dedicada a conectar animais que precisam de um lar 
            com famílias amorosas, criando laços que transformam vidas.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default About