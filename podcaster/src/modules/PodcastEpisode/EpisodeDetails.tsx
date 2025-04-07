import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { Audio } from './EpisodeDetails.style'
import { Link } from 'react-router-dom'
import Header from '@components/Header'
import {
  Container,
  ContainerEpisode,
  Image,
  Line,
  Sidebar,
} from '@modules/PodcastDetails/PodcastDetails.style'
import { useTranslation } from 'react-i18next'

interface Episode {
  trackId: string
  trackName: string
  description: string
  audioUrl: string
}

interface Podcast {
  collectionId: number
  collectionName: string
  artistName: string
  artworkUrl600: string
  feedUrl: string
  description?: string
}

export function EpisodeDetails() {
  const { podcastId, episodeId } = useParams()
  const { t } = useTranslation()

  const [podcast, setPodcast] = useState<Podcast | null>(null)
  const [episodio, setEpisodio] = useState<Episode | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPodcastAndEpisode = async () => {
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
        }

        const rssRes = await axios.get(`https://cors-anywhere.herokuapp.com/${podcastData.feedUrl}`)
        const xmlString = rssRes.data
        const parser = new DOMParser()
        const xml = parser.parseFromString(xmlString, 'application/xml')

        const channel = xml.querySelector('channel')
        const feedDescription = channel?.querySelector('description')?.textContent || ''
        podcastData.description = feedDescription

        setPodcast(podcastData)

        const items = xml.getElementsByTagName('item')
        const episodes = Array.from(items).map((item) => {
          const trackId = item.querySelector('guid')?.textContent || ''
          return {
            trackId: trackId,
            trackName: item.querySelector('title')?.textContent || '',
            description: item.querySelector('description')?.textContent || '',
            audioUrl: item.querySelector('enclosure')?.getAttribute('url') || '',
          }
        })

        const ep = episodes.find((e) => e.trackId === episodeId)
        setEpisodio(ep || null)
      } catch (err) {
        console.error('Error cargando episodio:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchPodcastAndEpisode()
  }, [podcastId, episodeId])

  if (loading) return <Header cargando={loading} />
  if (!podcast || !episodio) return <p>{t('podcastDetails.negative')}</p>

  return (
    <Container>
      <Header cargando={loading} />

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
        />
      </ContainerEpisode>
    </Container>
  )
}
