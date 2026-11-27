import { useEffect, useRef } from 'react';

type InfiniteScrollSentinelProps = {
  onIntersect: () => void;
  disabled?: boolean;
};

export const InfiniteScrollSentinel = ({
  onIntersect,
  disabled = false,
}: InfiniteScrollSentinelProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || disabled) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) onIntersect();
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, [onIntersect, disabled]);

  return <div ref={ref} className={'h-1'} />;
};
