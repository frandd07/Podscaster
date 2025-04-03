export interface Podcast {
  id: string
  name: string
  author: string
  image: string
}

export interface respAPI {
  feed: {
    entry: {
      id: { attributes: { 'im:id': string } }
      'im:name': { label: string }
      'im:artist': { label: string }
      'im:image': { label: string }[]
    }[]
  }
}
