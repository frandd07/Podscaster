import { useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from '@components/Header'
import {
  Container,
  ContainerEpisode,
  Image,
  Line,
  Sidebar,
} from '@modules/PodcastDetails/PodcastDetails.style'
import { Audio } from './EpisodeDetails.style'
import { useGetEpisodeDetails } from '@api/hooks/useGetEpisodeDetails'

export function EpisodeDetails() {
  const { podcastId, episodeId } = useParams()
  const { t } = useTranslation()

  if (!podcastId || !episodeId) return <p>{t('podcastDetails.negative')}</p>
  const { data, isLoading, isError } = useGetEpisodeDetails(podcastId, episodeId)

  if (isLoading) return <Header cargando />
  if (isError || !data?.podcast || !data?.episodio) return <p>{t('podcastDetails.negative')}</p>

  const { podcast, episodio } = data

  return (
    <Container>
      <Header cargando={false} />

      <Sidebar>
        <Link to={`/podcast/${podcastId}`}>
          <Image
            src={podcast.artworkUrl600}
            alt={podcast.collectionName}
          />
        </Link>

        <Line />

        <h2>
          <Link to={`/podcast/${podcastId}`}>{podcast.collectionName}</Link>
        </h2>

        <p>
          {t('podcastDetails.by')}
          <Link to={`/podcast/${podcastId}`}> {podcast.artistName}</Link>
        </p>

        <Line />

        <p>
          <strong>{t('podcastDetails.description')}:</strong>
          <div dangerouslySetInnerHTML={{ __html: podcast.description || '' }} />
        </p>
      </Sidebar>

      <ContainerEpisode>
        <h2>{episodio.trackName}</h2>
        <em>
          <div dangerouslySetInnerHTML={{ __html: episodio.description }} />
        </em>
        <Audio
          controls
          src={episodio.audioUrl}
          data-testid="audio-element"
        />
      </ContainerEpisode>
    </Container>
  )
}
