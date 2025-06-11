const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function interpretarTextoOCR(textoOCR) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // ou gpt-4 se você quiser mais precisão
      messages: [
        {
          role: "system",
          content: "Você é um assistente que extrai dados de uma procuração. Retorne um JSON com os campos: nome, cpf, profissão, estado_civil, endereco."
        },
        {
          role: "user",
          content: textoOCR
        }
      ]
    });

    const resposta = response.choices[0].message.content;

    try {
      return JSON.parse(resposta);
    } catch {
      console.warn("⚠️ GPT não respondeu JSON puro. Resposta:", resposta);
      return { erro: "GPT retornou resposta não estruturada", bruto: resposta };
    }
  } catch (err) {
    console.error("❌ Erro na chamada GPT:", err.message);
    return { erro: "falha ao usar o GPT", detalhe: err.message };
  }
}

module.exports = { interpretarTextoOCR };
