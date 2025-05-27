import { type SubmitHandler, useForm } from 'react-hook-form';

import { Button } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import * as yup from 'yup';

import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import { Input } from '~/components/Form/Input';
import { PasswordInput } from '~/components/Form/PasswordInput';
import Template from '~/components/Template';
import { useAuth } from '~/contexts/AuthContext';
import type ISignIn from '~/models/ISignIn';
import supabase from '~/services/supabase';

export default function Login() {
  const { signIn } = useAuth();

  const signInFormSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ISignIn>({
    resolver: yupResolver(signInFormSchema),
  });

  const handleSignIn: SubmitHandler<ISignIn> = async (data) => {
    await signIn(data);
  };

  return (
    <>
      <Head>
        <title>Entrar - CS Manager</title>
      </Head>
      <Template>
        <Card maxW={600}>
          <CardHeader title="Entrar" />
          <CardBody as="form" onSubmit={handleSubmit(handleSignIn)}>
            <Input
              type="email"
              label="E-mail"
              placeholder="E-mail"
              error={errors.email}
              {...register('email')}
              isDisabled={isSubmitting}
              isRequired
            />

            <PasswordInput
              label="Senha"
              placeholder="Senha"
              error={errors.password}
              {...register('password')}
              isDisabled={isSubmitting}
              isRequired
            />

            <Button colorScheme="blue" type="submit" mt="6" isLoading={isSubmitting}>
              Entrar
            </Button>
            {/* <Button
              colorScheme="green"
              variant="outline"
              mt="6"
              isDisabled={isSubmitting}
              onClick={() => Router.push('/register')}
            >
              Registrar-se
            </Button> */}
          </CardBody>
        </Card>
      </Template>
    </>
  );
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  try {
    const { 'csm.token': token } = parseCookies(context);
    if (!token) {
      return {
        props: {},
      };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (!user) {
      return {
        props: {},
      };
    }

    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  } catch {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};
