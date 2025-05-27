import { type SubmitHandler, useForm } from 'react-hook-form';

import { Button, CardFooter, Stack } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import type { User } from '@supabase/supabase-js';
import type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import * as yup from 'yup';
import type { InferType } from 'yup';

import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import { PasswordInput } from '~/components/Form/PasswordInput';
import Template from '~/components/Template';
import { useAuth } from '~/contexts/AuthContext';
import type IChangePassword from '~/models/IChangePassword';
import supabase from '~/services/supabase';

interface IChangePasswordProps extends GetServerSideProps {
  user?: User;
}

const ChangePassword: NextPage<IChangePasswordProps> = ({ user }) => {
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
    <>
      <Head>
        <title>Alterar Senha - CS Manager</title>
      </Head>
      <Template user={user}>
        <Card maxW={['100%', '600px']} as="form" onSubmit={handleSubmit(handleChangePassword)}>
          <CardHeader title="Alterar Senha" />
          <CardBody>
            <Stack spacing="4">
              <PasswordInput
                label="Nova Senha"
                placeholder="Senha"
                error={errors.password}
                {...register('password')}
                isDisabled={isSubmitting}
                isRequired
              />

              <PasswordInput
                label="Confirmar Nova Senha"
                placeholder="Confirmar Senha"
                error={errors.password_confirmation}
                {...register('password_confirmation')}
                isDisabled={isSubmitting}
                isRequired
              />
            </Stack>
          </CardBody>
          <CardFooter>
            <Button colorScheme="blue" type="submit" w="100%" isLoading={isSubmitting}>
              Alterar Senha
            </Button>
          </CardFooter>
        </Card>
      </Template>
    </>
  );
};

export default ChangePassword;

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const { 'csm.token': token } = parseCookies(context);
    if (!token) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) {
      return {
        redirect: {
          destination: '/login',
          permanent: false,
        },
      };
    }

    return {
      props: {
        user,
      },
    };
  } catch {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
};
