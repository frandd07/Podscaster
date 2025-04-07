import axios from 'axios'
import { Podcast, Episode } from '../models/podcastdetail.model'
import { formatDuration } from '@modules/PodcastDetails/PodcastDetails.utils'

export async function getPodcastDetails(
  podcastId: string,
): Promise<{ podcast: Podcast; episodios: Episode[] }> {
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

  const rssResponse = await axios.get(`https://cors-anywhere.herokuapp.com/${podcastData.feedUrl}`)
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
}
