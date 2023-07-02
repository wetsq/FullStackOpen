import { useState } from 'react'

const Blog = (props) => {
  const [visibility, setVisibility] = useState(false)

  if (visibility) {
    if (props.user.username === props.blog.user.username) {
      return (
        <p className="blog">
          {props.blog.title} {props.blog.author}
          <button onClick={() => setVisibility(false)}>hide</button>
          <br />
          {props.blog.url}
          <br />
          {props.blog.likes}
          <button onClick={() => props.handleLike(props.blog)}>like</button>
          <br />
          {props.blog.user.name}
          <br />
          <button onClick={() => props.handleRemove(props.blog)}>remove</button>
        </p>
      )
    }
    return (
      <p>
        {props.blog.title} {props.blog.author}
        <button onClick={() => setVisibility(false)}>hide</button>
        <br />
        {props.blog.url}
        <br />
        {props.blog.likes}
        <button onClick={() => props.handleLike(props.blog)}>like</button>
        <br />
        {props.blog.user.name}
      </p>
    )
  }
  return (
    <div>
      {props.blog.title} {props.blog.author}
      <button onClick={() => setVisibility(true)}>view</button>
    </div>
  )
}

export default Blog
