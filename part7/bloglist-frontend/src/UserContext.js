import { createContext, useReducer } from 'react'

const userReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.payload
    default:
      return state
  }
}

const UserContext = createContext()

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, null)

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContext
