// title-context.tsx
import type React from 'react';
import { createContext, useContext, useState } from 'react';

type TitleContextType = {
  title: string;
  setTitle: (title: string) => void;
};

const TitleContext = createContext<TitleContextType | undefined>(undefined);

export function TitleProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState('');
  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
}

export function useTitle() {
  const ctx = useContext(TitleContext);
  if (!ctx) {
    throw new Error('useTitle must be used within a TitleProvider');
  }
  return ctx;
}
