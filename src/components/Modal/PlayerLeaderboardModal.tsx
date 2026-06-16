import { Stack } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { type Ref, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import type { InferType } from 'yup';
import * as yup from 'yup';

import { CancelOutlineButton } from '~/components/Button/CancelOutlineButton';
import { SaveSolidButton } from '~/components/Button/SaveSolidButton';
import { Input } from '~/components/Form/Input';
import { Modal, ModalBody, ModalFooter, type ModalHandle } from '~/components/Form/Modal';
import { NumberInput } from '~/components/Form/NumberInput';
import { useFeedback } from '~/contexts/FeedbackContext';
import type IPlayerLeaderboardAPI from '~/models/Entity/Leaderboard/IPlayerLeaderboardAPI';
import type ISelectOption from '~/models/ISelectOption';
import type IPlayerLeaderboardModal from '~/models/Modal/IPlayerLeaderboardModal';

import { Select } from '../Form/Select';

export type PlayerLeaderboardModalHandle = {
  onOpenModal: (recordModal: IPlayerLeaderboardModal) => void;
};

export const PlayerLeaderboardModal = ({ ref }: { ref?: Ref<PlayerLeaderboardModalHandle> }) => {
  const modalRef = useRef<ModalHandle>(null);

  const { warningFeedbackToast } = useFeedback();
  const [recordModalProps, setRecordModalProps] = useState<IPlayerLeaderboardModal | undefined>();
  const [playerOptions, setPlayerOptions] = useState<ISelectOption[]>([]);

  const playerLeaderboardSchema = yup.object().shape({
    player: yup
      .object()
      .shape({
        id: yup.string().required(),
        name: yup.string(),
      })
      .nullable()
      .required(),
    name: yup.string().required(),
    kills: yup.number().min(0).required(),
    deaths: yup.number().min(0).required(),
    assistances: yup.number().min(0).required(),
    headshot_percentage: yup.number().min(0).max(100).required(),
    damage: yup.number().min(0).required(),
  });

  const {
    setValue,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(playerLeaderboardSchema),
  });

  const onOpenModal = useCallback(
    (recordModal: IPlayerLeaderboardModal) => {
      setRecordModalProps(recordModal);
      setPlayerOptions(recordModal.players.map(player => ({ id: player.id, name: player.name })));
      if (recordModal?.playerLeaderboard) {
        reset(recordModal?.playerLeaderboard);
        modalRef.current?.onOpenModal();
      } else {
        warningFeedbackToast('Ranking do Jogador', 'Ranking não informado!');
        modalRef.current?.onCloseModal();
      }
    },
    [warningFeedbackToast, reset]
  );

  const handleOk: SubmitHandler<InferType<typeof playerLeaderboardSchema>> = async data => {
    await recordModalProps?.onSubmit(data as IPlayerLeaderboardAPI);
    modalRef.current?.onCloseModal();
  };

  useImperativeHandle(
    ref,
    () => ({
      onOpenModal,
    }),
    [onOpenModal]
  );

  return (
    <Modal title={watch('name')} ref={modalRef} size="md" onSubmit={handleSubmit(handleOk)}>
      <ModalBody>
        <Stack gap="4">
          <Select
            label="Jogador"
            options={playerOptions}
            value={watch('player') as ISelectOption}
            error={errors.player?.id}
            {...register('player')}
            disabled={isSubmitting}
            required
            isSearchable
            onChange={option => {
              setValue('player', option);
            }}
          />
          <Stack direction={['column', 'row']}>
            <NumberInput label="Vítimas" error={errors.kills} {...register('kills')} disabled={isSubmitting} required />
            <Input label="Mortes" error={errors.deaths} {...register('deaths')} disabled={isSubmitting} required />
            <NumberInput
              label="Assistências"
              error={errors.assistances}
              {...register('assistances')}
              disabled={isSubmitting}
              required
            />
          </Stack>
          <Stack direction={['column', 'row']}>
            <Input
              label="% Headshot"
              error={errors.headshot_percentage}
              {...register('headshot_percentage')}
              disabled={isSubmitting}
              required
            />
            <NumberInput label="Dano" error={errors.damage} {...register('damage')} disabled={isSubmitting} required />
          </Stack>
        </Stack>
      </ModalBody>
      <ModalFooter flexDir="column" gap="4">
        <SaveSolidButton w="100%" type="submit" loading={isSubmitting} />
        <CancelOutlineButton w="100%" onClick={() => modalRef.current?.onCloseModal()} disabled={isSubmitting} />
      </ModalFooter>
    </Modal>
  );
};
