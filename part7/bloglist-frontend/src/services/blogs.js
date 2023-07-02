import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = () => {
  const response = axios.get(baseUrl)
  return response.then((response) => {
    return response.data
  })
}

const post = async (token, title, author, url) => {
  const headerToken = `Bearer ${token}`
  const config = { headers: { Authorization: headerToken } }
  const newBlog = {
    title,
    author,
    url,
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const put = async (token, blog) => {
  const headerToken = `Bearer ${token}`
  const config = { headers: { Authorization: headerToken } }
  const url = `/api/blogs/${blog.id}`
  blog.user = blog.user._id
  const response = await axios.put(url, blog, config)
  return response.data
}

const remove = async (token, blog) => {
  const headerToken = `Bearer ${token}`
  const config = { headers: { Authorization: headerToken } }
  const url = `/api/blogs/${blog.id}`
  console.log(blog)
  await axios.delete(url, config, blog)
}

export default { getAll, post, put, remove }
