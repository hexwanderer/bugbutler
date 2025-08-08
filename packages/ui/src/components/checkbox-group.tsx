'use client';

import { CheckboxGroup as BaseCheckboxGroup } from '@base-ui-components/react/checkbox-group';
import { cn } from '@workspace/ui/lib/utils';
import type * as React from 'react';

function CheckboxGroup({
  className,
  ...props
}: React.ComponentProps<typeof BaseCheckboxGroup>) {
  return (
    <BaseCheckboxGroup
      className={cn('flex flex-col items-start gap-1', className)}
      {...props}
    />
  );
}

export { CheckboxGroup };
