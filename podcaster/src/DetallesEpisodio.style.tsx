import styled from 'styled-components'

export const BarraAudio = styled.audio`
  background-color: #424242;
  margin-top: 2rem;
  width: 100%;
  border-radius: 25px;
  &::-webkit-media-controls-panel {
    background-color: #424242;
  }

  &::-webkit-media-controls-play-button,
  &::-webkit-media-controls-current-time-display,
  &::-webkit-media-controls-time-remaining-display,
  &::-webkit-media-controls-volume-slider,
  &::-webkit-media-controls-mute-button,
  &::-webkit-media-controls-timeline,
  &::-webkit-media-controls-seek-back-button,
  &::-webkit-media-controls-seek-forward-button,
  &::-webkit-media-controls-fullscreen-button,
  &::-webkit-media-controls-download-button,
  &::-webkit-media-controls-settings-button {
    filter: invert(1);
  }
`
