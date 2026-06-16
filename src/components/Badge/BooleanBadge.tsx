import type { BadgeProps } from '@chakra-ui/react';

import { Badge } from '~/components/Badge';

interface IBooleanBadgeProps extends BadgeProps {
  active: boolean;
}

export function BooleanBadge({ active, ...rest }: IBooleanBadgeProps) {
  return (
    <Badge colorPalette={active ? 'green' : 'red'} {...rest}>
      {active ? 'Sim' : 'Não'}
    </Badge>
  );
}
