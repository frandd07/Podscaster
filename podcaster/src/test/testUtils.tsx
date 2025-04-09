import { render as defaultRender } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import i18n from '@language/index'
import { I18nextProvider } from 'react-i18next'
import { ReactElement } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

interface AllTheProvidersProps {
  children: ReactElement
  options?: {
    currentRoute?: string
  }
}

const AllTheProviders = ({ children, options = {} }: AllTheProvidersProps) => {
  const { currentRoute = '/*' } = options

  const router = createMemoryRouter([{ path: currentRoute, element: children }], {
    initialEntries: ['/'],
  })

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18n}>
        <RouterProvider router={router} />
      </I18nextProvider>
    </QueryClientProvider>
  )
}

interface CustomRenderOptions {
  currentRoute?: string
}

const customRender = (ui: ReactElement, options: CustomRenderOptions = {}) => {
  return defaultRender(<AllTheProviders options={options}>{ui}</AllTheProviders>)
}

export * from '@testing-library/react'
export { customRender as render }
