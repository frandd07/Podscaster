import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from '@api/queryClient'
import AppRouter from '@components/AppRouter'

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
    </QueryClientProvider>
  )
}

export default App
