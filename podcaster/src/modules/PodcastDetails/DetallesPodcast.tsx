import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  Container,
  ContainerEpisodio,
  Imagen,
  Linea,
  MargenTabla,
  Sidebar,
  Tabla,
  Td,
  Th,
  Tr,
} from './DetallesPodcast.style'
import Header from '@components/Header'
import { formatDate, formatDuration } from './DetallesPodcast.utils'
import { useTranslation } from 'react-i18next'

interface Episodio {
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

export function DetallesPodcast() {
  const { podcastId } = useParams()
  const { t } = useTranslation()

  const [podcast, setPodcast] = useState<Podcast | null>(null)
  const [episodios, setEpisodios] = useState<Episodio[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const fetchPodcastAndEpisodes = async () => {
      const storedPodcast = localStorage.getItem(`podcast-${podcastId}`)
      const storedTime = localStorage.getItem(`podcast-${podcastId}-lastFetch`)
      const hoy = Date.now()
      const dia = 24 * 60 * 60 * 1000

      if (storedPodcast && storedTime && hoy - parseInt(storedTime) < dia) {
        const parsed = JSON.parse(storedPodcast)
        setPodcast(parsed.podcast)
        setEpisodios(parsed.episodios)
        setCargando(false)
        return
      }

      try {
        setCargando(true)

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
        const episodiosData: Episodio[] = Array.from(items).map((item) => {
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
        setEpisodios(episodiosData)

        localStorage.setItem(
          `podcast-${podcastId}`,
          JSON.stringify({ podcast: podcastData, episodios: episodiosData }),
        )
        localStorage.setItem(`podcast-${podcastId}-lastFetch`, Date.now().toString())
      } catch (error) {
        console.error('Error cargando detalles del podcast:', error)
      } finally {
        setCargando(false)
      }
    }

    fetchPodcastAndEpisodes()
  }, [podcastId])

  if (cargando) return <Header cargando={cargando} />
  if (!podcast) return <p className="p-4">No se encontró el podcast.</p>

  return (
    <Container>
      <Header cargando={cargando} />
      <Sidebar>
        <Imagen
          src={podcast.artworkUrl600}
          alt={podcast.collectionName}
        />
        <Linea />
        <h2>{podcast.collectionName}</h2>
        <p>
          {' '}
          {t('podcastDetails.by')}: {podcast.artistName}
        </p>
        <Linea />
        <p>
          <strong> {t('podcastDetails.description')}:</strong>
          <div dangerouslySetInnerHTML={{ __html: podcast.description || '' }} />
        </p>
      </Sidebar>

      <div>
        <ContainerEpisodio>
          <h2>
            {t('podcastDetails.episodes')}: {episodios.length}
          </h2>
        </ContainerEpisodio>
        <MargenTabla>
          <Tabla>
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
          </Tabla>
        </MargenTabla>
      </div>
    </Container>
  )
}
