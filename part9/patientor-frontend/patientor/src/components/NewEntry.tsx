import { ChangeEvent, useState, FormEvent } from "react";
import { Diagnosis, NewEntry as NewEntryType, Patient } from "../types";
import { Button, MenuItem, Rating, Select, TextField } from "@mui/material";
import Input from '@mui/material/Input';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

import patientService from '../services/patients'

const divStyle = {
  border: "dotted",
  margin: "5px",
  padding: "5px"
}

interface newEntryProps {
  patient: Patient;
  diagnoses: Diagnosis[];
}

const NewEntry = (props: newEntryProps) => {
  const [type, setType] = useState<string>('hospital');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [specialist, setSpecialist] = useState<string>('');
  const [codes, setCodes] = useState<string[]>([]);
  const [dischargeDate, setDischargeDate] = useState<string>('');
  const [criteria, setCriteria] = useState<string>('');
  const [employer, setEmployer] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [rating, setRating] = useState<number>(1);


  const [patient, setPatient] = useState<Patient>(props.patient);
  
  const diagnoses = props.diagnoses;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    let newEntry

    switch (type) {
      case 'hospital':
        if(codes.length !== 0) {
          newEntry = {
          date: date,
          specialist: specialist,
          description: description,
          type: 'Hospital',
          diagnosisCodes: codes,
          discharge: {
            date: dischargeDate,
            criteria: criteria
          }
          }
        } else {
          newEntry = {
            date: date,
            specialist: specialist,
            description: description,
            type: type,
            discharge: {
              date: dischargeDate,
              criteria: criteria
            }
          }
        }
        break;
      case 'occupational':
        if(codes.length !== 0 && startDate !== '' && endDate !== '') {
          newEntry = {
            date: date,
            specialist: specialist,
            description: description,
            type: 'OccupationalHealthcare',
            diagnosisCodes: codes,
            employerName: employer,
            SickLeave: {
              startDate: startDate,
              endDate: endDate
            }
          }
        } else if (codes.length !== 0) {
          newEntry = {
            date: date,
            specialist: specialist,
            description: description,
            type: 'OccupationalHealthcare',
            diagnosisCodes: codes,
            employerName: employer
          }
        } else if (startDate !== '' && endDate !== '') {
          newEntry = {
            date: date,
            specialist: specialist,
            description: description,
            type: 'OccupationalHealthcare',
            employerName: employer,
            SickLeave: {
              startDate: startDate,
              endDate: endDate
            }
          }
        } else {
          newEntry = {
            date: date,
            specialist: specialist,
            description: description,
            type: 'OccupationalHealthcare',
            employerName: employer,
          }
        }
        break;
      case 'check':
        if(codes.length !== 0) {
          newEntry = {
            date: date,
            specialist: specialist,
            description: description,
            type: 'HealthCheck',
            diagnosisCodes: codes,
            healthCheckRating: rating
          }
        } else {
          newEntry = {
            date: date,
            specialist: specialist,
            description: description,
            type: 'HealthCheck',
            healthCheckRating: rating - 1
          }
        }
        break;
    }

    setDescription('');
    setDate('');
    setSpecialist('');
    setCodes([]);
    setDischargeDate('');
    setCriteria('');
    setEmployer('');
    setStartDate('');
    setEndDate('');
    setRating(1);

    if (newEntry){
      const entry = newEntry as NewEntryType
      const newPerson = await patientService.addEntry(patient.id, entry)
      setPatient(newPerson)
    } else {
      return;
    }
    
    

  }

  return (
    <div style={divStyle}>
      <form onSubmit={handleSubmit}>
        <label>
          Entry type:
          Hospital
          <input type="radio" name="type" onClick={() => setType('hospital')} defaultChecked/>
          Occupational Healthcare
          <input type="radio" name="type" onClick={() => setType('occupational')} />
          Health Check
          <input type="radio" name="type" onClick={() => setType('check')} />
        </label>
        <br />
        <TextField value={description} onChange={(event) => setDescription(event.target.value)} variant="outlined" label="Description"/>
        <br />
        Date:<Input value={date} onChange={(event) => setDate(event.target.value)} type="date" />
        <br />
        <TextField value={specialist} onChange={event => setSpecialist(event.target.value)} variant="outlined" label="Specialist"/>
        <br />
        Diagnosis codes:
        <Select multiple value={codes} onChange={(event) => setCodes(typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value,)}>
          {diagnoses.map(diagnose => (
            <MenuItem key={diagnose.code} value={diagnose.code}>
              {diagnose.code}
            </MenuItem>
          ))}
        </Select>


        {type === 'hospital' &&
        <div>
          Discharge:
          <br />
          Date: <Input value={dischargeDate} onChange={(event) => setDischargeDate(event.target.value)} type="date" />
          <br />
          Criteria: <TextField value={criteria} onChange={(event) => setCriteria(event.target.value)} variant="outlined"/>
        </div>
        }
        {type === 'occupational' &&
        <div>
          Employer: <TextField value={employer} onChange={(event) => setEmployer(event.target.value)} variant="outlined"/>
          <br />
          Sick Leave:
          <br />
          start: <Input value={startDate} onChange={(event) => setStartDate(event.target.value)} type="date" />
          <br />
          end: <Input value={endDate} onChange={(event) => setEndDate(event.target.value)} type="date" />
        </div>
        }
        {type === 'check' &&
        <div>
          <Rating icon={<FavoriteIcon />} 
          emptyIcon={<FavoriteBorderOutlinedIcon />} 
          max={4} 
          value={rating} 
          onChange={(event) => {
            const events = event as ChangeEvent<HTMLInputElement>
            setRating(Number(events.target.value))}}
          />
        </div>
        }
        <Button variant="contained" type="submit">Add entry</Button>
      </form>
    </div>
  )
}

export default NewEntry;