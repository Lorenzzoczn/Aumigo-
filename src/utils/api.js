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
      ok: response.ok,
      headers: Object.fromEntries(response.headers.entries())
    });

    // Verificar se a resposta é válida
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Erro HTTP:', response.status, errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Obter o texto da resposta
    const text = await response.text();
    console.log('📄 Texto da resposta:', text);

    // Verificar se há conteúdo
    if (!text || text.trim() === '') {
      console.error('❌ Resposta vazia do servidor');
      throw new Error('Servidor retornou resposta vazia');
    }

    // Tentar fazer parse do JSON
    let data;
    try {
      data = JSON.parse(text);
      console.log('✅ JSON parseado com sucesso:', data);
    } catch (parseError) {
      console.error('❌ Erro ao fazer parse do JSON:', parseError);
      console.error('📄 Conteúdo que causou erro:', text);
      throw new Error('Resposta do servidor não é um JSON válido');
    }

    return data;
  } catch (error) {
    console.error('❌ Erro na requisição:', error);
    throw error;
  }
};

export default apiRequest;