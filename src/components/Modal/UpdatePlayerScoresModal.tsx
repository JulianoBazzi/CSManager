import {
  type ForwardRefRenderFunction,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { ModalBody, ModalFooter, Progress, Spinner, Stack, Text } from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';

import { CancelOutlineButton } from '~/components/Button/CancelOutlineButton';
import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import { Modal, type ModalHandle } from '~/components/Form/Modal';
import { TABLE_PLAYERS } from '~/config/constants';
import { useFeedback } from '~/contexts/FeedbackContext';
import type IPlayerAPI from '~/models/Entity/Player/IPlayerAPI';
import type IRecordModal from '~/models/Modal/IRecordModal';
import { getLeetifyProfileScore } from '~/services/hooks/useLeetifyProfile';
import { getPlayers } from '~/services/hooks/usePlayers';
import { queryClient } from '~/services/queryClient';
import supabase from '~/services/supabase';
import getDivision from '~/utils/getDivision';

export type UpdatePlayerScoresModalHandle = {
  onOpenModal: (recordModal: IRecordModal) => void;
};

const UpdatePlayerScoresModalBase: ForwardRefRenderFunction<UpdatePlayerScoresModalHandle> = (any, ref) => {
  const modalRef = useRef<ModalHandle>(null);

  const { errorFeedbackToast, successFeedbackToast } = useFeedback();

  const [isLoading, setIsLoading] = useState(false);
  const [players, setPlayers] = useState<IPlayerAPI[]>([]);
  const [step, setStep] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState<IPlayerAPI | undefined>();

  const onOpenModal = useCallback(
    (recordModal: IRecordModal) => {
      setIsLoading(true);
      setStep(0);
      setCurrentPlayer(undefined);
      getPlayers(recordModal.user.id, {
        active: true,
      })
        .then(response => {
          setPlayers(response.filter(player => !!player.steam_id && player.fetch_data));
        })
        .catch(error => {
          errorFeedbackToast('Buscar Jogadores', error);
          modalRef.current?.onCloseModal();
        })
        .finally(() => {
          setIsLoading(false);
        });
      modalRef.current?.onOpenModal();
    },
    [errorFeedbackToast]
  );

  const { mutateAsync } = useMutation({
    mutationFn: async () => {
      for (let i = 0; i < players.length; ) {
        setStep(i);
        setCurrentPlayer(players[i]);
        const skillLevel = await getLeetifyProfileScore(players[i].steam_id);

        if (skillLevel) {
          await supabase
            .from(TABLE_PLAYERS)
            .update({
              premier: skillLevel,
            })
            .eq('id', players[i].id);
        }

        i += 1;
      }
    },
    async onSuccess() {
      successFeedbackToast('Pontuações', 'Pontuações atualizadas com sucesso!');
      await queryClient.invalidateQueries({ queryKey: [TABLE_PLAYERS] });
      modalRef.current?.onCloseModal();
    },
    onError(error: Error) {
      errorFeedbackToast('Pontuações', error);
    },
  });

  function handleCancel() {
    setPlayers([]);
    setStep(0);
    setCurrentPlayer(undefined);

    modalRef.current?.onCloseModal();
  }

  useEffect(() => {
    if (players && players.length > 0) {
      mutateAsync();
    }
  }, [players, mutateAsync]);

  useImperativeHandle(
    ref,
    () => ({
      onOpenModal,
    }),
    [onOpenModal]
  );

  return (
    <Modal ref={modalRef} title="Atualizando Pontuação dos Jogadores" disableCloseButton>
      <ModalBody>
        <Stack>
          <Card>
            <CardHeader title={isLoading ? 'Buscando jogadores...' : `${players.length} jogadores`} size="sm" />
            <CardBody>
              {isLoading && <Spinner alignSelf="center" size="xl" />}
              {currentPlayer && (
                <>
                  <Text>{`${currentPlayer?.name} (${step + 1} de ${players.length})`}</Text>
                  <Progress hasStripe value={getDivision(100 * step, players.length)} />
                </>
              )}
            </CardBody>
          </Card>
        </Stack>
      </ModalBody>
      <ModalFooter flexDir="column" gap="4">
        <CancelOutlineButton w="100%" onClick={() => handleCancel()} />
      </ModalFooter>
    </Modal>
  );
};

export const UpdatePlayerScoresModal = forwardRef(UpdatePlayerScoresModalBase);
