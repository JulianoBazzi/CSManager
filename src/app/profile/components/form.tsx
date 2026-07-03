'use client';

import { Button, CardFooter, Stack } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { findOptionById } from '@julianobazzi/utils';
import type { User } from '@supabase/supabase-js';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { RiUserSettingsLine } from 'react-icons/ri';
import type { InferType } from 'yup';
import * as yup from 'yup';

import { games } from '~/assets/games';
import { sweepstakeEngines } from '~/assets/sweepstakeEngines';
import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import { Input } from '~/components/Form/Input';
import { Select } from '~/components/Form/Select';
import Template from '~/components/Template';
import { useAuth } from '~/contexts/AuthContext';
import type IProfile from '~/models/IProfile';
import type ISelectOption from '~/models/ISelectOption';

interface IProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: IProfileFormProps) {
  const { updateProfile } = useAuth();

  const profileFormSchema = yup.object().shape({
    name: yup.string().required(),
    game_type: yup
      .object()
      .shape({
        id: yup.lazy(value => (typeof value === 'number' ? yup.number() : yup.string()).required().nullable()),
        name: yup.string(),
      })
      .nullable()
      .required(),
    engine: yup
      .object()
      .shape({
        id: yup.lazy(value => (typeof value === 'number' ? yup.number() : yup.string()).required().nullable()),
        name: yup.string(),
      })
      .nullable()
      .required(),
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(profileFormSchema),
    defaultValues: {
      name: user.user_metadata.name,
      game_type: findOptionById(games, user.user_metadata.gameType) ?? undefined,
      engine: findOptionById(sweepstakeEngines, user.user_metadata.sweepstakeEngine) ?? undefined,
    },
  });

  const handleUpdateProfile: SubmitHandler<InferType<typeof profileFormSchema>> = async data => {
    await updateProfile(data as IProfile);
  };

  return (
    <Template user={user}>
      <Card maxW={['100%', '600px']} as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
        <CardHeader icon={RiUserSettingsLine} title="Meu Perfil" />
        <CardBody>
          <Stack gap="4">
            <Input label="Nome Completo" error={errors.name} {...register('name')} disabled={isSubmitting} required />

            <Select
              label="Jogo Favorito"
              options={games}
              value={watch('game_type') as ISelectOption}
              error={errors.game_type?.id}
              {...register('game_type')}
              disabled={isSubmitting}
              required
              onChange={option => {
                setValue('game_type', option as ISelectOption);
              }}
            />

            <Select
              label="Método de Sorteio"
              options={sweepstakeEngines}
              value={watch('engine') as ISelectOption}
              error={errors.engine?.id}
              {...register('engine')}
              disabled={isSubmitting}
              required
              onChange={option => {
                setValue('engine', option as ISelectOption);
              }}
            />
          </Stack>
        </CardBody>
        <CardFooter>
          <Button colorPalette="blue" type="submit" w="100%" loading={isSubmitting}>
            Atualizar Perfil
          </Button>
        </CardFooter>
      </Card>
    </Template>
  );
}
