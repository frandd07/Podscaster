import { Routes, Route } from "react-router-dom";
import Principal from "./Principal";
import DetallesPodcast from "./DetallesPodcast";
import DetallesEpisodio from "./DetallesEpisodio";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Principal />} />
      <Route path="/podcast/:podcastId" element={<DetallesPodcast />} />
      <Route
        path="/podcast/:podcastId/episode/:episodeId"
        element={<DetallesEpisodio />}
      />
    </Routes>
  );
}

export default App;
