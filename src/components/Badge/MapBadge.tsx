import { type ImageProps, Image } from '@chakra-ui/react';

interface IPatentBadgeProps extends ImageProps {
  type: string;
  format_type: string;
}

export function MapBadge({ type, format_type, ...rest }: IPatentBadgeProps) {
  return (
    <Image
      src={`/assets/maps/${type}.webp`}
      alt={type}
      objectFit="scale-down"
      maxH="20px"
      title={format_type}
      {...rest}
    />
  );
}
