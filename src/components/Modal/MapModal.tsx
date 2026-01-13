import { ModalBody, ModalFooter, Stack } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { type ForwardRefRenderFunction, forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import type { InferType } from 'yup';
import * as yup from 'yup';

import { games } from '~/assets/games';
import { maps } from '~/assets/maps';
import { AddSolidButton } from '~/components/Button/AddSolidButton';
import { CancelOutlineButton } from '~/components/Button/CancelOutlineButton';
import { SaveSolidButton } from '~/components/Button/SaveSolidButton';
import { Input } from '~/components/Form/Input';
import { Modal, type ModalHandle } from '~/components/Form/Modal';
import { Select } from '~/components/Form/Select';
import { Switch } from '~/components/Form/Switch';
import { TABLE_MAPS } from '~/config/constants';
import { useFeedback } from '~/contexts/FeedbackContext';
import type IMap from '~/models/Entity/Map/IMap';
import type ISelectOption from '~/models/ISelectOption';
import type IRecordModal from '~/models/Modal/IRecordModal';
import { getMap } from '~/services/hooks/useMaps';
import { queryClient } from '~/services/queryClient';
import supabase from '~/services/supabase';

export type MapModalHandle = {
  onOpenModal: (recordModal?: IRecordModal) => void;
};

const MapModalBase: ForwardRefRenderFunction<MapModalHandle> = (_, ref) => {
  const modalRef = useRef<ModalHandle>(null);

  const { errorFeedbackToast, successFeedbackToast } = useFeedback();
  const [isLoading, setIsLoading] = useState(false);
  const [recordModalProps, setRecordModalProps] = useState<IRecordModal | undefined>();

  const mapSchema = yup.object().shape({
    name: yup.string().min(3).required(),
    active: yup.boolean().required(),
    map_type: yup
      .object()
      .shape({
        id: yup.lazy(value => (typeof value === 'number' ? yup.number() : yup.string()).required().nullable()),
        name: yup.string(),
      })
      .nullable()
      .required(),
    game_type: yup
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
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(mapSchema),
  });

  const onOpenModal = useCallback(
    (recordModal?: IRecordModal) => {
      setRecordModalProps(recordModal);
      if (recordModal?.id) {
        setIsLoading(true);
        getMap(recordModal?.id, recordModal?.user.id)
          .then(response => {
            reset({
              ...response,
              map_type: maps.find(map => map.id === response.map_type),
              game_type: games.find(game => game.id === response.game_type),
            });
          })
          .catch(error => {
            errorFeedbackToast('Mapa', error);
            modalRef.current?.onCloseModal();
          })
          .finally(() => {
            setIsLoading(false);
          });
      } else {
        reset({
          active: true,
          game_type: games.find(game => game.id === recordModal?.user.user_metadata.gameType),
        });
      }
      modalRef.current?.onOpenModal();
    },
    [errorFeedbackToast, reset]
  );

  const createOrUpdateMap = useMutation({
    mutationFn: async (map: IMap) => {
      const { id, name, game_type, map_type, active } = map;

      await supabase.from(TABLE_MAPS).upsert({
        id,
        user_id: recordModalProps?.user.id,
        name,
        map_type: map_type?.id,
        game_type: game_type?.id,
        active,
      });
    },
    async onSuccess() {
      successFeedbackToast('Mapa', `${recordModalProps?.id ? 'Atualizado' : 'Cadastrada'} com sucesso!`);
      await queryClient.invalidateQueries({ queryKey: [TABLE_MAPS] });
      modalRef.current?.onCloseModal();
    },
    onError(error: Error) {
      errorFeedbackToast('Mapa', error);
    },
  });

  const handleOk: SubmitHandler<InferType<typeof mapSchema>> = async data => {
    await createOrUpdateMap.mutateAsync(data as IMap);
  };

  useImperativeHandle(
    ref,
    () => ({
      onOpenModal,
    }),
    [onOpenModal]
  );

  return (
    <Modal title="Mapa" ref={modalRef} size="md" onSubmit={handleSubmit(handleOk)}>
      <ModalBody>
        <Stack spacing="4">
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
            value={watch('map_type') as ISelectOption}
            error={errors.map_type?.id}
            {...register('map_type')}
            isLoading={isLoading}
            isDisabled={isSubmitting}
            isRequired
            onChange={option => {
              setValue('map_type', option);
            }}
          />
          <Select
            label="Jogo"
            options={games}
            value={watch('game_type') as ISelectOption}
            error={errors.game_type?.id}
            {...register('game_type')}
            isLoading={isLoading}
            isDisabled={isSubmitting}
            isRequired
            onChange={option => {
              setValue('game_type', option);
            }}
          />
          <Switch
            label="Ativo"
            {...register('active')}
            isChecked={watch('active')}
            isDisabled={isLoading || isSubmitting}
          />
        </Stack>
      </ModalBody>
      <ModalFooter flexDir="column" gap="4">
        {recordModalProps?.id ? (
          <SaveSolidButton w="100%" type="submit" isLoading={isSubmitting} isDisabled={isLoading} />
        ) : (
          <AddSolidButton w="100%" type="submit" isLoading={isSubmitting} isDisabled={isLoading} />
        )}
        <CancelOutlineButton
          w="100%"
          onClick={() => modalRef.current?.onCloseModal()}
          isDisabled={isSubmitting || isLoading}
        />
      </ModalFooter>
    </Modal>
  );
};

export const MapModal = forwardRef(MapModalBase);
