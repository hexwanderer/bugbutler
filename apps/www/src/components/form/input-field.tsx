import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { useId } from 'react';
import { useFieldContext } from '../../integrations/form';

export function InputField({
  label,
  ...props
}: React.ComponentProps<typeof Input> & { label: string }) {
  const field = useFieldContext<string | number>();
  const id = useId();

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        onChange={(e) => field.handleChange(e.target.value)}
        value={field.state.value}
        {...props}
      />
      {getFieldError(field)}
    </div>
  );
}

function getFieldError(
  field: ReturnType<typeof useFieldContext<string | number>>
) {
  const { errors, isDirty } = field.state.meta;

  if (!isDirty) return;
  return (
    <em className="text-destructive text-sm">
      {errors.map((err: Error) => err.message).join(', ')}
    </em>
  );
}
