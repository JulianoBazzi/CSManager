import type { BadgeProps } from '@chakra-ui/react';
import { formatBoolean } from '@julianobazzi/utils';

import { Badge } from '~/components/Badge';

interface IBooleanBadgeProps extends BadgeProps {
  active: boolean;
}

export function BooleanBadge({ active, ...rest }: IBooleanBadgeProps) {
  return (
    <Badge colorPalette={active ? 'green' : 'red'} {...rest}>
      {formatBoolean(active)}
    </Badge>
  );
}
