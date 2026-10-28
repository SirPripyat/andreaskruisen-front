import { MutationCache, QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from './error';

declare module '@tanstack/react-query' {
  interface Register {
    mutationMeta: {
      errorMessage?: string;
    };
  }
}

export const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      const errorMessage = mutation.meta?.errorMessage;
      if (errorMessage) {
        toast.error(getErrorMessage(error, errorMessage));
      }
    },
  }),
});
