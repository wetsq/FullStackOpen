import personService from '../services/persons'

const removePerson = (setPersons, person, persons, setErrorMessage) => {
  if (window.confirm(`Delete ${person.name} ?`)){
    const name = person.name
    setPersons(persons.filter(person => person.name !== name))

    personService.remove(person.id)
      .catch(error => {
        setErrorMessage({text:`Information of ${person.name} has already been removed from server`, positive:false})
        setTimeout(() => {
          setErrorMessage({text:null, positive:true})
        }, 3000)
      })

    setErrorMessage({text:`Removed ${person.name}`, positive:true})
        setTimeout(() => {
          setErrorMessage({text:null, positive:true})
        }, 3000)
  }
}

const Person = ({person, setPersons, persons, setErrorMessage}) => {
    return(
      <div>
      {person.name} {person.number} 
      <button onClick={() => removePerson(setPersons, person, persons, setErrorMessage)}>delete</button>
      </div>
    )
  }

const Persons = ({filteredPersons, setPersons, persons, setErrorMessage}) => {
    return(
        <>
        {filteredPersons.map(person => <Person key={person.name} person={person} setErrorMessage={setErrorMessage} setPersons={setPersons} persons={persons} />)}
        </>
    )
}

export default Persons