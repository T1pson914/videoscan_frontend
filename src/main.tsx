import { createRoot } from 'react-dom/client'
import {App} from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider,QueryClient } from '@tanstack/react-query'


export const client = new QueryClient()

// tanstack/query devtools:
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__:
      import('@tanstack/query-core')
        .QueryClient
  }
}
window.__TANSTACK_QUERY_CLIENT__ = client


createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <QueryClientProvider client={client}>
            <App />
        </QueryClientProvider>
    </BrowserRouter>
)
