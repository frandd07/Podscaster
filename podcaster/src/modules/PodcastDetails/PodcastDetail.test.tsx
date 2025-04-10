import { render, screen } from 'src/test/testUtils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PodcastDetails } from './PodcastDetails'

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useParams: () => ({ podcastId: '101' }),
    useNavigate: () => vi.fn(),
  }
})

describe('PodcastDetails', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('muestra el spinner cuando los datos están cargando', () => {
    render(<PodcastDetails />)

    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('muestra los detalles del podcast y sus episodios cuando la carga es exitosa', () => {
    render(<PodcastDetails />)

    console.log(screen.debug())

    expect(screen.getByText('Futbol')).toBeInTheDocument()
    expect(screen.getByText(/Miguel Angel Roman/i)).toBeInTheDocument()
    expect(screen.getByText('El mejor podcast de fútbol')).toBeInTheDocument()
    expect(screen.getByText(/Episodes: 2/i)).toBeInTheDocument()
    expect(screen.getByText('Episode 1: Inauguración')).toBeInTheDocument()
    expect(screen.getByText('Episode 2: La Continuación')).toBeInTheDocument()

    const episodeLink = screen.getByRole('link', { name: 'Episode 1: Inauguración' })
    expect(episodeLink).toHaveAttribute('href', '/podcast/101/episode/ep101')
  })
})
