import { createSlice } from "@reduxjs/toolkit"


const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    addNotification(state, action) {
      console.log('set')
      return action.payload
    },
    resetNotification(state, action) {
      console.log('reset')
      return null
    }
  }
})

export const setNotification = (message, time) => {
  return async dispatch => {
    dispatch(addNotification(message))
    setTimeout(() => {dispatch(resetNotification())}, time * 1000)
  }
}

export const { resetNotification, addNotification } = notificationSlice.actions
export default notificationSlice.reducer