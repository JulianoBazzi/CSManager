import { ImageProps, Image } from '@chakra-ui/react';

interface IPatentBadgeProps extends ImageProps {
  patent: string;
  format_patent: string;
}

export function PatentBadge({ patent, format_patent, ...rest }: IPatentBadgeProps) {
  return (
    <Image
      src={`/assets/patents/${patent}.webp`}
      alt={patent}
      objectFit="scale-down"
      maxH="20px"
      title={format_patent}
      {...rest}
    />
  );
}
