import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { EpisodeDetails } from './EpisodeDetails'
import { useGetEpisodeDetails } from '@api/hooks/useGetEpisodeDetails'
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest'

const mockEpisodeDetails = {
  podcast: {
    collectionId: 101,
    collectionName: 'Futbol',
    artistName: 'Miguel Angel Roman',
    artworkUrl600: 'https://picsum.photos/600',
    feedUrl: 'https://example.com/feed.xml',
    description: 'El mejor podcast de fútbol presentado por Miguel Angel Roman',
  },
  episodio: {
    trackId: 'ep101',
    trackName: 'Episode 1: Inauguración',
    description: 'Inicio del podcast y presentación del programa.',
    audioUrl: 'https://example.com/audio1.mp3',
  },
}

vi.mock('@api/hooks/useGetEpisodeDetails', () => ({
  useGetEpisodeDetails: vi.fn(() => ({
    data: mockEpisodeDetails,
    isLoading: false,
    isError: false,
  })),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ podcastId: '101', episodeId: 'ep101' }),
    useNavigate: () => vi.fn(),
  }
})

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'podcastDetails.negative': 'Error al obtener detalles del episodio',
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

describe('EpisodeDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra el spinner cuando los datos están cargando', () => {
    ;(useGetEpisodeDetails as unknown as Mock).mockReturnValueOnce({
      data: undefined,
      isLoading: true,
      isError: false,
    })

    render(
      <MemoryRouter>
        <EpisodeDetails />
      </MemoryRouter>,
    )

    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('muestra los detalles del episodio cuando la carga es exitosa', () => {
    render(
      <MemoryRouter>
        <EpisodeDetails />
      </MemoryRouter>,
    )

    expect(screen.getByRole('img', { name: 'Futbol' })).toBeInTheDocument()
    const textFutbol = screen.getByText('Futbol')
    expect(textFutbol.closest('a')).toHaveAttribute('href', '/podcast/101')

    expect(screen.getByText('Episode 1: Inauguración')).toBeInTheDocument()
    expect(screen.getByText('Inicio del podcast y presentación del programa.')).toBeInTheDocument()
    const audioEl = screen.getByTestId('audio-element')
    expect(audioEl).toHaveAttribute('src', 'https://example.com/audio1.mp3')
  })
})
