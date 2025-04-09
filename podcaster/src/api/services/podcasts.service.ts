import { Podcast, respAPI } from '@api/models/podcast.model'
import axios from 'axios'

const url = import.meta.env.VITE_PODCAST_API_URL

export const getPodcasts = async () => {
  if (import.meta.env.VITE_IS_MOCK === 'true') {
    return [
      {
        id: '1',
        name: 'Test Podcast 1',
        author: 'Leiva',
        image: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/Premios_Goya_2018_-_Leiva.jpg',
      },
      {
        id: '2',
        name: 'Podcast 2',
        author: 'Aitana',
        image:
          'https://s1.ppllstatics.com/rc/www/multimedia/2025/04/07/aitana-kCK-U2301393029367z2F-1200x840@RC.jpg',
      },
    ]
  }

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
