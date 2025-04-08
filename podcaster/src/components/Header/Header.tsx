import { VisualIndicator, LinkHome, Navbar } from './Header.style'
import { Title } from './Header.style'

interface Props {
  cargando: boolean
}

export const Header = ({ cargando }: Props) => {
  return (
    <Navbar>
      <LinkHome to="/">
        <Title>Podcaster</Title>
      </LinkHome>
      {cargando && <VisualIndicator data-testid="spinner" />}
    </Navbar>
  )
}
