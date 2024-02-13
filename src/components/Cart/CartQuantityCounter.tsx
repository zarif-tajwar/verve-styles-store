import { cn } from '@/lib/util';
import React from 'react';
import { Button } from '../UI/Button';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { Slot } from '@radix-ui/react-slot';

type CartQuantityCounterProps = {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  minValue?: number;
  maxValue?: number;
  asChild?: boolean;
};

type CartQuantityContextProps = {
  value?: number;
  setValue?: (value: number) => void;
} & Pick<CartQuantityCounterProps, 'minValue' | 'maxValue'>;

const CartQuantityCounterContext =
  React.createContext<CartQuantityContextProps | null>(null);

const useCartQuantityCounter = () => {
  const context = React.useContext(CartQuantityCounterContext);
  if (!context)
    throw new Error(
      'useCartQuantityCounter was used outside of CartQuantityCounterContext!',
    );

  return context;
};

const CartQuantityCounter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & CartQuantityCounterProps
>(
  (
    {
      className,
      asChild,
      value: valueProp,
      defaultValue = 1,
      children,
      onValueChange,
      minValue = 1,
      maxValue = 10,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'div';

    const [value, setValue] = useControllableState({
      prop: valueProp,
      defaultProp: defaultValue,
      onChange: onValueChange,
    });

    return (
      <CartQuantityCounterContext.Provider
        value={{ value, setValue, minValue, maxValue }}
      >
        <Comp
          ref={ref}
          className={cn(
            'grid grid-cols-[repeat(3,auto)] grid-rows-1 rounded-full bg-primary-50 p-1.5 md:grid-cols-[auto_minmax(auto,3rem)_auto]',
            className,
          )}
          {...props}
        >
          {children}
        </Comp>
      </CartQuantityCounterContext.Provider>
    );
  },
);

CartQuantityCounter.displayName = 'CartQuantityCounter';

const CartQuantityChangeBtn = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<typeof Button> & {
    controlType: 'increase' | 'decrease';
  }
>(({ className, type, controlType, ...props }, ref) => {
  const { value, setValue, maxValue, minValue } = useCartQuantityCounter();

  const handleClick = React.useCallback(() => {
    if (!value || !setValue) return;
    if (controlType === 'increase') setValue(value + 1);
    if (controlType === 'decrease') setValue(value - 1);
  }, [value, setValue, controlType]);

  return (
    <Button
      ref={ref}
      className={cn(
        'px-4 [--icon-size:1rem] sm:[--icon-size:1.25rem]',
        className,
      )}
      // size={'sm'}
      variant={'secondary'}
      onClick={handleClick}
      type="button"
      disabled={
        controlType === 'increase' ? value === maxValue : value === minValue
      }
      {...props}
    >
      {controlType === 'increase' && (
        <PlusIcon className="size-[var(--icon-size)]" />
      )}
      {controlType === 'decrease' && (
        <MinusIcon className="size-[var(--icon-size)]" />
      )}
      <span className="sr-only">{`${controlType === 'increase' ? 'Increase' : 'Decrease'} quantity by 1`}</span>
    </Button>
  );
});

CartQuantityChangeBtn.displayName = 'CartQuantityChangeBtn';

const CartQuantityInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, children, type, readOnly, ...props }, ref) => {
  const { value, setValue } = useCartQuantityCounter();

  return (
    <input
      ref={ref}
      value={value}
      className={cn(
        'min-w-0 border-none bg-transparent text-center outline-none',
        className,
      )}
      type="number"
      min={1}
      max={10}
      onChange={(e) => {
        setValue?.(Number.parseInt(e.target.value));
      }}
      readOnly={readOnly === undefined ? true : readOnly}
      {...props}
    >
      {children}
    </input>
  );
});
CartQuantityInput.displayName = 'CartQuantityInput';

export { CartQuantityCounter, CartQuantityInput, CartQuantityChangeBtn };
