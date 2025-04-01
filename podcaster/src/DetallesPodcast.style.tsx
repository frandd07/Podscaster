import styled from "styled-components";

export const Container = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  padding: 2rem;
  align-items: flex-start;
  max-width: 100%;
  box-sizing: border-box;
  background-color: #f9f9f9;
  margin-top: 5%;
`;

export const Sidebar = styled.aside`
  background: white;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  border-radius: 4px;
  border: 1px solid #ddd;
  font-family: Arial, sans-serif;
`;

export const Imagen = styled.img`
  width: 100%;
  border-radius: 4px;
`;

export const ContainerEpisodio = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 1rem;
  font-family: Arial, sans-serif;
  overflow-x: auto;
`;

export const Linea = styled.hr`
  margin: 1rem 0;
  border: none;
  border-top: 1px solid #ddd;
`;

export const Tabla = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  border: 1px solid #ddd;
  margin-top: 30px;
`;

export const Titulos = styled.th`
  font-weight: bold;
  background-color: #f3f3f3;
  padding: 0.75rem;
  border-bottom: 2px solid #ddd;
`;

export const Fila = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #eee;
`;
