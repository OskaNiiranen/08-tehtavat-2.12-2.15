import { useState, useEffect } from "react";
import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import personService from "./services/persons";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [haku, setHaku] = useState("");

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons);
    });
  }, []);
  console.log("render", persons.length, "persons");

  const lisaaHenkilo = (event) => {
    event.preventDefault();

    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson && existingPerson.number !== newNumber) {
      if (
        window.confirm(
          `${newName} is already added to the phonebook, replace the old number with the new one?`
        )
      ) {
        const updatedNumber = { ...existingPerson, number: newNumber };
        personService
          .updateNumber(existingPerson.id, updatedNumber)
          .then((updatedPerson) => {
            setPersons(
              persons.map((person) =>
                person.id !== existingPerson.id ? person : updatedPerson
              )
            );
            setNewName("");
            setNewNumber("");
          })
          .catch((error) => {
            console.log("fail");
          });
      }
    } else if (!existingPerson) {
      const henkilo = { name: newName, number: newNumber };
      personService
        .addPerson(henkilo)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson));
          setNewName("");
          setNewNumber("");
        })
        .catch((error) => {
          console.log("fail");
        });
    }
  };

  const poistaHenkilo = (id) => {
    const person = persons.find((p) => p.id === id);

    if (window.confirm(`Delete ${person.name}?`)) {
      personService.deletePerson(id).then(() => {
        setPersons(persons.filter((p) => p.id !== id));
      });
    }
  };

  const handleNameChange = (event) => {
    //console.log(event.target.value);
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    //console.log(event.target.value);
    setNewNumber(event.target.value);
  };
  const handleHaeChange = (event) => {
    //console.log(event.target.value);
    setHaku(event.target.value);
  };

  const haettuPersons = persons.filter((person) =>
    person.name.toLowerCase().includes(haku.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter handleHaeChange={handleHaeChange} />
      <h3>add a new</h3>
      <PersonForm
        lisaaHenkilo={lisaaHenkilo}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        newName={newName}
        newNumber={newNumber}
      />
      <h3>Numbers</h3>
      <Persons haettuPersons={haettuPersons} poistaHenkilo={poistaHenkilo} />
    </div>
  );
};

export default App;