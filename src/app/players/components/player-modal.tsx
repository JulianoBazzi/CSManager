'use client';

import { Flex, Stack, Text } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { type Ref, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { Rating } from 'react-simple-star-rating';
import type { InferType } from 'yup';
import * as yup from 'yup';

import { AddSolidButton } from '~/components/Button/AddSolidButton';
import { CancelOutlineButton } from '~/components/Button/CancelOutlineButton';
import { SaveSolidButton } from '~/components/Button/SaveSolidButton';
import { Input } from '~/components/Form/Input';
import { Modal, ModalBody, ModalFooter, type ModalHandle } from '~/components/Form/Modal';
import { NumberInput } from '~/components/Form/NumberInput';
import { Switch } from '~/components/Form/Switch';
import { TABLE_PLAYERS } from '~/config/constants';
import { useFeedback } from '~/contexts/FeedbackContext';
import type IPlayer from '~/models/Entity/Player/IPlayer';
import type IRecordModal from '~/models/Modal/IRecordModal';
import { getPlayer } from '~/services/hooks/usePlayers';
import { queryClient } from '~/services/queryClient';
import supabase from '~/services/supabase';

export type PlayerModalHandle = {
  onOpenModal: (recordModal?: IRecordModal) => void;
};

export const PlayerModal = ({ ref }: { ref?: Ref<PlayerModalHandle> }) => {
  const modalRef = useRef<ModalHandle>(null);

  const { errorFeedbackToast, successFeedbackToast } = useFeedback();
  const [isLoading, setIsLoading] = useState(false);
  const [recordModalProps, setRecordModalProps] = useState<IRecordModal | undefined>();

  const playerSchema = yup.object().shape({
    name: yup.string().min(3).required(),
    username: yup.string().min(3).required(),
    steam_id: yup.string(),
    premier: yup.number().min(0).required(),
    rating: yup.number().min(0).max(5).required(),
    active: yup.boolean().required(),
    fetch_data: yup.boolean().required(),
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(playerSchema),
  });

  const onOpenModal = useCallback(
    (recordModal?: IRecordModal) => {
      setRecordModalProps(recordModal);
      if (recordModal?.id) {
        setIsLoading(true);
        getPlayer(recordModal?.id, recordModal?.user.id)
          .then(response => {
            reset(response);
          })
          .catch(error => {
            errorFeedbackToast('Jogador', error);
            modalRef.current?.onCloseModal();
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        reset({
          active: true,
          fetch_data: true,
        });
      }
      modalRef.current?.onOpenModal();
    },
    [errorFeedbackToast, reset]
  );

  const createOrUpdatePlayer = useMutation({
    mutationFn: async (player: IPlayer) => {
      const { id, name, username, steam_id, premier, rating, active, fetch_data } = player;

      await supabase.from(TABLE_PLAYERS).upsert({
        id,
        user_id: recordModalProps?.user.id,
        name,
        username,
        steam_id,
        premier,
        rating,
        active,
        fetch_data,
      });
    },
    async onSuccess() {
      successFeedbackToast('Jogador', `${recordModalProps?.id ? 'Atualizado' : 'Cadastrado'} com sucesso!`);
      await queryClient.invalidateQueries({ queryKey: [TABLE_PLAYERS] });
      modalRef.current?.onCloseModal();
    },
    onError(error: Error) {
      errorFeedbackToast('Jogador', error);
    },
  });

  const handleOk: SubmitHandler<InferType<typeof playerSchema>> = async data => {
    await createOrUpdatePlayer.mutateAsync(data as IPlayer);
  };

  useImperativeHandle(
    ref,
    () => ({
      onOpenModal,
    }),
    [onOpenModal]
  );

  return (
    <Modal title="Jogador" ref={modalRef} size="lg" onSubmit={handleSubmit(handleOk)} disableCloseButton={isSubmitting}>
      <ModalBody>
        <Stack gap="4">
          <Input
            label="Nome"
            error={errors.name}
            {...register('name')}
            loading={isLoading}
            disabled={isSubmitting}
            required
            autoFocus
          />
          <Input
            label="Usuário da Steam"
            error={errors.username}
            {...register('username')}
            loading={isLoading}
            disabled={isSubmitting}
            required
          />
          <Stack direction={['column', 'row']} gap="4">
            <Input
              label="Steam ID"
              error={errors.steam_id}
              {...register('steam_id')}
              loading={isLoading}
              disabled={isSubmitting}
              required
            />
            <NumberInput
              label="Ranking no Premier"
              error={errors.premier}
              {...register('premier')}
              loading={isLoading}
              disabled={isSubmitting}
              required
            />
          </Stack>
          <Text mr="auto" cursor="pointer" onClick={() => setValue('rating', 0)}>
            Avaliação
          </Text>
          <Flex mt="-4" justify="center">
            <Rating
              allowFraction
              transition
              initialValue={watch('rating')}
              onClick={value => setValue('rating', value)}
              size={50}
              emptyStyle={{ display: 'flex' }}
              SVGstyle={{ display: 'inline-block', marginBottom: 10 }}
              style={{ marginBottom: -10 }}
            />
          </Flex>
          <Stack direction="row" gap="4">
            <Flex w="200px" direction="column" gap="2">
              <Text>Ativo</Text>
              <Switch
                name="active"
                checked={watch('active') ?? false}
                loading={isLoading}
                disabled={isSubmitting}
                onCheckedChange={({ checked }) => setValue('active', checked)}
              />
            </Flex>
            <Flex w="200px" direction="column" gap="2">
              <Text>Buscar Dados</Text>
              <Switch
                name="fetch_data"
                checked={watch('fetch_data') ?? false}
                loading={isLoading}
                disabled={isSubmitting}
                onCheckedChange={({ checked }) => setValue('fetch_data', checked)}
              />
            </Flex>
          </Stack>
        </Stack>
      </ModalBody>
      <ModalFooter flexDir="column" gap="4">
        {recordModalProps?.id ? (
          <SaveSolidButton w="100%" type="submit" loading={isSubmitting} disabled={isLoading} />
        ) : (
          <AddSolidButton w="100%" type="submit" loading={isSubmitting} disabled={isLoading} />
        )}
        <CancelOutlineButton
          w="100%"
          onClick={() => modalRef.current?.onCloseModal()}
          disabled={isSubmitting || isLoading}
        />
      </ModalFooter>
    </Modal>
  );
};
