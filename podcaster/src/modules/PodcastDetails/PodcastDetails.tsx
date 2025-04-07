import axios from 'axios'
import { useEffect, useState } from 'react'
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
import { formatDate, formatDuration } from './PodcastDetails.utils'
import { useTranslation } from 'react-i18next'

interface Episode {
  title: string
  pubDate: string
  description: string
  audioUrl: string
  duration: string
  episodeId: string
}

interface Podcast {
  collectionId: number
  collectionName: string
  artistName: string
  artworkUrl600: string
  feedUrl: string
  description?: string
}

export function PodcastDetails() {
  const { podcastId } = useParams()
  const { t } = useTranslation()

  const [podcast, setPodcast] = useState<Podcast | null>(null)
  const [episodios, setEpisodios] = useState<Episode[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPodcastAndEpisodes = async () => {
      const storedPodcast = localStorage.getItem(`podcast-${podcastId}`)
      const storedTime = localStorage.getItem(`podcast-${podcastId}-lastFetch`)
      const today = Date.now()
      const day = 24 * 60 * 60 * 1000

      if (storedPodcast && storedTime && today - parseInt(storedTime) < day) {
        const parsed = JSON.parse(storedPodcast)
        setPodcast(parsed.podcast)
        setEpisodios(parsed.episodios)
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        const lookupRes = await axios.get(`https://itunes.apple.com/lookup?id=${podcastId}`)
        const info = lookupRes.data.results[0]

        const podcastData: Podcast = {
          collectionId: info.collectionId,
          collectionName: info.collectionName,
          artistName: info.artistName,
          artworkUrl600: info.artworkUrl600,
          feedUrl: info.feedUrl,
          description: '',
        }

        const rssResponse = await axios.get(
          `https://cors-anywhere.herokuapp.com/${podcastData.feedUrl}`,
        )
        const xmlString = rssResponse.data
        const parser = new DOMParser()
        const xml = parser.parseFromString(xmlString, 'application/xml')

        const items = xml.getElementsByTagName('item')
        const episodesData: Episode[] = Array.from(items).map((item) => {
          const rawDuration = item.getElementsByTagName('itunes:duration')[0]?.textContent || ''
          return {
            title: item.getElementsByTagName('title')[0]?.textContent || '(Sin título)',
            pubDate: item.getElementsByTagName('pubDate')[0]?.textContent || '',
            description: item.getElementsByTagName('description')[0]?.textContent || '',
            audioUrl: item.getElementsByTagName('enclosure')[0]?.getAttribute('url') || '',
            duration: formatDuration(rawDuration),
            episodeId: item.getElementsByTagName('guid')[0]?.textContent || '',
          }
        })

        const channel = xml.querySelector('channel')
        const feedDescription = channel?.querySelector('description')?.textContent || ''
        podcastData.description = feedDescription

        setPodcast(podcastData)
        setEpisodios(episodesData)

        localStorage.setItem(
          `podcast-${podcastId}`,
          JSON.stringify({ podcast: podcastData, episodios: episodesData }),
        )
        localStorage.setItem(`podcast-${podcastId}-lastFetch`, Date.now().toString())
      } catch (error) {
        console.error('Error cargando detalles del podcast:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPodcastAndEpisodes()
  }, [podcastId])

  if (loading) return <Header cargando={loading} />
  if (!podcast) return <p className="p-4">No se encontró el podcast.</p>

  return (
    <Container>
      <Header cargando={loading} />
      <Sidebar>
        <Image
          src={podcast.artworkUrl600}
          alt={podcast.collectionName}
        />
        <Line />
        <h2>{podcast.collectionName}</h2>
        <p>
          {' '}
          {t('podcastDetails.by')}: {podcast.artistName}
        </p>
        <Line />
        <p>
          <strong> {t('podcastDetails.description')}:</strong>
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
                <Th> {t('podcastDetails.title')}</Th>
                <Th> {t('podcastDetails.date')}</Th>
                <Th> {t('podcastDetails.duracion')}</Th>
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
