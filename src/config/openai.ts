import OpenAI from 'openai';

import { OPENAI_API_KEY } from '~/config/constants';

if (!OPENAI_API_KEY) {
  throw new Error('Variável de ambiente ausente: OPENAI_API_KEY. Verifique o seu arquivo .env.');
}

export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});
