import type { User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import supabase from '~/services/supabase';

export async function getAuthUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('csm.token')?.value;

    if (!token) {
      return null;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    return user ?? null;
  } catch {
    return null;
  }
}

export async function ensureAuthenticatedUser(): Promise<User> {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  return user;
}
