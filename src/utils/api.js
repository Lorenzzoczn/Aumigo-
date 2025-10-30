// Utilitário para fazer requisições à API de forma robusta

export const apiRequest = async (url, options = {}) => {
  try {
    console.log('🌐 Fazendo requisição para:', url, options);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log('📡 Resposta recebida:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    // Verificar se a resposta é válida
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorText = await response.text();
        if (errorText) {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorMessage;
        }
      } catch (e) {
        // Ignorar erro de parse do erro
      }
      throw new Error(errorMessage);
    }

    // Tentar fazer parse direto do JSON
    try {
      const data = await response.json();
      console.log('✅ JSON parseado com sucesso:', data);
      return data;
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse do JSON:', parseError);
      
      // Tentar obter o texto para debug
      try {
        const text = await response.text();
        console.error('📄 Conteúdo da resposta:', text);
      } catch (textError) {
        console.error('❌ Não foi possível obter o texto da resposta');
      }
      
      throw new Error('Resposta do servidor não é um JSON válido');
    }

  } catch (error) {
    console.error('❌ Erro na requisição:', error);
    throw error;
  }
};

export default apiRequest;