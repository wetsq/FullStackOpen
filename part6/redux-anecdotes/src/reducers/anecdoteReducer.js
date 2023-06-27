import { createSlice } from "@reduxjs/toolkit"
import anecdoteService from "../services/anecdotes"

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    setAnecdote(state, action) {
      let votedAnecdote = state.find((a) => a.id === action.payload)
      votedAnecdote = {
        ...votedAnecdote,
        votes: votedAnecdote.votes + 1
      }
      return state.map((a) => a.id === action.payload ? votedAnecdote : a).sort((a, b) => b.votes - a.votes)
    },
    appendAnecdote(state, action) {
      return state.concat(action.payload).sort((a, b) => b.votes - a.votes)
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    anecdotes.sort((a, b) => b.votes - a.votes)
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createAnecdote(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const voteAnecdote = id => {
  return async dispatch => {
    await anecdoteService.voteAnecdote(id)
    dispatch(setAnecdote(id))
  }
}

export const { setAnecdotes, setAnecdote, appendAnecdote} = anecdoteSlice.actions
export default anecdoteSlice.reducer