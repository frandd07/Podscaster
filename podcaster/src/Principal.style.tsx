import styled from "styled-components";

export const InputBuscar = styled.input`
  right: 0%;
`;

export const NumeroFiltrado = styled.span`
  background-color: #5b87b1;
  border-radius: 5px;
  color: #ffffff;
  font-weight: bold;
  padding: 0px 5px;
  margin-right: 5px;
`;

export const FiltroContainer = styled.div`
  position: fixed;
  top: 10%;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 20px 40px;
  box-sizing: border-box;
  min-height: 60px;
  z-index: 100;
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
  row-gap: 80px;
  padding: 20px;
  margin-top: 180px;
  overflow-x: hidden;
`;

export const Card = styled.div`
  margin-top: 34px;
  position: relative;
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  text-align: center;
  justify-content: flex-end;
  align-items: center;
  padding-top: 40px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1), 9px 0 9px rgba(0, 0, 0, 0.05),
    -2px 0 6px rgba(0, 0, 0, 0.05);
  cursor: pointer;
`;

export const TituloCard = styled.h2`
  font-size: 1rem;
  text-align: center;
  word-wrap: break-word;
`;
export const Imagen = styled.img`
  border-radius: 50%;
  object-fit: cover;
  width: 100px;
  height: 100px;
  position: absolute;
  top: -50px;
  left: calc(50% - 50px);
`;

export const CardContenido = styled.div`
  margin-top: 0px;
  padding: 0 10px;
`;

export const Autor = styled.p`
  color: #525252;
`;
