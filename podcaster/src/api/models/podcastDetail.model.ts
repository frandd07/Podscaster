export interface Episode {
  title: string
  pubDate: string
  description: string
  audioUrl: string
  duration: string
  episodeId: string
}

export interface Podcast {
  collectionId: number
  collectionName: string
  artistName: string
  artworkUrl600: string
  feedUrl: string
  description?: string
}
