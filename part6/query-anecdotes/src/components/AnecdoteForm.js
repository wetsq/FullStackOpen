import axios from "axios"
import { useMutation, useQueryClient } from "react-query"
import { useContext } from 'react'
import NotificationContext from '../NotificationContext'

const AnecdoteForm = () => {
  const [notification, notificationDispatch] = useContext(NotificationContext)
  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation(
    (newAnecdote) => axios.post('http://localhost:3001/anecdotes', newAnecdote).then(res => res.data), {
      onSuccess: () => queryClient.invalidateQueries('anecdotes')
    }
  )

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    if (content.length < 5) {
      notificationDispatch({ type: "SET_NOTIFICATION", payload: 'too short anecdote, must have length 5 or more'})
      setTimeout(() => {notificationDispatch({ type: "RESET_NOTIFICATION" })}, 5000)
      return
    }
    newAnecdoteMutation.mutate({ content, votes: 0})
    notificationDispatch({ type: "SET_NOTIFICATION", payload: `You created ${content}`})
    setTimeout(() => {notificationDispatch({ type: "RESET_NOTIFICATION" })}, 5000)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
