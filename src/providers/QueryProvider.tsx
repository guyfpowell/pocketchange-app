import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useRef } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Stable client — recreated if the component ever unmounts and remounts
  const clientRef = useRef<QueryClient>(
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: 1,
          staleTime: 30_000,
        },
      },
    })
  );

  return (
    <QueryClientProvider client={clientRef.current}>
      {children}
    </QueryClientProvider>
  );
}
