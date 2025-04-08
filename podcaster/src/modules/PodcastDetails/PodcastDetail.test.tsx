import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { PodcastDetails } from './PodcastDetails'
import { useGetPodcastDetails } from '@api/hooks/useGetPodcastDetails'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'

const mockPodcastDetails = {
  podcast: {
    collectionId: 101,
    collectionName: 'Futbol',
    artistName: 'Miguel Angel Roman',
    artworkUrl600: 'https://picsum.photos/600',
    feedUrl: 'https://example.com/feed.xml',
    description: 'El mejor podcast de fútbol presentado por Miguel Angel Roman',
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

vi.mock('@api/hooks/useGetPodcastDetails', () => ({
  useGetPodcastDetails: vi.fn(() => ({
    data: mockPodcastDetails,
    isLoading: false,
    isError: false,
  })),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ podcastId: '101' }),
    useNavigate: () => vi.fn(),
  }
})

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'podcastDetails.negative': 'Error al obtener detalles del podcast',
        'podcastDetails.by': 'Por',
        'podcastDetails.description': 'Descripción',
        'podcastDetails.episodes': 'Episodios',
        'podcastDetails.title': 'Título',
        'podcastDetails.date': 'Fecha',
        'podcastDetails.duracion': 'Duración',
      }
      return translations[key] || key
    },
  }),
}))

describe('PodcastDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra el spinner cuando los datos están cargando', () => {
    ;(useGetPodcastDetails as unknown as Mock).mockReturnValueOnce({
      data: undefined,
      isLoading: true,
      isError: false,
    })

    render(
      <MemoryRouter>
        <PodcastDetails />
      </MemoryRouter>,
    )

    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('muestra los detalles del podcast y sus episodios cuando la carga es exitosa', () => {
    render(
      <MemoryRouter>
        <PodcastDetails />
      </MemoryRouter>,
    )

    expect(screen.getByText('Futbol')).toBeInTheDocument()
    expect(screen.getByText(/^Por:/i)).toBeInTheDocument()
    expect(
      screen.getByText('El mejor podcast de fútbol presentado por Miguel Angel Roman'),
    ).toBeInTheDocument()
    expect(screen.getByText(/Episodios: 2/i)).toBeInTheDocument()
    expect(screen.getByText('Episode 1: Inauguración')).toBeInTheDocument()
    expect(screen.getByText('Episode 2: La Continuación')).toBeInTheDocument()
    const episodeLink = screen.getByRole('link', { name: 'Episode 1: Inauguración' })
    expect(episodeLink).toHaveAttribute('href', '/podcast/101/episode/ep101')
  })
})
