import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from './error';

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      errorMessage?: string;
    };
    queryMeta: {
      errorMessage?: string;
    };
  }
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      const errorMessage = query.meta?.errorMessage;

      if (errorMessage) toast.error(getErrorMessage(error, errorMessage));
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      const errorMessage = mutation.meta?.errorMessage;

      if (errorMessage) toast.error(getErrorMessage(error, errorMessage));
    },
  }),
});

export const queryPersister = createAsyncStoragePersister({
  storage: window.sessionStorage,
});
