import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import {
  Card,
  CardContenido,
  FiltroContainer,
  GridContainer,
  Imagen,
  InputBuscar,
  NumeroFiltrado,
  TituloCard,
} from "./Principal.style";

import { useNavigate } from "react-router-dom";

interface Podcast {
  id: string;
  name: string;
  author: string;
  image: string;
}

interface respAPI {
  feed: {
    entry: {
      id: { attributes: { "im:id": string } };
      "im:name": { label: string };
      "im:artist": { label: string };
      "im:image": { label: string }[];
    }[];
  };
}

function Principal() {
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [filtrar, setFiltrar] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<respAPI>(
          "https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json"
        );

        const data = response.data.feed.entry;

        const podcasts: Podcast[] = data.map((entry) => ({
          id: entry.id.attributes["im:id"],
          name: entry["im:name"].label,
          author: entry["im:artist"].label,
          image: entry["im:image"][2].label,
        }));

        setPodcasts(podcasts);
      } catch (e) {
        console.error("ERROR: ", e);
      }
    };

    fetchData();
  }, []);

  const filtrarPorNombre = podcasts.filter((podcast) => {
    return (
      podcast.name.toLocaleLowerCase().includes(filtrar.toLowerCase()) ||
      podcast.author.toLowerCase().includes(filtrar.toLowerCase())
    );
  });

  return (
    <>
      <Header />
      <FiltroContainer>
        <NumeroFiltrado>{filtrarPorNombre.length}</NumeroFiltrado>
        <InputBuscar
          type="text"
          value={filtrar}
          placeholder="Filter podcast..."
          onChange={(e) => {
            setFiltrar(e.target.value);
          }}
        />
      </FiltroContainer>

      <GridContainer>
        {filtrarPorNombre.map((podcast) => (
          <Card
            key={podcast.id}
            onClick={() => navigate(`/podcast/${podcast.id}`)}
          >
            <CardContenido>
              <Imagen src={podcast.image} alt={podcast.name} />
              <TituloCard>{podcast.name.toUpperCase()}</TituloCard>
              <p>Author: {podcast.author}</p>
            </CardContenido>
          </Card>
        ))}
      </GridContainer>
    </>
  );
}

export default Principal;
