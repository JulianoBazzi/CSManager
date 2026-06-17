'use client';

import { Button, CardFooter, Stack } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import type { User } from '@supabase/supabase-js';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { RiLockPasswordLine } from 'react-icons/ri';
import type { InferType } from 'yup';
import * as yup from 'yup';

import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import { PasswordInput } from '~/components/Form/PasswordInput';
import Template from '~/components/Template';
import { useAuth } from '~/contexts/AuthContext';
import type IChangePassword from '~/models/IChangePassword';

interface IChangePasswordFormProps {
  user?: User;
}

export function ChangePasswordForm({ user }: IChangePasswordFormProps) {
  const { changePassword } = useAuth();

  const changePasswordFormSchema = yup.object().shape({
    password: yup.string().required(),
    password_confirmation: yup.string().oneOf([yup.ref('password')], 'As senhas devem ser iguais'),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(changePasswordFormSchema),
  });

  const handleChangePassword: SubmitHandler<InferType<typeof changePasswordFormSchema>> = async data => {
    await changePassword(data as IChangePassword);
  };

  return (
    <Template user={user}>
      <Card maxW={['100%', '600px']} as="form" onSubmit={handleSubmit(handleChangePassword)}>
        <CardHeader icon={RiLockPasswordLine} title="Alterar Senha" />
        <CardBody>
          <Stack gap="4">
            <PasswordInput
              label="Nova Senha"
              placeholder="Senha"
              error={errors.password}
              {...register('password')}
              disabled={isSubmitting}
              required
            />

            <PasswordInput
              label="Confirmar Nova Senha"
              placeholder="Confirmar Senha"
              error={errors.password_confirmation}
              {...register('password_confirmation')}
              disabled={isSubmitting}
              required
            />
          </Stack>
        </CardBody>
        <CardFooter>
          <Button colorPalette="blue" type="submit" w="100%" loading={isSubmitting}>
            Alterar Senha
          </Button>
        </CardFooter>
      </Card>
    </Template>
  );
}
