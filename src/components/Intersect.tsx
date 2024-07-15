import React, { useEffect, useRef } from 'react';

export type IntersectProps = React.PropsWithChildren<{
  onIntersect: () => void;
}>;

export const Intersect: React.FC<IntersectProps> = ({
  onIntersect,
  children,
}) => {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) {
        onIntersect();
      }
    });

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    const ref = loaderRef.current;

    return () => {
      if (ref) observer.unobserve(ref);
    };
  }, [onIntersect]);

  return <div ref={loaderRef}>{children}</div>;
};
