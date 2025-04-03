import { ErrorModel } from '@api/models/error.model'
import { Podcast } from '@api/models/podcast.model'
import { getPodcasts } from '@api/services/podcasts.service'
import { useQuery } from '@tanstack/react-query'

export const useGetPodcasts = () =>
  useQuery<Podcast[], ErrorModel>({
    queryKey: ['podcasts'],
    queryFn: getPodcasts,
  })
