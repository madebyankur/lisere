import Link from 'next/link';
import { cn } from '@/lib/utils';

function HeaderLink({
  id,
  children,
  href,
  className,
}: {
  id: string;
  children: React.ReactNode;
  href: string;
  className?: string;
}) {
  return (
    <Link
      id={id}
      href={href}
      className={cn(
        'ring-ring group block rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        className,
      )}
    >
      <h2
        id={href.replace('#', '')}
        className="text-primary relative flex items-center gap-2 text-2xl font-semibold"
      >
        <span className="text-accent absolute -left-6 w-6 text-lg opacity-0 transition-opacity duration-150 ease-out group-hover:opacity-100 group-focus-visible:opacity-100">
          #
        </span>{' '}
        {children}
      </h2>
    </Link>
  );
}

export { HeaderLink };
