import { cn } from '@/lib/util';
import React from 'react';

interface AccounDetailsCardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, AccounDetailsCardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        className={cn('rounded-xl p-5 ring-1 ring-primary-50', className)}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

interface AccounDetailsCardHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

const CardHeader = React.forwardRef<
  HTMLDivElement,
  AccounDetailsCardHeaderProps
>(({ className, children, ...props }, ref) => {
  return (
    <div
      className={cn(
        'relative mb-4 flex flex-col gap-2 text-base font-medium text-primary-500',
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

interface CardHeaderIconProps extends React.HTMLAttributes<HTMLSpanElement> {}

const CardHeaderIcon = React.forwardRef<HTMLSpanElement, CardHeaderIconProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        className={cn(
          'flex size-7 items-center justify-center rounded-md bg-primary-50 text-primary-300',
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </span>
    );
  },
);

CardHeaderIcon.displayName = 'CardHeaderIcon';

interface CardListProps extends React.HTMLAttributes<HTMLDListElement> {}

const CardList = React.forwardRef<HTMLDListElement, CardListProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <dl
        className={cn(
          'grid grid-cols-2 gap-x-8 gap-y-4 font-medium',
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </dl>
    );
  },
);

CardList.displayName = 'CardList';

interface CardListItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardListItem = React.forwardRef<HTMLDivElement, CardListItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className={cn('space-y-1.5', className)} ref={ref} {...props}>
        {children}
      </div>
    );
  },
);

CardListItem.displayName = 'CardListItem';

interface CardListItemHeadingProps extends React.HTMLAttributes<HTMLElement> {}

const CardListItemHeading = React.forwardRef<
  HTMLElement,
  CardListItemHeadingProps
>(({ className, children, ...props }, ref) => {
  return (
    <dt
      className={cn('text-sm text-primary-400 opacity-90', className)}
      ref={ref}
      {...props}
    >
      {children}
    </dt>
  );
});

CardListItemHeading.displayName = 'CardListItemHeading';

interface CardListItemDescriptionProps
  extends React.HTMLAttributes<HTMLElement> {}

const CardListItemDescription = React.forwardRef<
  HTMLElement,
  CardListItemDescriptionProps
>(({ className, children, ...props }, ref) => {
  return (
    <dd className={cn('text-sm', className)} ref={ref} {...props}>
      {children}
    </dd>
  );
});

CardListItemDescription.displayName = 'CardListItemDescription';

const Skeleton = ({
  iconClass,
  headingClass,
  gridClass,
}: {
  iconClass?: string;
  headingClass?: string;
  gridClass?: string;
}) => {
  return (
    <div className="grid w-full animate-pulse grid-cols-1 gap-6">
      {[...Array(3).keys()].map((i) => {
        return (
          <div
            key={i}
            className="min-h-56 rounded-xl p-5 ring-1 ring-primary-50"
          >
            <div
              className={cn(
                'mb-2 size-10 rounded-lg bg-primary-100',
                iconClass,
              )}
            ></div>
            <div
              className={cn(
                'mb-6 h-7 w-44 rounded-md bg-primary-100',
                headingClass,
              )}
            ></div>
            <div className={cn('grid grid-cols-2 gap-x-8 gap-y-4', gridClass)}>
              {[...Array(4).keys()].map((i) => {
                return (
                  <div key={i}>
                    <div className="mb-1.5 h-5 w-28 rounded-md bg-primary-100"></div>
                    <div className="h-5 w-48 rounded-md bg-primary-100"></div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export {
  Card,
  CardHeader,
  CardHeaderIcon,
  CardList,
  CardListItem,
  CardListItemHeading,
  CardListItemDescription,
  Skeleton,
};
