import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import { useFormContext } from '../../integrations/form';

export function FormSubmit({
  label,
  formId,
  className,
  disabled,
  ...props
}: React.ComponentProps<typeof Button> & {
  label: string;
  formId?: string;
}) {
  const form = useFormContext();

  return (
    <form.Subscribe
      selector={(state) => ({
        isSubmitting: state.isSubmitting,
        isValid: state.isValid,
        errorMap: state.errorMap,
      })}
    >
      {({ isSubmitting, isValid, errorMap }) => (
        <>
          <Button
            {...props}
            className={cn('w-full', className)}
            disabled={isSubmitting || !isValid || disabled}
            form={formId}
            type="submit"
          >
            {label}
          </Button>
          {errorMap && Object.keys(errorMap).length > 0 && (
            <div className="flex flex-col gap-2">
              {Object.values(errorMap).map((err, index) => {
                if (
                  typeof err === 'object' &&
                  err !== null &&
                  'path' in err &&
                  'message' in err
                ) {
                  return (
                    <p
                      className="text-destructive text-sm"
                      key={(err as { path: string }).path || index}
                    >
                      {(err as { message: string }).message}
                    </p>
                  );
                }
                return null; // Skip invalid error entries
              })}
            </div>
          )}
        </>
      )}
    </form.Subscribe>
  );
}
