import { Button } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import type { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { RiLoginBoxLine } from 'react-icons/ri';
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

  const handleSignIn: SubmitHandler<ISignIn> = async data => {
    await signIn(data);
  };

  return (
    <>
      <Head>
        <title>Entrar - CS Manager</title>
      </Head>
      <Template>
        <Card maxW={600}>
          <CardHeader icon={RiLoginBoxLine} title="Entrar" />
          <CardBody as="form" onSubmit={handleSubmit(handleSignIn)}>
            <Input
              type="email"
              label="E-mail"
              placeholder="E-mail"
              error={errors.email}
              {...register('email')}
              disabled={isSubmitting}
              required
            />

            <PasswordInput
              label="Senha"
              placeholder="Senha"
              error={errors.password}
              {...register('password')}
              disabled={isSubmitting}
              required
            />

            <Button colorPalette="blue" type="submit" mt="6" loading={isSubmitting}>
              Entrar
            </Button>
            {/* <Button
              colorPalette="green"
              variant="outline"
              mt="6"
              disabled={isSubmitting}
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
