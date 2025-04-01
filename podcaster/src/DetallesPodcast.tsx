import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  ContainerEpisodio,
  Fila,
  Imagen,
  Linea,
  Sidebar,
  Tabla,
  Titulos,
} from "./DetallesPodcast.style";
import Header from "./Header";

interface Episodio {
  title: string;
  pubDate: string;
  description: string;
  audioUrl: string;
  duration: string;
}

interface Podcast {
  collectionId: number;
  collectionName: string;
  artistName: string;
  artworkUrl600: string;
  feedUrl: string;
  description?: string;
}

function DetallesPodcast() {
  const { podcastId } = useParams();

  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [episodios, setEpisodios] = useState<Episodio[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchPodcastAndEpisodes = async () => {
      try {
        setCargando(true);

        const lookupRes = await axios.get(
          `https://itunes.apple.com/lookup?id=${podcastId}`
        );
        const info = lookupRes.data.results[0];

        const podcastData: Podcast = {
          collectionId: info.collectionId,
          collectionName: info.collectionName,
          artistName: info.artistName,
          artworkUrl600: info.artworkUrl600,
          feedUrl: info.feedUrl,
          description: "",
        };

        setPodcast(podcastData);

        const rssResponse = await axios.get(
          `https://cors-anywhere.herokuapp.com/${podcastData.feedUrl}`
        );
        const xmlString = rssResponse.data;
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlString, "application/xml");

        const items = xml.getElementsByTagName("item");
        const episodiosData: Episodio[] = Array.from(items).map((item) => {
          const rawDuration =
            item.getElementsByTagName("itunes:duration")[0]?.textContent || "";
          return {
            title:
              item.getElementsByTagName("title")[0]?.textContent ||
              "(Sin título)",
            pubDate: item.getElementsByTagName("pubDate")[0]?.textContent || "",
            description:
              item.getElementsByTagName("description")[0]?.textContent || "",
            audioUrl:
              item.getElementsByTagName("enclosure")[0]?.getAttribute("url") ||
              "",
            duration: formatDuration(rawDuration),
          };
        });
        const channel = xml.querySelector("channel");
        const feedDescription =
          channel?.querySelector("description")?.textContent || "";
        podcastData.description = feedDescription;

        setEpisodios(episodiosData);
      } catch (error) {
        console.error("Error cargando detalles del podcast:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchPodcastAndEpisodes();
  }, [podcastId]);

  if (cargando) return <p className="p-4">Cargando...</p>;
  if (!podcast) return <p className="p-4">No se encontró el podcast.</p>;

  return (
    <Container>
      <Header />
      <Sidebar>
        <Imagen src={podcast.artworkUrl600} alt={podcast.collectionName} />
        <Linea />
        <h2>{podcast.collectionName}</h2>
        <p>by {podcast.artistName}</p>
        <Linea />
        <p>
          <strong>Description:</strong>
          <br />
          {podcast.description}
        </p>
      </Sidebar>

      <div>
        <ContainerEpisodio>
          <h2>Episodes: {episodios.length}</h2>
        </ContainerEpisodio>

        <main>
          <Tabla>
            <thead>
              <tr>
                <Titulos>Title</Titulos>
                <Titulos>Date</Titulos>
                <Titulos>Duration</Titulos>
              </tr>
            </thead>
            <tbody>
              {episodios.map((ep, index) => (
                <tr key={index}>
                  <Fila>{ep.title}</Fila>
                  <Fila>{formatDate(ep.pubDate)}</Fila>
                  <Fila>{ep.duration}</Fila>
                </tr>
              ))}
            </tbody>
          </Tabla>
        </main>
      </div>
    </Container>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
}

function formatDuration(raw: string): string {
  if (!raw) return "";
  if (raw.includes(":")) return raw;

  const seconds = parseInt(raw);
  if (isNaN(seconds)) return raw;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0
    ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
    : `${m}:${s.toString().padStart(2, "0")}`;
}

export default DetallesPodcast;
