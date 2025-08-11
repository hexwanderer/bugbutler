// title.tsx
import { useEffect } from 'react';
import { useTitle } from './title-context';

export function Title({ children }: { children: string }) {
  const { setTitle } = useTitle();

  useEffect(() => {
    setTitle(children);

    return () => {
      setTitle('');
    };
  }, [children, setTitle]);

  return null; // This component doesn't render anything itself
}
