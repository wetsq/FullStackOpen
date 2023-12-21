import patients from '../../data/patients';
import { NewEntry, Patient, PatientWithoutSSN, newPatient } from '../types';
import { v1 as uuid } from 'uuid';

const getPatients = (): Patient[] => {
  return patients;
};

const getPatientsWithoutSSN = (): PatientWithoutSSN[] => {
  return patients.map(({id, name, dateOfBirth, gender, occupation}) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addPatient = (newPatient: newPatient): Patient => {
  const id = uuid();
  const patient = {
    id: id,
    ...newPatient
  };
  patients.push(patient);
  return patient;
};

const addEntry = (newEntry: NewEntry, patient: Patient): Patient => {
  const id = uuid();
  const entry = {
    id: id,
    ...newEntry
  };
  const index = patients.findIndex((p => p.id === patient.id));
  patients[index].entries.push(entry);
  return patients[index];
};

const findById = (id: string): Patient | undefined => {
  return patients.find(patient => patient.id === id);
};

export default {
  getPatients,
  getPatientsWithoutSSN,
  addPatient,
  findById,
  addEntry
};