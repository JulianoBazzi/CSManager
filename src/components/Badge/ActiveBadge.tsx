import type { BadgeProps } from '@chakra-ui/react';

import { Badge } from '~/components/Badge';

interface IActiveBadgeProps extends BadgeProps {
  active: boolean;
}

export function ActiveBadge({ active, ...rest }: IActiveBadgeProps) {
  return (
    <Badge colorScheme={active ? 'green' : 'red'} {...rest}>
      {active ? 'Ativo' : 'Inativo'}
    </Badge>
  );
}
