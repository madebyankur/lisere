import { cn } from '@/lib/utils';

const Separator = ({ className }: { className?: string }) => {
  return (
    <hr className={cn('border-muted mx-40 my-12 border-dashed', className)} />
  );
};

export { Separator };
