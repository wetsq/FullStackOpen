import { useParams } from "react-router-dom"
import patientService from "../services/patients";
import { useState } from "react";
import { Diagnosis, Entry, Gender, Patient } from "../types";

import MaleIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';
import FemaleIcon from '@mui/icons-material/Female';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import DomainAddIcon from '@mui/icons-material/DomainAdd';
import NewEntry from "./NewEntry";

interface Props {
  gender: Gender;
}

const GenderIcon = (props: Props) => {
  if(props.gender === 'male') {
    return <MaleIcon />
  } else if(props.gender === 'female') {
    return <FemaleIcon />
  } else {
    return <TransgenderIcon />
  }
}

interface EntryProps {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const divStyle = {
  border: "solid",
  margin: "5px",
  padding: "5px"

}

const EntryElement = (props: EntryProps) => {
  const entry = props.entry;
  switch (entry.type) {
    case "HealthCheck":
      let icon
      switch (entry.healthCheckRating) {
        case 0:
          icon = <FavoriteIcon sx={{ color: "green"}}/>;
          break
        case 1:
          icon = <FavoriteIcon sx={{ color: "LightGreen"}}/>;
          break
        case 2:
          icon = <FavoriteIcon sx={{ color: "yellow"}}/>;
          break
        case 3:
          icon = <FavoriteIcon sx={{ color: "red"}}/>;
          break
      }
      return (
        <div style={divStyle}>
          {entry.date} <LocalHospitalIcon />
          <br />
          {entry.description}
          <br />
          {icon}
          <br />
          {entry.diagnosisCodes && 
          <div>
            Diagnoses:
          <ul>
            {entry.diagnosisCodes.map(code => <li key={code}>{code} {props.diagnoses.find(diagnosis => diagnosis.code === code)?.name}</li>)}
          </ul>
          </div>
          }
          diagnose by {entry.specialist}
        </div>
      )
    case "Hospital":
      return (
        <div style={divStyle}>
          {entry.date} <DomainAddIcon />
          <br />
          {entry.description}
          <br />
          {entry.diagnosisCodes && 
          <div>
            Diagnoses:
          <ul>
            {entry.diagnosisCodes.map(code => <li key={code}>{code} {props.diagnoses.find(diagnosis => diagnosis.code === code)?.name}</li>)}
          </ul>
          </div>
          }
          diagnose by {entry.specialist}
        </div>
      )
    case "OccupationalHealthcare":
      return(
        <div style={divStyle}>
          {entry.date} <BusinessCenterIcon /> {entry.employerName}
          <br />
          {entry.description}
          <br />
          {entry.diagnosisCodes && 
          <div>
            Diagnoses:
          <ul>
            {entry.diagnosisCodes.map(code => <li key={code}>{code} {props.diagnoses.find(diagnosis => diagnosis.code === code)?.name}</li>)}
          </ul>
          </div>
          }
          diagnose by {entry.specialist}
        </div>
      )
    default:
      return entry
  }
}

interface PatientProps {
  diagnoses: Diagnosis[] | null;
}

const SinglePatient = (props: PatientProps) => {
  const [patient, setPatient] = useState<Patient | null>(null)

  const {id} = useParams();
  if (!id) {
    return(
      <p>Patient not found</p>
    )
  }
  const fetchPatient = async () => {
    const SinglePatient = await patientService.getById(id);
    setPatient(SinglePatient);
  }
  fetchPatient();

  if (patient && props.diagnoses !== null) {
    const diagnoses = props.diagnoses as Diagnosis[];
    return(
    <div>
      <h1>{patient.name}</h1>
      <GenderIcon gender={patient.gender} />
      <br />
      ssn: {patient.ssn}
      <br />
      occupation: {patient.occupation}
      <NewEntry patient={patient} diagnoses={props.diagnoses}/>
      <h2>Entries</h2>
      {patient.entries.map(entry => <EntryElement key={entry.id} entry={entry} diagnoses={diagnoses}/>)}
    </div>
    )
  } else {
    return(null)
  }
  
}

export default SinglePatient