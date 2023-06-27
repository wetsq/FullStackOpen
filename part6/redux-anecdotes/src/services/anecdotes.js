import axios from 'axios'
const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const createAnecdote = async (content) => {
  const anecdote = {content, votes: 0}
  const response = await axios.post(baseUrl, anecdote)
  return response.data
}

const voteAnecdote = async (id) => {
  const anecdotes = await getAll()
  let votedAnecdote = anecdotes.find((anecdote) => anecdote.id === id)
  votedAnecdote = {
    ...votedAnecdote,
    votes: votedAnecdote.votes += 1
  }
  await axios.put(`${baseUrl}/${id}`, votedAnecdote)
}

export default { getAll, createAnecdote, voteAnecdote }