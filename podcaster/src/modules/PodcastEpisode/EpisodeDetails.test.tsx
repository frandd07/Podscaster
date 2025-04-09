import { render, screen } from 'src/test/testUtils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { EpisodeDetails } from './EpisodeDetails'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ podcastId: '101', episodeId: 'ep101' }),
    useNavigate: () => vi.fn(),
  }
})

describe('EpisodeDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra el spinner cuando los datos están cargando', () => {
    render(<EpisodeDetails />)

    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('muestra los detalles del episodio cuando la carga es exitosa', () => {
    render(<EpisodeDetails />)

    expect(screen.getByRole('img', { name: 'Futbol' })).toBeInTheDocument()
    const textFutbol = screen.getByText('Futbol')
    expect(textFutbol.closest('a')).toHaveAttribute('href', '/podcast/101')

    expect(screen.getByText('Episode 1: Inauguración')).toBeInTheDocument()
    expect(screen.getByText('Inicio del podcast y presentación del programa.')).toBeInTheDocument()
    const audioEl = screen.getByTestId('audio-element')
    expect(audioEl).toHaveAttribute('src', 'https://example.com/audio1.mp3')
  })
})
