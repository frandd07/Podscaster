import {
  Autor,
  Card,
  CardContent,
  FilterContainer,
  GridContainer,
  Image,
  InputSearch,
  NumberFiltered,
  TitleCard,
} from './Home.style'

import { useNavigate } from 'react-router-dom'
import Header from '@components/Header'
import { useGetPodcasts } from '@api/hooks/useGetPodcasts'
import { Podcast } from '@api/models/podcast.model'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function Home() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [filteredText, setFilteredText] = useState<string>('')

  const { data: podcasts, isLoading, isSuccess } = useGetPodcasts()

  const [filteredPodcasts, setFilteredPodcasts] = useState<Podcast[]>([])

  const handleOnChangeFilter = (filtro: string) => {
    const filteredPodcasts = podcasts
      ? podcasts.filter((podcast) => {
          return (
            podcast.name.toLocaleLowerCase().includes(filtro.toLowerCase()) ||
            podcast.author.toLowerCase().includes(filtro.toLowerCase())
          )
        })
      : []
    setFilteredPodcasts(filteredPodcasts)
  }

  useEffect(() => {
    if (isSuccess && podcasts) {
      setFilteredPodcasts(podcasts)
    }
  }, [podcasts, isSuccess])

  return (
    <>
      <Header cargando={isLoading} />
      <FilterContainer>
        <NumberFiltered>{filteredPodcasts.length}</NumberFiltered>
        <InputSearch
          type="text"
          value={filteredText}
          placeholder={t('mainPage.placeholder.filterPodcast')}
          onChange={(e) => {
            setFilteredText(e.target.value)
            handleOnChangeFilter(e.target.value)
          }}
        />
      </FilterContainer>

      <GridContainer>
        {filteredPodcasts.map((podcast) => (
          <Card
            key={podcast.id}
            onClick={() => navigate(`/podcast/${podcast.id}`)}
          >
            <CardContent>
              <Image
                src={podcast.image}
                alt={podcast.name}
              />
              <TitleCard>{podcast.name.toUpperCase()}</TitleCard>
              <Autor>
                {t('mainPage.authorLabel')}: {podcast.author}
              </Autor>
            </CardContent>
          </Card>
        ))}
      </GridContainer>
    </>
  )
}
