import { useState, useEffect } from "react";
import axios from 'axios'

const Languages = ({country}) => {
  return(
    <div>
      <h3>
        Languages:
      </h3>
      <ul>
        {Object.keys(country.languages).map((language) => 
          <li key={language}>{country.languages[language]}</li>)}
      </ul>
      <img src={country.flags["png"]} alt={`${country.name.common} flag`} width="200" />
    </div>
  )
}

const Weather = ({country}) => {
  const api_key = process.env.REACT_APP_API_KEY
  const [temp, setTemp] = useState('')
  const [iconurl, setIconurl] = useState('')
  const [wind, setWind] = useState('')

  useEffect(() => {
    axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${country.capitalInfo.latlng[0]}&lon=${country.capitalInfo.latlng[1]}&exclude=minutely,hourly,daily,alerts&units=metric&appid=${api_key}`)
    .then(response => {
      setTemp(response.data.main.temp)
      setIconurl(response.data.weather[0].icon)
      setWind(response.data.wind.speed)
      console.log(response)
    })
  }, [])

  if (iconurl === ''){
    return(
      <h2>
        Weather in {country.capital}
      </h2>
    )
  } else {
    return(
      <div>
        <h2>
          Weather in {country.capital}
        </h2>
        temperature {temp} Celcius
        <br/>
        <img src={`http://openweathermap.org/img/wn/${iconurl}@2x.png`} />
        <br/>
        wind {wind} m/s
      </div>
    )
  }
}

const Country = ({country}) => {
  return(
    <div>
      <h1>
        {country.name.common}
      </h1>
      capital {country.capital} <br/>
      area {country.area}
      <Languages country={country} />
      <Weather country={country} />
    </div>
  )
}

const ResultCountry = (props) => {
  return(
    <div>
      {props.country.name.common}
      <button onClick={() => props.setSearch(props.country.name.common)}>show</button>
    </div>
  )
}

const Result = ({countries, setSearch}) => {
  
  if (countries.length === 1){
    return(
      <div>
        <Country country={countries[0]} />
      </div>
    )
  } else if(countries.length <= 10){
    return(
      <div>
        {countries.map((country) => 
          <ResultCountry key={country.name.common} country={country} setSearch={setSearch} />)}
      </div>
    )
  } else {
    return(
      <div>
        Too many matches, specify another filter
      </div>
    )
  }
}

function App() {

  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])


  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all')
    .then(response => {
      setCountries(response.data)
    })
  }, [])


  const filteredCountries = (search === "")
    ? countries
    : countries.filter((country) => country.name.common.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      find countries <input value={search} onChange={handleSearchChange} />
      <Result countries={filteredCountries} setSearch={setSearch} />
    </div>
  );
}

export default App;
