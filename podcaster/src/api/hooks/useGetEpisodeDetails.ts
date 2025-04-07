import { useQuery } from '@tanstack/react-query'
import { getEpisodeDetails } from '@api/services/EpisodeDetails.service'
import { Episode } from '@api/models/episodeDetail.model'
import { Podcast } from '@api/models/podcastDetail.model'
import { ErrorModel } from '@api/models/error.model'

export const useGetEpisodeDetails = (podcastId: string, episodeId: string) =>
  useQuery<{ podcast: Podcast; episodio: Episode | null }, ErrorModel>({
    queryKey: ['episodeDetails', podcastId, episodeId],
    queryFn: () => getEpisodeDetails(podcastId, episodeId),
  })
