import axios from 'axios'
const baseUrl = '/api/login'

const post = async (username, password) => {
  const user = await axios({
    method: 'post',
    url: baseUrl,
    data: {
      username: username,
      password: password,
    },
  }).catch(() => {
    return null
  })
  if (user === null) {
    return null
  } else {
    return user.data
  }
}

export default { post }
