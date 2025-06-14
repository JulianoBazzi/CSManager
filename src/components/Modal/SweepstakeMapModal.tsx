import {
  forwardRef, type ForwardRefRenderFunction, useCallback, useImperativeHandle, useRef, useState,
} from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { GiUnlitBomb } from 'react-icons/gi';
import { MdEmojiPeople } from 'react-icons/md';
import { RiUser3Fill, RiUser3Line } from 'react-icons/ri';

import {
  ModalBody, ModalFooter, Stack, Divider, Flex, Icon,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import * as yup from 'yup';
import type { InferType } from 'yup';

import { CancelOutlineButton } from '~/components/Button/CancelOutlineButton';
import { SaveSolidButton } from '~/components/Button/SaveSolidButton';
import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import { Modal, type ModalHandle } from '~/components/Form/Modal';
import { NumberInput } from '~/components/Form/NumberInput';
import { TABLE_SWEEPSTAKE_MAPS } from '~/config/constants';
import { useFeedback } from '~/contexts/FeedbackContext';
import type ISweepstakeMap from '~/models/Entity/Sweepstake/ISweepstakeMap';
import type ISweepstakeMapModal from '~/models/Modal/ISweepstakeMapModal';
import { getSweepstakeMap } from '~/services/hooks/useSweepstakeMaps';
import { queryClient } from '~/services/queryClient';
import supabase from '~/services/supabase';

export type SweepstakeMapModalHandle = {
  onOpenModal: (recordModal?: ISweepstakeMapModal) => void;
};

const SweepstakeMapModalBase: ForwardRefRenderFunction<SweepstakeMapModalHandle> = (any, ref) => {
  const modalRef = useRef<ModalHandle>(null);

  const { errorFeedbackToast, successFeedbackToast } = useFeedback();

  const [isLoading, setIsLoading] = useState(false);
  const [recordModalProps, setRecordModalProps] = useState<ISweepstakeMapModal | undefined>();

  const sweepstakeMapSchema = yup.object().shape({
    team_one_score_1: yup.number().min(0).max(99).required(),
    team_two_score_1: yup.number().min(0).max(99).required(),
    team_one_score_2: yup.number().min(0).max(99).required(),
    team_two_score_2: yup.number().min(0).max(99).required(),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(sweepstakeMapSchema),
  });

  const onOpenModal = useCallback(
    (recordModal?: ISweepstakeMapModal) => {
      setRecordModalProps(recordModal);
      if (recordModal?.id) {
        setIsLoading(true);
        getSweepstakeMap(recordModal?.id)
          .then((response) => {
            reset({
              ...response,
            });
          })
          .catch((error) => {
            errorFeedbackToast('Placar', error);
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
    [errorFeedbackToast, reset],
  );

  const updateSweepstakMap = useMutation(
    {
      mutationFn: async (sweepstakMap: ISweepstakeMap) => {
        const {
          team_one_score_1, team_one_score_2, team_two_score_1, team_two_score_2,
        } = sweepstakMap;

        await supabase
          .from(TABLE_SWEEPSTAKE_MAPS)
          .update({
            team_one_score_1,
            team_one_score_2,
            team_two_score_1,
            team_two_score_2,
          })
          .eq('id', recordModalProps?.id);
      },
      async onSuccess() {
        successFeedbackToast('Placar', 'Atualizado com sucesso!');
        await queryClient.invalidateQueries({ queryKey: [TABLE_SWEEPSTAKE_MAPS] });
        modalRef.current?.onCloseModal();
      },
      onError(error: Error) {
        errorFeedbackToast('Placar', error);
      },
    },
  );

  const handleOk: SubmitHandler<InferType<typeof sweepstakeMapSchema>> = async (data) => {
    await updateSweepstakMap.mutateAsync(data as ISweepstakeMap);
  };

  useImperativeHandle(
    ref,
    () => ({
      onOpenModal,
    }),
    [onOpenModal],
  );

  return (
    <Modal title="Atualizar Placar" ref={modalRef} onSubmit={handleSubmit(handleOk)}>
      <ModalBody>
        <Stack>
          <Card>
            <CardHeader
              icon={recordModalProps?.sweepstakeMap?.maps?.map_type === 'bomb' ? GiUnlitBomb : MdEmojiPeople}
              title={recordModalProps?.sweepstakeMap?.maps?.name || ''}
              size="sm"
            />
            <CardBody>
              <Stack divider={<Divider />}>
                <Flex align="center" gap="2">
                  <Icon
                    as={RiUser3Line}
                    color={recordModalProps?.sweepstakeMap?.team_start_from_terrorist === 0 ? 'red.500' : 'inherit'}
                  />
                  <NumberInput
                    error={errors.team_one_score_1}
                    {...register('team_one_score_1')}
                    isLoading={isLoading}
                    isDisabled={isSubmitting}
                    isRequired
                    autoFocus
                  />
                  <NumberInput
                    error={errors.team_one_score_2}
                    {...register('team_one_score_2')}
                    isLoading={isLoading}
                    isDisabled={isSubmitting}
                    isRequired
                  />
                </Flex>
                <Flex align="center" gap="2">
                  <Icon
                    as={RiUser3Fill}
                    color={recordModalProps?.sweepstakeMap?.team_start_from_terrorist === 1 ? 'red.500' : 'inherit'}
                  />
                  <NumberInput
                    error={errors.team_two_score_1}
                    {...register('team_two_score_1')}
                    isLoading={isLoading}
                    isDisabled={isSubmitting}
                    isRequired
                  />
                  <NumberInput
                    error={errors.team_two_score_2}
                    {...register('team_two_score_2')}
                    isLoading={isLoading}
                    isDisabled={isSubmitting}
                    isRequired
                  />
                </Flex>
              </Stack>
            </CardBody>
          </Card>
        </Stack>
      </ModalBody>
      <ModalFooter flexDir="column" gap="4">
        <SaveSolidButton w="100%" type="submit" isLoading={isSubmitting} />
        <CancelOutlineButton w="100%" onClick={() => modalRef.current?.onCloseModal()} isDisabled={isSubmitting} />
      </ModalFooter>
    </Modal>
  );
};

export const SweepstakeMapModal = forwardRef(SweepstakeMapModalBase);
