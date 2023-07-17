import { gql, useQuery } from "@apollo/client"
import { useState } from "react"

const ALL_BOOKS = gql`
  query allBooks($genre: String) {
    allBooks(genre: $genre) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`


const Books = (props) => {
  const [genre, setGenre] = useState(undefined)
  const response = useQuery(ALL_BOOKS, { variables: { genre } })

  if (!props.show) {
    return null
  }

  if (response.loading) {
    return <div>loading books...</div>
  }
  const books = response.data.allBooks
  let genres = []
  books.map(b => b.genres.map(g => {
    if(!genres.find(a => a === g)){
      genres.push(g)
    }
    return null
  }))

  return (
    <div>
      <h2>books</h2>
      {genre === undefined ? null : <div>in genre <strong>{genre}</strong></div>}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {genres.map(g => (<button key={g} onClick={() => setGenre(g)}>{g}</button>))}
        <button onClick={() => setGenre(undefined)}>all genres</button>
      </div>
    </div>
  )
}

export default Books
