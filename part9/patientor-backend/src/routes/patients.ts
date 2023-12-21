import express from "express";
import patientService from "../services/patientService";
import { toNewEntry, toNewPatient } from "../utils";

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getPatientsWithoutSSN());
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);

    res.json(patientService.addPatient(newPatient));
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
  }
});

router.get('/:id', (req, res) => {
  const patient = patientService.findById(req.params.id);
  if (patient) {
    res.send(patient);
  } else {
    res.status(404);
  }

});

router.post('/:id/entries', (req, res) => {
  const patient = patientService.findById(req.params.id);
  
  if (!patient) {
    res.status(404);
    return;
  }

  try {
    const newEntry = toNewEntry(req.body);
    res.json(patientService.addEntry(newEntry, patient));
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(400).send(error.message);
    }
  }

});

export default router;