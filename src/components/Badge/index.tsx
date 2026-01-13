import { type BadgeProps, Badge as ChakraBadge } from '@chakra-ui/react';

export function Badge({ ...rest }: BadgeProps) {
  return (
    <ChakraBadge textTransform="none" borderRadius={8} py="0.5" px="3" variant="solid" fontSize="small" {...rest} />
  );
}
