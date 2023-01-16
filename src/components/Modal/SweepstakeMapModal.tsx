import { forwardRef, ForwardRefRenderFunction, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { GiUnlitBomb } from 'react-icons/gi';
import { MdEmojiPeople } from 'react-icons/md';
import { RiUser3Fill, RiUser3Line } from 'react-icons/ri';
import { useMutation } from 'react-query';

import { ModalBody, ModalFooter, Stack, Divider, Flex, Icon } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { CancelSolidButton } from '~/components/Button/CancelSolidButton';
import { SaveSolidButton } from '~/components/Button/SaveSolidButton';
import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import { Modal, ModalHandle } from '~/components/Form/Modal';
import { NumberInput } from '~/components/Form/NumberInput';
import { TABLE_SWEEPSTAKE_MAPS } from '~/config/constants';
import { useFeedback } from '~/contexts/FeedbackContext';
import ISweepstakeMap from '~/models/Entity/Sweepstake/ISweepstakeMap';
import ISweepstakeMapModal from '~/models/Modal/ISweepstakeMapModal';
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
  const [recordModalProps, setRecordModalProps] = useState<ISweepstakeMapModal | undefined>({} as ISweepstakeMapModal);

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
  } = useForm<Partial<ISweepstakeMap>>({
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
            errorFeedbackToast('Atualizar Placar', error);
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

  const updateSweepstakMap = useMutation(
    async (sweepstakMap: Partial<ISweepstakeMap>) => {
      const { team_one_score_1, team_one_score_2, team_two_score_1, team_two_score_2 } = sweepstakMap;

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
    {
      onSuccess() {
        successFeedbackToast('Placar', 'Atualizado com sucesso!');
        queryClient.invalidateQueries([TABLE_SWEEPSTAKE_MAPS, recordModalProps?.sweepstakeMap?.sweepstake_id]);
        modalRef.current?.onCloseModal();
      },
      onError(error) {
        errorFeedbackToast('Placar', error);
      },
    }
  );

  const handleOk: SubmitHandler<Partial<ISweepstakeMap>> = async (data) => {
    await updateSweepstakMap.mutateAsync(data);
  };

  useImperativeHandle(
    ref,
    () => ({
      onOpenModal,
    }),
    [onOpenModal]
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
                    error={errors.team_two_score_1}
                    {...register('team_two_score_1')}
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
                    error={errors.team_one_score_2}
                    {...register('team_one_score_2')}
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
      <ModalFooter flexDirection={['column-reverse', 'row']} justifyContent="space-between" gap="3">
        <CancelSolidButton onClick={() => modalRef.current?.onCloseModal()} isDisabled={isSubmitting} />
        <SaveSolidButton type="submit" isLoading={isSubmitting} />
      </ModalFooter>
    </Modal>
  );
};

export const SweepstakeMapModal = forwardRef(SweepstakeMapModalBase);
