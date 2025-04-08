import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { Home } from './Home'

const mockPodcasts = [
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

vi.mock('@api/hooks/useGetPodcasts', () => ({
  useGetPodcasts: () => ({
    data: mockPodcasts,
    isLoading: false,
    isSuccess: true,
  }),
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'mainPage.placeholder.filterPodcast': 'Filter podcasts...',
        'mainPage.authorLabel': 'Author',
      }
      return translations[key] || key
    },
  }),
}))

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

describe('Home', () => {
  it('muestra el header, el filtro y todas las tarjetas de podcasts', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    expect(screen.getByText(/Podcaster/i)).toBeInTheDocument()

    expect(screen.getByText(String(mockPodcasts.length))).toBeInTheDocument()

    mockPodcasts.forEach((podcast) => {
      expect(screen.getByText(podcast.name.toUpperCase())).toBeInTheDocument()
    })
  })

  it('filtra correctamente los podcasts según el texto ingresado', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    const input = screen.getByPlaceholderText('Filter podcasts...')
    expect(input).toBeInTheDocument()

    await userEvent.clear(input)
    await userEvent.type(input, 'Test')

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('TEST PODCAST 1')).toBeInTheDocument()
    expect(screen.queryByText('ANOTHER PODCAST')).toBeNull()
  })

  it('navega a la página de detalles al hacer clic en una tarjeta de podcast', async () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    const card = screen.getByText(/podcast 1/i)

    expect(card).toBeInTheDocument()

    await userEvent.click(card)

    expect(mockNavigate).toHaveBeenCalledWith(`/podcast/1`)
  })
})
