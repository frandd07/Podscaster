import { useParams, Link } from 'react-router-dom'
import {
  Container,
  ContainerEpisode,
  Image,
  Line,
  MargenTable,
  Sidebar,
  Table,
  Td,
  Th,
  Tr,
} from './PodcastDetails.style'
import Header from '@components/Header'
import { formatDate } from './PodcastDetails.utils'
import { useTranslation } from 'react-i18next'
import { useGetPodcastDetails } from '@api/hooks/useGetPodcastDetails'

export function PodcastDetails() {
  const { podcastId } = useParams()
  const { t } = useTranslation()

  const { data, isLoading, isError } = useGetPodcastDetails(podcastId)

  if (isLoading) return <Header cargando />
  if (isError || !data?.podcast) return <p>{t('podcastDetails.negative')}</p>

  const { podcast, episodios } = data

  return (
    <Container>
      <Header cargando={false} />
      <Sidebar>
        <Image
          src={podcast.artworkUrl600}
          alt={podcast.collectionName}
        />
        <Line />
        <h2>{podcast.collectionName}</h2>
        <p>
          {t('podcastDetails.by')}: {podcast.artistName}
        </p>
        <Line />
        <p>
          <strong>{t('podcastDetails.description')}:</strong>
          <div dangerouslySetInnerHTML={{ __html: podcast.description || '' }} />
        </p>
      </Sidebar>

      <div>
        <ContainerEpisode>
          <h2>
            {t('podcastDetails.episodes')}: {episodios.length}
          </h2>
        </ContainerEpisode>
        <MargenTable>
          <Table>
            <thead>
              <Tr>
                <Th>{t('podcastDetails.title')}</Th>
                <Th>{t('podcastDetails.date')}</Th>
                <Th>{t('podcastDetails.duracion')}</Th>
              </Tr>
            </thead>
            <tbody>
              {episodios.map((ep, index) => (
                <Tr key={index}>
                  <Td>
                    <Link to={`/podcast/${podcastId}/episode/${ep.episodeId}`}>{ep.title}</Link>
                  </Td>
                  <Td>{formatDate(ep.pubDate)}</Td>
                  <Td>{ep.duration}</Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </MargenTable>
      </div>
    </Container>
  )
}
