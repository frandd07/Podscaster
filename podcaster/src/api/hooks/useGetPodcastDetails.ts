import { useQuery } from '@tanstack/react-query'
import { getPodcastDetails } from '@api/services/podcastDetails.service'
import { Podcast, Episode } from '@api/models/podcastDetail.model'
import { ErrorModel } from '@api/models/error.model'

export const useGetPodcastDetails = (podcastId?: string) =>
  useQuery<{ podcast: Podcast; episodios: Episode[] }, ErrorModel>({
    queryKey: ['podcastDetails', podcastId],
    queryFn: () => {
      if (!podcastId) {
        throw new Error('Falta el podcastId')
      }
      return getPodcastDetails(podcastId)
    },
    enabled: !!podcastId,
    staleTime: 24 * 60 * 60 * 1000,
  })
