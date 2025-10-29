import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 flex items-center justify-center z-50"
    >
      <div className="text-center">
        {/* Logo animado */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="text-6xl mr-3"
            >
              🐾
            </motion.div>
            <motion.h1
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl font-bold text-white"
            >
              Aumigo
            </motion.h1>
          </div>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-purple-100 text-lg font-medium"
          >
            Conectando corações e patas
          </motion.p>
        </motion.div>

        {/* Animação de loading */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-3 h-3 bg-white rounded-full"
            />
          ))}
        </div>

        {/* Ícones flutuantes */}
        <div className="relative">
          <motion.div
            animate={{
              y: [-10, 10, -10],
              x: [-5, 5, -5]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-20 -left-10"
          >
            <Heart className="w-6 h-6 text-pink-300 opacity-60" />
          </motion.div>
          
          <motion.div
            animate={{
              y: [10, -10, 10],
              x: [5, -5, 5]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute -top-16 -right-8"
          >
            <Sparkles className="w-5 h-5 text-yellow-300 opacity-60" />
          </motion.div>
        </div>

        {/* Mensagem inspiradora */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8"
        >
          <p className="text-purple-200 text-sm">
            Preparando um mundo melhor para nossos amigos...
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;