import { MainPage, PodcastDetails, PodcastEpisode } from '@routes/lazy'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import * as paths from '@routes/paths'

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path={paths.DEFAULT_PAGE}
        element={<MainPage />}
      />
      <Route
        path={paths.DETAILS_PODCAST}
        element={<PodcastDetails />}
      />
      <Route
        path={paths.DETAILS_EPISODE}
        element={<PodcastEpisode />}
      />
    </Routes>
  </BrowserRouter>
)
