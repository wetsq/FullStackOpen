import propTypes from 'prop-types'

const BlogForm = (props) => {
  return (
    <>
      <h2>create new blog</h2>

      <form onSubmit={props.handleBlogSubmit}>
        <div>
          title:
          <input
            type="text"
            value={props.title}
            name="title"
            placeholder="title"
            id="title"
            onChange={({ target }) => props.setTitle(target.value)}
          />
        </div>
        <div>
          author:
          <input
            type="text"
            value={props.author}
            name="author"
            placeholder="author"
            id="author"
            onChange={({ target }) => props.setAuthor(target.value)}
          />
        </div>
        <div>
          url:
          <input
            type="text"
            value={props.url}
            name="url"
            placeholder="url"
            id="url"
            onChange={({ target }) => props.setUrl(target.value)}
          />
        </div>
        <button type="submit" id="submitButton">
          send
        </button>
      </form>
    </>
  )
}

BlogForm.propTypes = {
  handleBlogSubmit: propTypes.func.isRequired,
  title: propTypes.string.isRequired,
  setTitle: propTypes.func.isRequired,
  author: propTypes.string.isRequired,
  setAuthor: propTypes.func.isRequired,
  url: propTypes.string.isRequired,
  setUrl: propTypes.func.isRequired,
}

export default BlogForm
