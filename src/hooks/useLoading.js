import { useState, useEffect } from 'react';

export const useLoading = (minLoadingTime = 2000) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simular carregamento de recursos
    const loadResources = async () => {
      try {
        // Aguardar tempo mínimo para mostrar o loading
        const startTime = Date.now();
        
        // Simular carregamento de dados iniciais
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Garantir tempo mínimo de loading para melhor UX
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadingTime - elapsedTime);
        
        if (remainingTime > 0) {
          await new Promise(resolve => setTimeout(resolve, remainingTime));
        }
        
        setIsReady(true);
        
        // Pequeno delay antes de remover o loading
        setTimeout(() => {
          setIsLoading(false);
        }, 300);
        
      } catch (error) {
        console.error('Erro durante o carregamento:', error);
        setIsLoading(false);
      }
    };

    loadResources();
  }, [minLoadingTime]);

  return { isLoading, isReady };
};