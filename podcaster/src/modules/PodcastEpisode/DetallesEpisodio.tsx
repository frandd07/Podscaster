import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

import { BarraAudio } from './DetallesEpisodio.style'
import { Link } from 'react-router-dom'
import Header from '@components/Header'
import {
  Container,
  ContainerEpisodio,
  Imagen,
  Linea,
  Sidebar,
} from '@modules/PodcastDetails/DetallesPodcast.style'
import { useTranslation } from 'react-i18next'

interface Episodio {
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

export function DetallesEpisodio() {
  const { podcastId, episodeId } = useParams()
  const { t } = useTranslation()

  const [podcast, setPodcast] = useState<Podcast | null>(null)
  const [episodio, setEpisodio] = useState<Episodio | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const fetchPodcastAndEpisode = async () => {
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
        const episodios = Array.from(items).map((item) => {
          const trackId = item.querySelector('guid')?.textContent || ''
          return {
            trackId: trackId,
            trackName: item.querySelector('title')?.textContent || '',
            description: item.querySelector('description')?.textContent || '',
            audioUrl: item.querySelector('enclosure')?.getAttribute('url') || '',
          }
        })

        const ep = episodios.find((e) => e.trackId === episodeId)
        setEpisodio(ep || null)
      } catch (err) {
        console.error('Error cargando episodio:', err)
      } finally {
        setCargando(false)
      }
    }

    fetchPodcastAndEpisode()
  }, [podcastId, episodeId])

  if (cargando) return <Header cargando={cargando} />
  if (!podcast || !episodio) return <p>No se encontró el episodio.</p>

  return (
    <Container>
      <Header cargando={cargando} />

      <Sidebar>
        <Link to={`/podcast/${podcastId}`}>
          <Imagen
            src={podcast.artworkUrl600}
            alt={podcast.collectionName}
          />
        </Link>

        <Linea />

        <h2>
          <Link to={`/podcast/${podcastId}`}>{podcast.collectionName}</Link>
        </h2>

        <p>
          {t('podcastDetails.by')}
          <Link to={`/podcast/${podcastId}`}> {podcast.artistName}</Link>
        </p>

        <Linea />

        <p>
          <strong>{t('podcastDetails.description')}:</strong>
          <div dangerouslySetInnerHTML={{ __html: podcast.description || '' }} />
        </p>
      </Sidebar>

      <ContainerEpisodio>
        <h2>{episodio.trackName}</h2>
        <em>
          <div dangerouslySetInnerHTML={{ __html: episodio.description }} />
        </em>
        <BarraAudio
          controls
          src={episodio.audioUrl}
        />
      </ContainerEpisodio>
    </Container>
  )
}
