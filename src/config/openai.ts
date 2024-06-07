import OpenAI from 'openai';

import { OPENAI_API_KEY } from '~/config/constants';

export const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});
