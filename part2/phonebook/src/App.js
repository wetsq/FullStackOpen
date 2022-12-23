import { useState, useEffect } from 'react'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import personService from './services/persons'
import Notification from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState({text:null, positive: true})

  useEffect(() => {
    personService.getAll()
    .then(response => {
      setPersons(response)
    })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const filteredPersons = (filter === "")
    ? persons
    : persons.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()))


  const addPerson = (event) => {
    event.preventDefault()

    const newPerson ={
      name: newName,
      number: newNumber
    }
    if (persons.find(person => person.name === newName)){
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        const removablePerson = persons.filter(person => person.name === newName)
        const changedPerson = {...removablePerson[0], number: newNumber}

        setPersons(persons.map(person => person.name === newName ? changedPerson : person))
        personService.update(removablePerson[0].id, newPerson)

        setErrorMessage({text:`Changed ${newName} number to ${newNumber}`, positive:true})
        setTimeout(() => {
          setErrorMessage({text:null, positive:true})
        }, 4000)
      }
    } else {
      personService.create(newPerson)
      .then(response => {
        setPersons(persons.concat(response))
      })
      setErrorMessage({text:`Added ${newName}`, positive:true})
        setTimeout(() => {
          setErrorMessage({text:null, positive:true})
        }, 4000)
    }
    setNewName('')
    setNewNumber('')    
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification errorMessage={errorMessage} />
      <Filter handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange}
        newNumber={newNumber} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons filteredPersons={filteredPersons} setErrorMessage={setErrorMessage} setPersons={setPersons} persons={persons} />
    </div>
  )
}


export default App