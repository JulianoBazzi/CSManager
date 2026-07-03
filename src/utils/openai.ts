interface CompletionLike {
  choices?: Array<{ message?: { content?: string | null } }>;
}

/**
 * Extrai e faz o parse do JSON retornado por uma chat completion da OpenAI.
 * Protege contra `choices` vazio/sem conteúdo e remove eventuais cercas de
 * código Markdown (```json ... ```). Lança erro quando não há conteúdo ou o
 * JSON é inválido, para que a rota trate no `catch`.
 */
export function parseJsonFromCompletion<T>(response: CompletionLike): T {
  const content = response.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('A resposta da OpenAI não retornou conteúdo.');
  }

  const cleaned = content
    .replace(/```json/gi, '')
    .replace(/```/g, '')
    .trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new Error('A resposta da OpenAI não retornou um JSON válido.');
  }
}
