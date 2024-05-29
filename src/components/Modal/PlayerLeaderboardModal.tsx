import {
  forwardRef, ForwardRefRenderFunction, useCallback, useImperativeHandle, useRef, useState,
} from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { ModalBody, ModalFooter, Stack } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { InferType } from 'yup';

import { CancelOutlineButton } from '~/components/Button/CancelOutlineButton';
import { SaveSolidButton } from '~/components/Button/SaveSolidButton';
import { Input } from '~/components/Form/Input';
import { Modal, ModalHandle } from '~/components/Form/Modal';
import { NumberInput } from '~/components/Form/NumberInput';
import { useFeedback } from '~/contexts/FeedbackContext';
import IPlayerLeaderboardAPI from '~/models/Entity/Leaderboard/IPlayerLeaderboardAPI';
import ISelectOption from '~/models/ISelectOption';
import IPlayerLeaderboardModal from '~/models/Modal/IPlayerLeaderboardModal';

import { Select } from '../Form/Select';

export type PlayerLeaderboardModalHandle = {
  onOpenModal: (recordModal: IPlayerLeaderboardModal) => void;
};

const PlayerLeaderboardModalBase: ForwardRefRenderFunction<PlayerLeaderboardModalHandle> = (any, ref) => {
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
      setPlayerOptions(recordModal.players.map((player) => ({ id: player.id, name: player.name })));
      if (recordModal?.playerLeaderboard) {
        reset(recordModal?.playerLeaderboard);
        modalRef.current?.onOpenModal();
      } else {
        warningFeedbackToast('Ranking do Jogador', 'Ranking não informado!');
        modalRef.current?.onCloseModal();
      }
    },
    [warningFeedbackToast, reset],
  );

  const handleOk: SubmitHandler<InferType<typeof playerLeaderboardSchema>> = async (data) => {
    await recordModalProps?.onSubmit(data as IPlayerLeaderboardAPI);
    modalRef.current?.onCloseModal();
  };

  useImperativeHandle(
    ref,
    () => ({
      onOpenModal,
    }),
    [onOpenModal],
  );

  return (
    <Modal title={watch('name')} ref={modalRef} size="md" onSubmit={handleSubmit(handleOk)}>
      <ModalBody>
        <Stack spacing="4">
          <Select
            label="Jogador"
            options={playerOptions}
            value={watch('player') as ISelectOption}
            error={errors.player?.id}
            {...register('player')}
            isDisabled={isSubmitting}
            isRequired
            isSearchable
            onChange={(option) => {
              setValue('player', option);
            }}
          />
          <Stack direction={['column', 'row']}>
            <NumberInput
              label="Vítimas"
              error={errors.kills}
              {...register('kills')}
              isDisabled={isSubmitting}
              isRequired
            />
            <Input
              label="Mortes"
              error={errors.deaths}
              {...register('deaths')}
              isDisabled={isSubmitting}
              isRequired
            />
            <NumberInput
              label="Assistências"
              error={errors.assistances}
              {...register('assistances')}
              isDisabled={isSubmitting}
              isRequired
            />
          </Stack>
          <Stack direction={['column', 'row']}>
            <Input
              label="% Headshot"
              error={errors.headshot_percentage}
              {...register('headshot_percentage')}
              isDisabled={isSubmitting}
              isRequired
            />
            <NumberInput
              label="Dano"
              error={errors.damage}
              {...register('damage')}
              isDisabled={isSubmitting}
              isRequired
            />
          </Stack>
        </Stack>
      </ModalBody>
      <ModalFooter flexDir="column" gap="4">
        <SaveSolidButton w="100%" type="submit" isLoading={isSubmitting} />
        <CancelOutlineButton w="100%" onClick={() => modalRef.current?.onCloseModal()} isDisabled={isSubmitting} />
      </ModalFooter>
    </Modal>
  );
};

export const PlayerLeaderboardModal = forwardRef(PlayerLeaderboardModalBase);
