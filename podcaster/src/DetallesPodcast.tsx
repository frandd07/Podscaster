import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

interface Episodio {
  trackId: number;
  trackName: string;
  releaseDate: string;
  trackTimeMillis: number;
}

interface Podcast {
  collectionId: number;
  collectionName: string;
  artistName: string;
  artworkUrl600: string;
  description?: string;
}

interface EpisodioAPI {
  trackId: number;
  trackName: string;
  releaseDate: string;
  trackTimeMillis: number;
}

function DetallesPodcast() {
  const { podcastId } = useParams();
  const navigate = useNavigate();

  const [podcast, setPodcast] = useState<Podcast | null>(null);
  const [episodios, setEpisodios] = useState<Episodio[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const fetchPodcastData = async () => {
      try {
        setCargando(true);

        const response = await axios.get(
          `https://api.allorigins.win/get?url=${encodeURIComponent(
            `https://itunes.apple.com/lookup?id=${podcastId}&entity=podcastEpisode`
          )}`
        );

        const data = JSON.parse(response.data.contents);
        const [info, ...eps] = data.results;

        const podcastData: Podcast = {
          collectionId: info.collectionId,
          collectionName: info.collectionName,
          artistName: info.artistName,
          artworkUrl600: info.artworkUrl600,
          description: info.description || info.collectionName,
        };

        const episodiosData: Episodio[] = eps.map((ep: EpisodioAPI) => ({
          trackId: ep.trackId,
          trackName: ep.trackName,
          releaseDate: ep.releaseDate,
          trackTimeMillis: ep.trackTimeMillis,
        }));

        setPodcast(podcastData);
        setEpisodios(episodiosData);
      } catch (error) {
        console.error("Error cargando detalles del podcast:", error);
      } finally {
        setCargando(false);
      }
    };

    fetchPodcastData();
  }, [podcastId]);

  if (cargando) return <p className="p-4">Cargando...</p>;
  if (!podcast) return <p className="p-4">No se encontró el podcast.</p>;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      <aside className="w-full md:w-1/4 bg-white shadow-md p-4 rounded-md">
        <img
          src={podcast.artworkUrl600}
          alt={podcast.collectionName}
          className="w-full rounded"
        />
        <hr className="my-4" />
        <h2 className="font-bold text-lg">{podcast.collectionName}</h2>
        <p className="italic text-gray-600">by {podcast.artistName}</p>
        <hr className="my-4" />
        <p className="text-sm text-gray-700">
          <strong>Description:</strong>
          <br />
          {podcast.description}
        </p>
      </aside>

      <main className="flex-1 bg-white shadow-md p-4 rounded-md overflow-auto">
        <h2 className="font-bold text-xl mb-4">Episodes: {episodios.length}</h2>
        <table className="table-auto w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="p-2">Title</th>
              <th className="p-2">Date</th>
              <th className="p-2">Duration</th>
            </tr>
          </thead>
          <tbody>
            {episodios.map((ep) => (
              <tr
                key={ep.trackId}
                onClick={() =>
                  navigate(`/podcast/${podcastId}/episode/${ep.trackId}`, {
                    state: { podcast },
                  })
                }
                className="cursor-pointer hover:bg-gray-50 transition"
              >
                <td className="p-2 text-blue-600 underline">{ep.trackName}</td>
                <td className="p-2">{formatDate(ep.releaseDate)}</td>
                <td className="p-2">{millisToTime(ep.trackTimeMillis)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

function millisToTime(ms: number) {
  if (!ms) return "N/A";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB");
}

export default DetallesPodcast;
