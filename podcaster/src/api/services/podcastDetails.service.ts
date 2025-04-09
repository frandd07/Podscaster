import axios from 'axios'
import { Podcast, Episode } from '@api/models/podcastDetail.model'
import { formatDuration } from '@modules/PodcastDetails/PodcastDetails.utils'

export async function getPodcastDetails(
  podcastId: string,
): Promise<{ podcast: Podcast; episodios: Episode[] }> {
  if (import.meta.env.VITE_IS_MOCK === 'true') {
    return {
      podcast: {
        collectionId: 101,
        collectionName: 'Futbol',
        artistName: 'Miguel Angel Roman',
        artworkUrl600: 'https://picsum.photos/600',
        feedUrl: 'https://example.com/feed.xml',
        description: 'El mejor podcast de fútbol',
      },
      episodios: [
        {
          title: 'Episode 1: Inauguración',
          pubDate: '2022-01-01T08:00:00Z',
          description: 'Inicio del podcast y presentación del programa.',
          audioUrl: 'https://example.com/audio1.mp3',
          duration: '35:20',
          episodeId: 'ep101',
        },
        {
          title: 'Episode 2: La Continuación',
          pubDate: '2022-01-08T08:00:00Z',
          description: 'Análisis profundo de los mejores partidos.',
          audioUrl: 'https://example.com/audio2.mp3',
          duration: '40:15',
          episodeId: 'ep102',
        },
      ],
    }
  }

  try {
    const lookupUrl = import.meta.env.VITE_ITUNES_LOOKUP_URL
    const lookupRes = await axios.get(`${lookupUrl}?id=${podcastId}`)
    const info = lookupRes.data.results[0]

    const podcastData: Podcast = {
      collectionId: info.collectionId,
      collectionName: info.collectionName,
      artistName: info.artistName,
      artworkUrl600: info.artworkUrl600,
      feedUrl: info.feedUrl,
      description: '',
    }

    const corsProxy = import.meta.env.VITE_CORS_PROXY
    const rssResponse = await axios.get(`${corsProxy}${podcastData.feedUrl}`)

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

    return { podcast: podcastData, episodios: episodesData }
  } catch (error) {
    console.error('Error en getPodcastDetails:', error)
    throw {
      message: 'Error al obtener detalles del podcast',
      code: 'PODCAST_DETAILS_ERROR',
    }
  }
}
