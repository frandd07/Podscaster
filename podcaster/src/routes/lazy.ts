import { lazy } from 'react'

export const MainPage = lazy(() => import('@modules/MainPage'))
export const PodcastDetails = lazy(() => import('@modules/PodcastDetails'))
export const PodcastEpisode = lazy(() => import('@modules/PodcastEpisode'))
