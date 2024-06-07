/* eslint-disable no-await-in-loop */
/* eslint-disable max-len */
import {
  ChangeEvent,
  forwardRef,
  ForwardRefRenderFunction,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { RiAlertLine } from 'react-icons/ri';

import {
  Icon,
  Text,
  ModalBody,
  ModalFooter,
  Stack,
  Flex,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import imgbbUpload from 'imgbb-image-uploader';
import removeAccents from 'remove-accents';
import { v4 } from 'uuid';

import { CancelOutlineButton } from '~/components/Button/CancelOutlineButton';
import { SaveSolidButton } from '~/components/Button/SaveSolidButton';
import { Input } from '~/components/Form/Input';
import { Modal, ModalHandle } from '~/components/Form/Modal';
import { Table } from '~/components/Form/Table';
import { DeleteSolidIconButton } from '~/components/IconButton/DeleteSolidIconButton';
import { PlayerLeaderboardModal, PlayerLeaderboardModalHandle } from '~/components/Modal/PlayerLeaderboardModal';
import {
  NEXT_PUBLIC_IMGBB_API_KEY, TABLE_PLAYERS, TABLE_RANKING, VIEW_MAP_RANKING, VIEW_SWEEPSTAKE_RANKING,
} from '~/config/constants';
import { useFeedback } from '~/contexts/FeedbackContext';
import ILeaderboardAPI from '~/models/Entity/Leaderboard/ILeaderboardAPI';
import IPlayerLeaderboardAPI from '~/models/Entity/Leaderboard/IPlayerLeaderboardAPI';
import IPlayerAPI from '~/models/Entity/Player/IPlayerAPI';
import IRanking from '~/models/Entity/Ranking/IRanking';
import ISweepstakeMapModal from '~/models/Modal/ISweepstakeMapModal';
import { getPlayers } from '~/services/hooks/usePlayers';
import { queryClient } from '~/services/queryClient';
import supabase from '~/services/supabase';

export type ImportImageLeaderboardModalHandle = {
  onOpenModal: (recordModal: ISweepstakeMapModal) => void;
};

const ImportImageLeaderboardModalBase: ForwardRefRenderFunction<ImportImageLeaderboardModalHandle> = (any, ref) => {
  const modalRef = useRef<ModalHandle>(null);
  const playerLeaderboardModalRef = useRef<PlayerLeaderboardModalHandle>(null);

  const { warningFeedbackToast, errorFeedbackToast, successFeedbackToast } = useFeedback();

  const [isLoading, setIsLoading] = useState(false);
  const [players, setPlayers] = useState<IPlayerAPI[]>([]);
  const [leaderboard, setLeaderboard] = useState<ILeaderboardAPI | undefined>();
  const [playerLeaderboards, setPlayerLeaderboards] = useState<IPlayerLeaderboardAPI[]>([]);
  const [recordModalProps, setRecordModalProps] = useState<ISweepstakeMapModal | undefined>();

  function handleDeletePlayerLeaderboard(id: string) {
    setPlayerLeaderboards((prevPlayerLeaderboards) => prevPlayerLeaderboards.filter((playerLeaderboard) => playerLeaderboard.id !== id));
  }

  function handleChangePlayerLeaderboard(updatedPlayerLeaderboard: IPlayerLeaderboardAPI) {
    setPlayerLeaderboards((prevPlayerLeaderboards) => {
      const index = prevPlayerLeaderboards.findIndex(
        (playerLeaderboard) => playerLeaderboard.id === updatedPlayerLeaderboard.id,
      );

      if (index === -1) {
        return prevPlayerLeaderboards;
      }

      const newPlayerLeaderboards = [...prevPlayerLeaderboards];
      newPlayerLeaderboards[index] = updatedPlayerLeaderboard;

      return newPlayerLeaderboards;
    });
  }

  const { mutateAsync: analyzeImageMutateAsync, isPending: isLoadingAnalyzeImage } = useMutation(
    {
      mutationFn: async (file: File) => {
        setLeaderboard(undefined);
        setPlayerLeaderboards([]);

        const data = await imgbbUpload({
          key: NEXT_PUBLIC_IMGBB_API_KEY,
          image: file,
          expiration: 600,
          name: v4(),
        });

        const response = await axios.post<ILeaderboardAPI>('/api/read-scores', {
          image_url: data.data.url,
        });

        return response.data;
      },
      async onSuccess(data) {
        setLeaderboard(data);
        if (data?.players?.length > 0) {
          setPlayerLeaderboards(data.players.map((playerLeaderboard) => ({
            ...playerLeaderboard,
            player: players.find((player) => removeAccents(player.username.trim().toLowerCase()) === removeAccents(playerLeaderboard.name.trim().toLowerCase())),
            id: v4(),
          })));
        }
      },
      onError(error: Error) {
        errorFeedbackToast('Analisar Imagem', error);
      },
    },
  );

  const { mutateAsync: createOrUpdateRankingAsync, isPending: isLoadingRanking } = useMutation(
    {
      mutationFn: async () => {
        if (!recordModalProps?.user || !recordModalProps?.sweepstakeMap || !recordModalProps?.sweepstakeMap.maps) {
          return;
        }

        for (let i = 0; i < playerLeaderboards.length;) {
          if (!playerLeaderboards[i].player) {
            throw new Error(`Jogador não informado para o nick "${playerLeaderboards[i].name}"`);
          }

          const ranking = {
            user_id: recordModalProps.user.id,
            sweepstake_id: recordModalProps.sweepstakeMap.sweepstake_id,
            map_id: recordModalProps.sweepstakeMap.map_id,
            player_id: playerLeaderboards[i].player?.id ?? '',
            kills: playerLeaderboards[i].kills,
            deaths: playerLeaderboards[i].deaths,
            assistances: playerLeaderboards[i].assistances,
            headshot_percentage: playerLeaderboards[i].headshot_percentage,
            damage: playerLeaderboards[i].damage,
          } as IRanking;

          const { data } = await supabase
            .from(TABLE_RANKING)
            .select()
            .eq('user_id', ranking.user_id)
            .eq('sweepstake_id', ranking.sweepstake_id)
            .eq('map_id', ranking.map_id)
            .eq('player_id', ranking.player_id)
            .limit(1)
            .maybeSingle();

          if (data) {
            await supabase.from(TABLE_RANKING).update(ranking).eq('id', data.id);
          } else {
            await supabase.from(TABLE_RANKING).insert(ranking);
          }

          i += 1;
        }
      },
      async onSuccess() {
        successFeedbackToast('Ranking', 'Ranking atualizado com sucesso!');
        await queryClient.invalidateQueries({ queryKey: [TABLE_RANKING] });
        await queryClient.invalidateQueries({ queryKey: [VIEW_MAP_RANKING] });
        await queryClient.invalidateQueries({ queryKey: [VIEW_SWEEPSTAKE_RANKING] });
        modalRef.current?.onCloseModal();
      },
      onError(error: Error) {
        errorFeedbackToast('Ranking', error);
      },
    },
  );

  const playerLeaderboardColumns: ColumnDef<IPlayerLeaderboardAPI>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
      enableSorting: false,
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({ row }) => (
        <Flex gap="2" align="center">
          <Text>{row.original.name}</Text>
          {!row.original.player && <Icon as={RiAlertLine} title="Informe o jogador correspondente a este Nick" color="yellow.500" fontSize="xl" />}
        </Flex>
      ),
    },
    {
      accessorKey: 'kills',
      header: 'Vítimas',
      enableSorting: false,
    },
    {
      accessorKey: 'deaths',
      header: 'Mortes',
      enableSorting: false,
    },
    {
      accessorKey: 'assistances',
      header: 'Assist.',
      enableSorting: false,
    },
    {
      accessorKey: 'headshot_percentage',
      header: '%TC',
      enableSorting: false,
    },
    {
      accessorKey: 'damage',
      header: 'Dano',
      enableSorting: false,
    },
    {
      accessorKey: 'actions',
      header: '',
      enableSorting: false,
      // eslint-disable-next-line react/no-unstable-nested-components
      cell: ({ row }) => (
        <DeleteSolidIconButton size="xs" onClick={() => handleDeletePlayerLeaderboard(row.original.id)} isDisabled={isLoading || isLoadingAnalyzeImage || isLoadingRanking} />
      ),
    },
  ];

  const onOpenModal = useCallback(
    (recordModal: ISweepstakeMapModal) => {
      setIsLoading(true);
      setPlayers([]);
      setPlayerLeaderboards([]);
      setLeaderboard(undefined);
      setRecordModalProps(recordModal);
      getPlayers(recordModal.user.id, {
        active: true,
        sweepstakeId: recordModal.sweepstakeMap.sweepstake_id,
      })
        .then((response) => {
          setPlayers(response);
        })
        .catch((error) => {
          errorFeedbackToast('Buscar Jogadores', error);
          modalRef.current?.onCloseModal();
        })
        .finally(() => {
          setIsLoading(false);
        });
      modalRef.current?.onOpenModal();
    },
    [errorFeedbackToast],
  );

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target?.files) {
      return;
    }

    const fileUploaded = event.target?.files[0];
    if (fileUploaded) {
      await analyzeImageMutateAsync(fileUploaded);
    }
  };

  function handlePlayerLeaderboardModal(playerLeaderboard: IPlayerLeaderboardAPI) {
    if (!recordModalProps?.user) {
      return;
    }

    playerLeaderboardModalRef.current?.onOpenModal({
      players,
      playerLeaderboard,
      user: recordModalProps?.user,
      onSubmit: async (data) => {
        handleChangePlayerLeaderboard(data);
        if (data.player) {
          await supabase.from(TABLE_PLAYERS).update({ username: data.name }).eq('id', data.player.id);
          await queryClient.invalidateQueries({ queryKey: [TABLE_PLAYERS] });
        }
      },
    });
  }

  async function handleOk() {
    const uninformedPlayers = playerLeaderboards.filter((playerLeaderboard) => !playerLeaderboard.player);
    if (uninformedPlayers.length > 0) {
      warningFeedbackToast('Ranking', `Há ${uninformedPlayers.length} registro(s) sem jogador informado!`);
      return;
    }

    await createOrUpdateRankingAsync();
  }

  useImperativeHandle(
    ref,
    () => ({
      onOpenModal,
    }),
    [onOpenModal],
  );

  return (
    <>
      <PlayerLeaderboardModal ref={playerLeaderboardModalRef} />
      <Modal
        ref={modalRef}
        title={`Importar Ranking: ${recordModalProps?.sweepstakeMap?.maps?.name}`}
        size={leaderboard ? '4xl' : '2xl'}
      >
        <ModalBody>
          <Stack spacing="4">
            <Input
              pt="2"
              h="50px"
              type="file"
              name="file"
              accept="image/*"
              capture="environment"
              onChange={(event) => handleFileChange(event)}
              isDisabled={isLoading || isLoadingAnalyzeImage || isLoadingRanking}
            />
            {(leaderboard || isLoadingAnalyzeImage) && (
            <Table
              data={playerLeaderboards}
              columns={playerLeaderboardColumns}
              isLoading={isLoadingAnalyzeImage}
              onRowClick={(playerLeaderboard) => handlePlayerLeaderboardModal(playerLeaderboard)}
            />
            )}
          </Stack>
        </ModalBody>
        <ModalFooter flexDir="column" gap="4">
          <SaveSolidButton w="100%" onClick={() => handleOk()} isLoading={isLoadingRanking} isDisabled={playerLeaderboards.length === 0} />
          <CancelOutlineButton w="100%" onClick={() => modalRef.current?.onCloseModal()} isDisabled={isLoadingRanking} />
        </ModalFooter>
      </Modal>
    </>
  );
};

export const ImportImageLeaderboardModal = forwardRef(ImportImageLeaderboardModalBase);
