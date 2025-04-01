import styled from "styled-components";
import { Link } from "react-router-dom";

export const Navbar = styled.header`
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  position: fixed;
  padding: 15px 30px;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Titulo = styled.h1`
  color: #5b87b1;
  font-size: 1.3rem;
  margin: 0;
`;

export const LinkInicio = styled(Link)`
  text-decoration: none;
`;
