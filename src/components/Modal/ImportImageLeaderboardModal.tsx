import {
  ChangeEvent,
  forwardRef, ForwardRefRenderFunction, useCallback, useImperativeHandle, useRef, useState,
} from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { GiUnlitBomb } from 'react-icons/gi';
import { MdEmojiPeople } from 'react-icons/md';

import {
  ModalBody, ModalFooter, Stack,
  TableContainer,
} from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import imgbbUpload from 'imgbb-image-uploader';
import { v4 } from 'uuid';
import * as yup from 'yup';
import { InferType } from 'yup';

import { CancelOutlineButton } from '~/components/Button/CancelOutlineButton';
import { SaveSolidButton } from '~/components/Button/SaveSolidButton';
import Card from '~/components/Card';
import CardBody from '~/components/Card/CardBody';
import CardHeader from '~/components/Card/CardHeader';
import { Input } from '~/components/Form/Input';
import { Modal, ModalHandle } from '~/components/Form/Modal';
import { Table } from '~/components/Form/Table';
import { NEXT_PUBLIC_IMGBB_API_KEY } from '~/config/constants';
import { useFeedback } from '~/contexts/FeedbackContext';
import ISweepstakeMapModal from '~/models/Modal/ISweepstakeMapModal';
import { ILeaderboardAPI, IPlayerLeaderboardAPI } from '~/pages/api/read-scores';

export type ImportImageLeaderboardModalHandle = {
  onOpenModal: (recordModal: ISweepstakeMapModal) => void;
};

const ImportImageLeaderboardModalBase: ForwardRefRenderFunction<ImportImageLeaderboardModalHandle> = (any, ref) => {
  const modalRef = useRef<ModalHandle>(null);

  const { errorFeedbackToast } = useFeedback();

  const [playerLeaderboards, setPlayerLeaderboards] = useState<IPlayerLeaderboardAPI[]>([]);
  const [recordModalProps, setRecordModalProps] = useState<ISweepstakeMapModal | undefined>();

  const sweepstakeMapSchema = yup.object().shape({
    team_one_score_1: yup.number().min(0).max(99).required(),
    team_two_score_1: yup.number().min(0).max(99).required(),
    team_one_score_2: yup.number().min(0).max(99).required(),
    team_two_score_2: yup.number().min(0).max(99).required(),
  });

  const playerLeaderboardColumns: ColumnDef<IPlayerLeaderboardAPI>[] = [
    {
      accessorKey: 'name',
      header: 'Nome',
      enableSorting: false,
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
  ];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(sweepstakeMapSchema),
  });

  const onOpenModal = useCallback(
    (recordModal: ISweepstakeMapModal) => {
      setPlayerLeaderboards([]);
      setRecordModalProps(recordModal);
      reset({});
      modalRef.current?.onOpenModal();
    },
    [reset],
  );

  const { mutateAsync: analyzeImageMutateAsync, isPending: isLoadingAnalyzeImage } = useMutation(
    {
      mutationFn: async (file: File) => {
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
        setPlayerLeaderboards(data ? data.players : []);
      },
      onError(error: Error) {
        errorFeedbackToast('Analisar Imagem', error);
      },
    },
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

  const handleOk: SubmitHandler<InferType<typeof sweepstakeMapSchema>> = async (data) => {
    console.log('data', data);
  };

  useImperativeHandle(
    ref,
    () => ({
      onOpenModal,
    }),
    [onOpenModal],
  );

  return (
    <Modal
      ref={modalRef}
      title="Importar Imagem com Placares"
      size="2xl"
      onSubmit={handleSubmit(handleOk)}
    >
      <ModalBody>
        <Stack>
          <Card>
            <CardHeader
              icon={recordModalProps?.sweepstakeMap?.maps?.map_type === 'bomb' ? GiUnlitBomb : MdEmojiPeople}
              title={recordModalProps?.sweepstakeMap?.maps?.name || ''}
              size="sm"
            />
            <CardBody>
              <Input
                type="file"
                name="file"
                accept="image/*"
                capture="environment"
                onChange={(event) => handleFileChange(event)}
              />
              <TableContainer>
                <Table
                  data={playerLeaderboards}
                  columns={playerLeaderboardColumns}
                  isLoading={isLoadingAnalyzeImage}
                />
              </TableContainer>
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

export const ImportImageLeaderboardModal = forwardRef(ImportImageLeaderboardModalBase);
