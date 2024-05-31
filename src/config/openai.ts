import OpenAI from 'openai';

import { NEXT_PUBLIC_OPENAI_API_KEY } from '~/config/constants';

export const openai = new OpenAI({
  apiKey: NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});
