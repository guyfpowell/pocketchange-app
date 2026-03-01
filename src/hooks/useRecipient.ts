import { useQuery } from '@tanstack/react-query';
import { recipientService } from '@/services/recipient.service';
import type { RecipientPublicProfile } from '@/types';

export function useRecipientProfile(id: string) {
  return useQuery<RecipientPublicProfile>({
    queryKey: ['recipient', id],
    queryFn: () => recipientService.getPublicProfile(id),
    enabled: !!id,
    staleTime: 60_000,
  });
}
