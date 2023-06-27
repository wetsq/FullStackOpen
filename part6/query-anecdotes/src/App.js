import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import axios from 'axios'
import { useContext } from 'react'
import NotificationContext from './NotificationContext'


const App = () => {
  const [notification, notificationDispatch] = useContext(NotificationContext)
  const queryClient = useQueryClient()
  const voteAnecdoteMutation = useMutation(
    (votedAnecdote) => axios.put(`http://localhost:3001/anecdotes/${votedAnecdote.id}`, votedAnecdote).then(res => res.data), {
      onSuccess: () => queryClient.invalidateQueries('anecdotes')
    }
  )

  const handleVote = (anecdote) => {
    anecdote = {
      ...anecdote,
      votes: anecdote.votes + 1
    }
    voteAnecdoteMutation.mutate(anecdote)
    notificationDispatch({ type: "SET_NOTIFICATION", payload: `You voted ${anecdote.content}`})
    setTimeout(() => {notificationDispatch({ type: "RESET_NOTIFICATION" })}, 5000)
  }

  const result = useQuery(
    'anecdotes',
    () => axios.get('http://localhost:3001/anecdotes').then(res => res.data),
    { retry: false }
  )

  if (result.isLoading) {
    return(<div></div>)
  }

  if (result.isError) {
    return (
      <div>
        anecdote service not available due to problems in server
      </div>
    )
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
