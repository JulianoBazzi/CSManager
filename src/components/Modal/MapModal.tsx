import { forwardRef, ForwardRefRenderFunction, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';

import { Checkbox, ModalBody, ModalFooter, Stack } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { games } from '~/assets/games';
import { maps } from '~/assets/maps';
import { AddSolidButton } from '~/components/Button/AddSolidButton';
import { CancelSolidButton } from '~/components/Button/CancelSolidButton';
import { SaveSolidButton } from '~/components/Button/SaveSolidButton';
import { Input } from '~/components/Form/Input';
import { Modal, ModalHandle } from '~/components/Form/Modal';
import { Select } from '~/components/Form/Select';
import { TABLE_PLAYERS } from '~/config/constants';
import { useFeedback } from '~/contexts/FeedbackContext';
import IMap from '~/models/Entity/Map/IMap';
import IPlayer from '~/models/Entity/Player/IPlayer';
import IRecordModal from '~/models/Modal/IRecordModal';
import { getMap } from '~/services/hooks/useMaps';
import { queryClient } from '~/services/queryClient';
import supabase from '~/services/supabase';

export type MapModalHandle = {
  onOpenModal: (recordModal?: IRecordModal) => void;
};

const MapModalBase: ForwardRefRenderFunction<MapModalHandle> = (any, ref) => {
  const modalRef = useRef<ModalHandle>(null);

  const { errorFeedbackToast, successFeedbackToast } = useFeedback();
  const [isLoading, setIsLoading] = useState(false);
  const [recordModalProps, setRecordModalProps] = useState<IRecordModal | undefined>({} as IRecordModal);

  const playerSchema = yup.object().shape({
    name: yup.string().min(3).required(),
    active: yup.boolean().required(),
    map_type: yup
      .object()
      .shape({
        id: yup.string().required(),
        name: yup.string(),
      })
      .nullable()
      .required(),
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
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Partial<IMap>>({
    resolver: yupResolver(playerSchema),
  });

  const onOpenModal = useCallback(
    (recordModal?: IRecordModal) => {
      setRecordModalProps(recordModal);
      if (recordModal?.id) {
        setIsLoading(true);
        getMap(recordModal?.id, recordModal?.userId)
          .then((response) => {
            reset({
              ...response,
              map_type: maps.find((map) => map.id === response.map_type),
              game_type: games.find((game) => game.id === response.game_type),
            });
          })
          .catch((error) => {
            errorFeedbackToast('Mapa', error);
            modalRef.current?.onCloseModal();
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        reset({});
      }
      modalRef.current?.onOpenModal();
    },
    [errorFeedbackToast, reset]
  );

  const createOrUpdatePlayer = useMutation(
    async (player: Partial<IPlayer>) => {
      const { id, name, username, patent, active } = player;

      await supabase.from(TABLE_PLAYERS).upsert({
        id,
        user_id: recordModalProps?.userId,
        name,
        username,
        patent: patent?.id,
        active,
      });
    },
    {
      async onSuccess() {
        successFeedbackToast('Mapa', `${recordModalProps?.id ? 'Atualizado' : 'Cadastrada'} com sucesso!`);
        await queryClient.invalidateQueries(TABLE_PLAYERS);
        modalRef.current?.onCloseModal();
      },
      onError(error) {
        errorFeedbackToast('Mapa', error);
      },
    }
  );

  const handleOk: SubmitHandler<Partial<IPlayer>> = async (data) => {
    await createOrUpdatePlayer.mutateAsync(data);
  };

  useImperativeHandle(
    ref,
    () => ({
      onOpenModal,
    }),
    [onOpenModal]
  );

  return (
    <Modal title="Mapa" ref={modalRef} size="3xl" onSubmit={handleSubmit(handleOk)}>
      <ModalBody>
        <Stack>
          <Input
            label="Nome"
            error={errors.name}
            {...register('name')}
            isLoading={isLoading}
            isDisabled={isSubmitting}
            isRequired
            autoFocus
          />
          <Select
            label="Categoria"
            options={maps}
            value={watch('map_type')}
            error={errors.map_type?.id}
            {...register('map_type')}
            isLoading={isLoading}
            isDisabled={isSubmitting}
            isRequired
            onChange={(option) => {
              setValue('map_type', option);
            }}
          />
          <Select
            label="Jogo"
            options={games}
            value={watch('game_type')}
            error={errors.game_type?.id}
            {...register('game_type')}
            isLoading={isLoading}
            isDisabled={isSubmitting}
            isRequired
            onChange={(option) => {
              setValue('game_type', option);
            }}
          />
          <Checkbox {...register('active')} isDisabled={isLoading || isSubmitting}>
            Ativo
          </Checkbox>
        </Stack>
      </ModalBody>
      <ModalFooter flexDirection={['column-reverse', 'row']} justifyContent="space-between" gap="3">
        <CancelSolidButton onClick={() => modalRef.current?.onCloseModal()} isDisabled={isSubmitting || isLoading} />
        {recordModalProps?.id ? (
          <SaveSolidButton type="submit" isLoading={isSubmitting} isDisabled={isLoading} />
        ) : (
          <AddSolidButton type="submit" isLoading={isSubmitting} isDisabled={isLoading} />
        )}
      </ModalFooter>
    </Modal>
  );
};

export const MapModal = forwardRef(MapModalBase);
