import { useState, useEffect } from "react"
import axios from 'axios'

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  const [found, setFound] = useState(false)
  const [data, setData] = useState(null)

  useEffect(() => {
    if (!(name === '')){
      axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
        .then(response => {
          setCountry(response.data)
          setFound(true)
          setData({
            name: response.data.name.common,
            capital: response.data.capital,
            population: response.data.population,
            flag: response.data.flags.png
          })
        })
        .catch( error => {
          setCountry({})
          setFound(false)
          setData({})
        })
    }
  }, [name])
  
  return{
    found,
    data,
    country
  }
}