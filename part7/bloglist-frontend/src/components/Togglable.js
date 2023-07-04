import { useState, useImperativeHandle, forwardRef } from 'react'
import { Button } from '@mui/material'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <>
      <div style={hideWhenVisible}>
        <Button
          variant="contained"
          onClick={toggleVisibility}
          id="toggleCreateBlogButton"
        >
          {props.buttonLabel}
        </Button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <Button variant="outlined" onClick={toggleVisibility}>
          cancel
        </Button>
      </div>
    </>
  )
})

Togglable.displayName = 'Togglable'

export default Togglable
