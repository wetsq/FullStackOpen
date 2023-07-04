import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { QueryClient, QueryClientProvider } from 'react-query'
import { NotificationContextProvider } from './NotificationContext'
import { UserContextProvider } from './UserContext'
import { Container } from '@mui/material'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <Container>
    <UserContextProvider>
      <NotificationContextProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </NotificationContextProvider>
    </UserContextProvider>
  </Container>
)
