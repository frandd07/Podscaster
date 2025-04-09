import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { Home } from './Home'
import { render, screen } from 'src/test/testUtils'

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
    render(<Home />)
    console.log(screen.debug())

    expect(screen.getByText(/Podcaster/i)).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()

    expect(screen.getByText('TEST PODCAST 1')).toBeInTheDocument()
    expect(screen.getByText('PODCAST 2')).toBeInTheDocument()
  })

  it('filtra correctamente los podcasts según el texto ingresado', async () => {
    render(<Home />)

    const input = screen.getByPlaceholderText('Filter podcasts...')
    await userEvent.clear(input)
    await userEvent.type(input, 'Test')

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('TEST PODCAST 1')).toBeInTheDocument()
    expect(screen.queryByText('PODCAST 2')).toBeNull()
  })

  it('navega a la página de detalles al hacer clic en una tarjeta de podcast', async () => {
    render(<Home />)

    const card = screen.getByText('TEST PODCAST 1')
    await userEvent.click(card)

    expect(mockNavigate).toHaveBeenCalledWith('/podcast/1')
  })
})
