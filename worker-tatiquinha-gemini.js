/**
 * Tati Quinha IA | Cloudflare Worker + Gemini API
 *
 * IMPORTANTE:
 * - NÃO coloque a API key no GitHub Pages.
 * - NÃO cole a API key neste arquivo.
 * - Configure a chave como Secret no Cloudflare:
 *
 *   npx wrangler secret put GEMINI_API_KEY
 *
 * Endpoint:
 * POST /
 * Body: { pergunta: string, contexto: object }
 */

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    if (request.method !== "POST") {
      return json({ erro: "Use POST." }, 405);
    }

    try {
      const body = await request.json();
      const pergunta = String(body.pergunta || "").slice(0, 2000);
      const contexto = body.contexto || {};

      if (!pergunta.trim()) {
        return json({ erro: "Pergunta vazia." }, 400);
      }

      if (!env.GEMINI_API_KEY) {
        return json({
          erro: "GEMINI_API_KEY não configurada.",
          detalhe: "Configure a chave como Secret no Cloudflare Worker."
        }, 500);
      }

      const fontes = Array.isArray(contexto.fontes) ? contexto.fontes.slice(0, 80) : [];

      const prompt = `
Você é a Tati Quinha IA, assistente da plataforma GeoTática.

Objetivo:
Ajudar usuários a encontrar fontes de dados geográficos, estatísticos e territoriais dentro da curadoria GeoTática.

Regras:
- Responda em português do Brasil.
- Use linguagem clara, técnica e objetiva.
- Use apenas as fontes fornecidas no contexto.
- Não invente links, órgãos, bases, disponibilidade ou formatos.
- Se não houver fonte suficiente, diga que não encontrou na curadoria enviada.
- Sugira termos de busca úteis dentro da plataforma.
- Quando citar fontes, inclua nome e URL.
- Reforce que o usuário deve conferir a fonte original antes de uso técnico.

Pergunta da pessoa:
${pergunta}

Fontes disponíveis no contexto:
${JSON.stringify(fontes, null, 2)}
`;

      const model = "gemini-2.0-flash";
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`;

      const geminiResp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.35,
            topP: 0.9,
            maxOutputTokens: 900
          }
        })
      });

      if (!geminiResp.ok) {
        const errorText = await geminiResp.text();
        return json({ erro: "Falha na Gemini API.", detalhe: errorText }, 502);
      }

      const data = await geminiResp.json();
      const resposta = data?.candidates?.[0]?.content?.parts?.map(p => p.text).join("\n") || "Não consegui gerar uma resposta agora.";

      return json({ resposta });
    } catch (error) {
      return json({ erro: "Erro interno no Worker.", detalhe: error.message }, 500);
    }
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders()
    }
  });
}
