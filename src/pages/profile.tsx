import { SubmitHandler, useForm } from 'react-hook-form';

import { Button, CardFooter, Stack } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { User } from '@supabase/supabase-js';
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
import Head from 'next/head';
import { parseCookies } from 'nookies';
import * as yup from 'yup';

import { games } from '~/assets/games';
import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import { Input } from '~/components/Form/Input';
import { Select } from '~/components/Form/Select';
import Template from '~/components/Template';
import { useAuth } from '~/contexts/AuthContext';
import IProfile from '~/models/IProfile';
import supabase from '~/services/supabase';

interface IProfileProps extends GetServerSideProps {
  user: User;
}

const Profile: NextPage<IProfileProps> = ({ user }) => {
  const { updateProfile } = useAuth();

  const profileFormSchema = yup.object().shape({
    name: yup.string().required(),
    game_type: yup
      .object()
      .shape({
        id: yup.string().required(),
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
  } = useForm<IProfile>({
    resolver: yupResolver(profileFormSchema),
    defaultValues: {
      name: user.user_metadata.name,
      game_type: games.find((game) => game.id === user.user_metadata.gameType),
    },
  });

  const handleUpdateProfile: SubmitHandler<IProfile> = async (data) => {
    await updateProfile(data);
  };

  return (
    <>
      <Head>
        <title>Meu Perfil - CS Manager</title>
      </Head>
      <Template user={user}>
        <Card maxW={['100%', '600px']} as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
          <CardHeader title="Meu Perfil" />
          <CardBody>
            <Stack spacing="4">
              <Input
                label="Nome Completo"
                error={errors.name}
                {...register('name')}
                isDisabled={isSubmitting}
                isRequired
              />

              <Select
                label="Jogo Favorito"
                options={games}
                value={watch('game_type')}
                error={errors.game_type?.id}
                {...register('game_type')}
                isDisabled={isSubmitting}
                isRequired
                onChange={(option) => {
                  setValue('game_type', option);
                }}
              />
            </Stack>
          </CardBody>
          <CardFooter>
            <Button colorScheme="blue" type="submit" w="100%" isLoading={isSubmitting}>
              Atualizar Perfil
            </Button>
          </CardFooter>
        </Card>
      </Template>
    </>
  );
};

export default Profile;

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
        user: user,
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
