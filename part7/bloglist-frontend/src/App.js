import { useState, useEffect, useRef, useContext } from 'react'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'
import NotificationContext from './NotificationContext'
import UserContext from './UserContext'
import { useQuery, useQueryClient, useMutation } from 'react-query'
import { BrowserRouter, Link, Route, Routes, useParams } from 'react-router-dom'
import {
  TextField,
  Button,
  Alert,
  AlertTitle,
  AppBar,
  Toolbar,
} from '@mui/material'

const Notification = (params) => {
  if (params.notification === null) {
    return null
  }
  return (
    <Alert severity="error">
      <AlertTitle>login error</AlertTitle>
      <h2>{params.notification}</h2>
    </Alert>
  )
}

const User = ({ users }) => {
  if (!users) {
    return null
  }
  const id = useParams().id
  const user = users.find((us) => us.id === id)
  return (
    <div>
      <h2>{user.name}</h2>
      <p>added blogs</p>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

const Users = ({ users }) => {
  if (!users) {
    return null
  }
  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              <strong>blogs created</strong>
            </th>
          </tr>
          {users.map((us) => (
            <tr key={us.id}>
              <th>
                <Link to={`/users/${us.id}`}>{us.name}</Link>
              </th>
              <th>{us.blogs.length}</th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const SingleBlog = ({ blogs, handleLike, handleComment }) => {
  const [comment, setComment] = useState('')
  if (!blogs) {
    return null
  }
  const id = useParams().id
  const blog = blogs.find((us) => us.id === id)
  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <br />
      {blog.likes} likes
      <Button variant="outlined" onClick={() => handleLike(blog)}>
        like
      </Button>
      <br />
      added by {blog.user.name}
      <h3>comments</h3>
      <form
        onSubmit={() => {
          handleComment({ comment, blog })
          setComment('')
        }}
      >
        <TextField
          type="text"
          name="comment"
          value={comment}
          onChange={({ target }) => setComment(target.value)}
        />
        <Button variant="contained" type="submit">
          add comment
        </Button>
      </form>
      <ul>
        {blog.comments.map((comment) => (
          <li key={comment}>{comment}</li>
        ))}
      </ul>
    </div>
  )
}

const App = () => {
  const [user, userDispatch] = useContext(UserContext)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [notification, setNotificationDispatch] =
    useContext(NotificationContext)

  const blogFormRef = useRef()
  const queryClient = useQueryClient()

  const centered = {
    display: 'grid',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
  }

  const align = {
    margin: 'auto',
    width: '50%',
  }

  const result = useQuery('blogs', blogService.getAll)

  const userResult = useQuery('users', userService.getAll)

  const blogs = result.data
  const users = userResult.data

  const newBlogMutation = useMutation(
    () => blogService.post(user.token, title, author, url, user),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('blogs')
        queryClient.invalidateQueries('users')
      },
    }
  )

  const likeBlogMutation = useMutation(
    (blog) => blogService.put(user.token, blog),
    {
      onSuccess: () => queryClient.invalidateQueries('blogs'),
    }
  )

  const commentBlogMutation = useMutation(
    (blog) => blogService.put(user.token, blog),
    {
      onSuccess: () => queryClient.invalidateQueries('blogs'),
    }
  )

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('blogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      userDispatch({ type: 'SET_USER', payload: user })
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    const response = await loginService.post(username, password)
    if (response === null) {
      setNotificationDispatch({
        type: 'SET_NOTIFICATION',
        payload: '!!! username or password invalid !!!',
      })
      setTimeout(() => {
        setNotificationDispatch({ type: 'RESET_NOTIFICATION' })
      }, 5000)
    } else {
      userDispatch({ type: 'SET_USER', payload: response })
      window.localStorage.setItem('blogAppUser', JSON.stringify(response))
    }
    setUsername('')
    setPassword('')
  }

  const handleBlogSubmit = async (event) => {
    event.preventDefault()
    newBlogMutation.mutate()

    setNotificationDispatch({
      type: 'SET_NOTIFICATION',
      payload: '!!! new blog added !!!',
    })
    setTimeout(() => {
      setNotificationDispatch({ type: 'RESET_NOTIFICATION' })
    }, 5000)

    blogFormRef.current.toggleVisibility()
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  const handleLike = async (blog) => {
    likeBlogMutation.mutate({ ...blog, likes: (blog.likes += 1) })
  }

  const handleComment = (props) => {
    event.preventDefault()
    console.log(props.comment)
    if (props.comment === '') {
      return
    }
    commentBlogMutation.mutate({
      ...props.blog,
      comments: props.blog.comments.concat(props.comment),
    })
  }

  if (result.isLoading) {
    return <div>loading blogs...</div>
  }

  if (user === null) {
    return (
      <div style={centered}>
        <h1>log in to application</h1>
        <Notification notification={notification} />
        <form onSubmit={handleLogin}>
          <div>
            <TextField
              label="Username"
              variant="filled"
              type="text"
              value={username}
              name="Username"
              id="username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            <TextField
              label="Password"
              variant="filled"
              type="text"
              value={password}
              name="Password"
              id="password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <Button variant="contained" type="submit" id="loginButton">
            login
          </Button>
        </form>
      </div>
    )
  }
  return (
    <BrowserRouter>
      <AppBar position="static">
        <Toolbar>
          <Button component={Link} color="inherit" to="/">
            blogs
          </Button>
          <Button component={Link} color="inherit" to="/users">
            users
          </Button>
          <p style={{ margin: 5 }}>logged in as {user.username}</p>
          <Button
            color="error"
            variant="contained"
            size="small"
            onClick={() => {
              window.localStorage.removeItem('blogAppUser')
            }}
          >
            logout
          </Button>
        </Toolbar>
      </AppBar>

      <div style={align}>
        <h2>blog app</h2>
        <Notification notification={notification} />

        <Routes>
          <Route
            path="/"
            element={
              <div>
                <Togglable buttonLabel="create blog" ref={blogFormRef}>
                  <BlogForm
                    handleBlogSubmit={handleBlogSubmit}
                    title={title}
                    setTitle={setTitle}
                    author={author}
                    setAuthor={setAuthor}
                    url={url}
                    setUrl={setUrl}
                  />
                </Togglable>

                {blogs
                  .sort((blog1, blog2) => blog2.likes - blog1.likes)
                  .map((blog) => (
                    <div key={blog.id}>
                      <Link key={blog.id} to={`/blogs/${blog.id}`}>
                        {blog.title} {blog.author}
                      </Link>
                    </div>
                  ))}
              </div>
            }
          />

          <Route path="/users" element={<Users users={users} />} />
          <Route path="/users/:id" element={<User users={users} />} />
          <Route
            path="/blogs/:id"
            element={
              <SingleBlog
                blogs={blogs}
                handleLike={handleLike}
                handleComment={handleComment}
              />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
