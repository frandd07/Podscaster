import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Header } from './Header'
import { BrowserRouter } from 'react-router-dom'
import userEvent from '@testing-library/user-event'

describe('Header', () => {
  it('muestra el título "Podcaster"', () => {
    render(
      <BrowserRouter>
        <Header cargando={false} />
      </BrowserRouter>,
    )

    expect(screen.getByText('Podcaster')).toBeInTheDocument()
  })

  it('muestra el spinner si cargando es true', () => {
    render(
      <BrowserRouter>
        <Header cargando={true} />
      </BrowserRouter>,
    )

    const spinner = screen.getByTestId('spinner')
    expect(spinner).toBeInTheDocument()
  })

  it('el título redirige al hacer clic', async () => {
    render(
      <BrowserRouter>
        <Header cargando={false} />
      </BrowserRouter>,
    )

    const link = screen.getByRole('link', { name: /podcaster/i })
    expect(link).toHaveAttribute('href', '/')

    await userEvent.click(link)
  })
})
