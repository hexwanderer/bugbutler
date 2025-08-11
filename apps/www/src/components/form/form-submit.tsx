import { AnimatedButton } from '@workspace/ui/components/animated-button';
import type { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';
import { useFormContext } from '../../integrations/form';

export function FormSubmit({
  formId,
  className,
  disabled,
  fillColor, // allow passing fillColor through
  children,
  ...props
}: React.ComponentProps<typeof Button> & {
  formId?: string;
  fillColor?: string;
  children: React.ReactNode;
}) {
  const form = useFormContext();

  // Map normal variants to animated variants
  const mapToAnimatedVariant = (
    variant?: string
  ): 'default' | 'outline' | 'ghost' => {
    switch (variant) {
      case 'outline':
        return 'outline';
      case 'ghost':
        return 'ghost';
      default:
        return 'default';
    }
  };

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
          <AnimatedButton
            fillColor={fillColor || 'bg-accent'}
            {...props}
            className={cn('w-full', className)}
            disabled={isSubmitting || !isValid || disabled}
            form={formId}
            size={props.size as 'sm' | 'md' | 'lg'}
            type="submit"
            variant={mapToAnimatedVariant(props.variant as string)}
          >
            {children}
          </AnimatedButton>

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
                return null;
              })}
            </div>
          )}
        </>
      )}
    </form.Subscribe>
  );
}
