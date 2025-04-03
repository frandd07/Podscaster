import styled, { keyframes } from 'styled-components'
import { Link } from 'react-router-dom'

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
`

export const Titulo = styled.h1`
  color: #5b87b1;
  font-size: 1.3rem;
  margin: 0;
`

export const LinkInicio = styled(Link)`
  text-decoration: none;
`

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

export const IndicadorVisual = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  width: 24px;
  height: 24px;
  border: 3px solid #ccc;
  border-top-color: #2a5db0; // azul
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  z-index: 9999;
`
