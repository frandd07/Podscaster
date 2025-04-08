import axios from 'axios'
import { Podcast } from '../models/podcastDetail.model'
import { Episode } from '../models/episodeDetail.model'

export async function getEpisodeDetails(
  podcastId: string,
  episodeId: string,
): Promise<{ podcast: Podcast; episodio: Episode | null }> {
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
    const rssRes = await axios.get(`${corsProxy}${podcastData.feedUrl}`)

    const xmlString = rssRes.data
    const parser = new DOMParser()
    const xml = parser.parseFromString(xmlString, 'application/xml')

    const channel = xml.querySelector('channel')
    const feedDescription = channel?.querySelector('description')?.textContent || ''
    podcastData.description = feedDescription

    const items = xml.getElementsByTagName('item')
    const episodes = Array.from(items).map((item) => {
      const trackId = item.querySelector('guid')?.textContent || ''
      return {
        trackId,
        trackName: item.querySelector('title')?.textContent || '',
        description: item.querySelector('description')?.textContent || '',
        audioUrl: item.querySelector('enclosure')?.getAttribute('url') || '',
      }
    })

    const episodio = episodes.find((e) => e.trackId === episodeId) || null

    return { podcast: podcastData, episodio }
  } catch (error) {
    console.error('Error en getEpisodeDetails:', error)
    throw {
      message: 'Error al obtener detalles del episodio',
      code: 'EPISODE_DETAILS_ERROR',
    }
  }
}
