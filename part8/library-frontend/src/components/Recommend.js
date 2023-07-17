import { gql, useQuery } from "@apollo/client"

const ME = gql`
  query{
    me{
      favoriteGenre
    }
  }
`
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

const Recommend = (props) => {
  const me = useQuery(ME)
  const allBooks = useQuery(ALL_BOOKS)
  if (!props.show) {
    return null
  }

  if (me.loading || allBooks.loading) {
    return <div>data loading...</div>
  }

  const favoriteGenre = me.data.me.favoriteGenre
  const books = allBooks.data.allBooks.filter(b => b.genres.find(a => a === favoriteGenre))

  return(
    <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <strong>{favoriteGenre}</strong></p>
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
    </div>
  )
}

export default Recommend