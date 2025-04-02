import { IndicadorVisual, LinkInicio, Navbar } from "./Header.style";
import { Titulo } from "./Header.style";

interface Props {
  cargando: boolean;
}

const Header = ({ cargando }: Props) => {
  return (
    <Navbar>
      <LinkInicio to="/">
        <Titulo>Podcaster</Titulo>
      </LinkInicio>
      {cargando && <IndicadorVisual />}
    </Navbar>
  );
};

export default Header;
