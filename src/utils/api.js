// Utilitário para fazer requisições à API de forma robusta

// Função de fallback simples
const simpleFetch = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
};

export const apiRequest = async (url, options = {}) => {
  try {
    console.log('🌐 Fazendo requisição para:', url, options);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    console.log('📡 Resposta recebida:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      contentType: response.headers.get('content-type'),
      url: response.url
    });

    // Verificar se a resposta é válida
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorText = await response.text();
        console.log('📄 Texto do erro:', errorText);
        if (errorText) {
          // Tentar fazer parse se parecer JSON
          if (errorText.trim().startsWith('{')) {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
          } else {
            errorMessage = errorText;
          }
        }
      } catch (e) {
        console.log('❌ Erro ao processar mensagem de erro:', e);
      }
      throw new Error(errorMessage);
    }

    // Verificar se é realmente JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('⚠️ Content-Type não é JSON:', contentType);
    }

    // Obter o texto primeiro para debug
    const text = await response.text();
    console.log('📄 Texto da resposta:', text);
    console.log('📊 Detalhes:', {
      length: text.length,
      isEmpty: !text || text.trim().length === 0,
      startsWithBrace: text.trim().startsWith('{'),
      endsWithBrace: text.trim().endsWith('}')
    });

    // Verificar se há conteúdo
    if (!text || text.trim().length === 0) {
      throw new Error('Servidor retornou resposta vazia');
    }

    // Tentar fazer parse do JSON
    try {
      const data = JSON.parse(text);
      console.log('✅ JSON parseado com sucesso:', data);
      return data;
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse do JSON:', parseError);
      console.error('📄 Conteúdo que causou erro (primeiros 200 chars):', text.substring(0, 200));
      console.error('📊 Detalhes do erro:', {
        name: parseError.name,
        message: parseError.message,
        textLength: text.length,
        textType: typeof text
      });
      
      // Se o texto parece HTML, é provável que seja uma página de erro
      if (text.trim().toLowerCase().startsWith('<!doctype') || text.trim().toLowerCase().startsWith('<html')) {
        throw new Error('Servidor retornou HTML em vez de JSON - possível erro de roteamento');
      }
      
      throw new Error(`Resposta do servidor não é um JSON válido: ${parseError.message}`);
    }

  } catch (error) {
    console.error('❌ Erro na requisição robusta:', error);
    
    // Tentar fallback simples
    console.log('🔄 Tentando fallback simples...');
    try {
      const result = await simpleFetch(url, options);
      console.log('✅ Fallback funcionou:', result);
      return result;
    } catch (fallbackError) {
      console.error('❌ Fallback também falhou:', fallbackError);
      throw error; // Lançar o erro original
    }
  }
};

export default apiRequest;