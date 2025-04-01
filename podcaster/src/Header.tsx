import { LinkInicio, Navbar } from "./Header.style";
import { Titulo } from "./Header.style";

const Header = () => {
  return (
    <Navbar>
      <LinkInicio to="/">
        <Titulo>Podcaster</Titulo>
      </LinkInicio>
    </Navbar>
  );
};

export default Header;
