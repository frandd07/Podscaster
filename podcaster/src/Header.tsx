import { Navbar } from "./Header.style";
import { Link } from "react-router-dom";
import { Titulo } from "./Header.style";

const Header = () => {
  return (
    <Navbar>
      <Link to="/">
        <Titulo>Podcaster</Titulo>
      </Link>
    </Navbar>
  );
};

export default Header;
