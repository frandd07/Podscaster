import { Podcast, respAPI } from '@api/models/podcast.model'
import axios from 'axios'
const url = import.meta.env.VITE_PODCAST_API_URL

export const getPodcasts = async () => {
  try {
    const response = await axios.get<respAPI>(url)

    const data = response.data.feed.entry

    const podcasts: Podcast[] = data.map((entry) => ({
      id: entry.id.attributes['im:id'],
      name: entry['im:name'].label,
      author: entry['im:artist'].label,
      image: entry['im:image'][2].label,
    }))

    return podcasts
  } catch (e) {
    throw { message: 'Error al obtener podcasts', code: 'PODCASTS_ERROR' }
  }
}
