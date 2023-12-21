import { Diagnose, Gender, NewEntry, newPatient, Discharge, SickLeave, HealthCheckRating } from "./types";


const parseString = (str: unknown): string => {
  if ( typeof str !== 'string' ) {
    throw new Error('incorrect data: ' + str);
  }
  return str;
};

const parseGender = (gender: unknown): Gender => {
  const str = parseString(gender);
  if ( !Object.values(Gender).map(g => g.toString()).includes(str) ) {
    throw new Error('incorrect gender: ' + str);
  }
  return gender as Gender;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnose['code']> => {
  if (!object || typeof object !== 'object' || !('diagnosisCodes' in object)) {
    return [] as Array<Diagnose['code']>;
  }

  return object.diagnosisCodes as Array<Diagnose['code']>;
};

const parseDischarge = (object: unknown): Discharge => {
  if (!object || typeof object !== 'object') {
    throw new Error('incorrect or missing data');
  }
  if ('date' in object && 'criteria' in object) {
    return object as Discharge;
  } else {
    throw new Error('incorrect discharge data');
  }
};

const parseSickLeave = (object: unknown): SickLeave => {
  if (!object || typeof object !== 'object') {
    throw new Error('incorrect or missing data');
  }
  if ('startDate' in object && 'endDate' in object) {
    return object as SickLeave;
  } else {
    throw new Error('incorrect discharge data');
  }
};

const isNumber = (number: unknown): number is number => {
  return typeof number === 'number' || number instanceof Number;
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

const parseHealthCheckRating = (object: unknown): HealthCheckRating => {
  if (!isNumber(object) || !isHealthCheckRating(object)) {
    throw new Error('incorrect discharge data');
  }
  return object;
};

export const toNewPatient = (object: unknown): newPatient => {
  if (!object || typeof object !== 'object') {
    throw new Error('incorrect or missing data');
  }

  if ('name' in object && 'dateOfBirth' in object && 'ssn' in object && 'gender' in object && 'occupation' in object) {
    const newPerson: newPatient = {
      name: parseString(object.name),
      dateOfBirth: parseString(object.dateOfBirth),
      ssn: parseString(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseString(object.occupation),
      entries: []
    };

    return newPerson;
  }
  throw new Error('Incorrect data: some fields are missing');
};

export const toNewEntry = (object: unknown): NewEntry => {
  let newEntry: NewEntry;
  if (!object || typeof object !== 'object') {
    throw new Error('incorrect or missing data');
  }

  if ('type' in object && 'date' in object && 'specialist' in object && 'description' in object) {
    switch (object.type) {
      case "Hospital":
        if ('discharge' in object && 'diagnosisCodes' in object) {
          newEntry = {
            type: object.type,
            date: parseString(object.date),
            specialist: parseString(object.specialist),
            description: parseString(object.description),
            diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
            discharge: parseDischarge(object.discharge)
          };
        } else if ('discharge' in object) {
          newEntry = {
            type: object.type,
            date: parseString(object.date),
            specialist: parseString(object.specialist),
            description: parseString(object.description),
            discharge: parseDischarge(object.discharge)
          };
        } else {
          throw new Error('incorrect or missing data');
        }
        break;
      case "OccupationalHealthcare":
        if ('employerName' in object && 'diagnosisCodes' in object && 'sickLeave' in object) {
          newEntry = {
            type: object.type,
            date: parseString(object.date),
            specialist: parseString(object.specialist),
            description: parseString(object.description),
            diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
            employerName: parseString(object.employerName),
            sickLeave: parseSickLeave(object.sickLeave)
          };
        } else if ('employerName' in object && 'diagnosisCodes' in object) {
          newEntry = {
            type: object.type,
            date: parseString(object.date),
            specialist: parseString(object.specialist),
            description: parseString(object.description),
            diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
            employerName: parseString(object.employerName),
          };
        } else if ('employerName' in object && 'sickLeave' in object) {
          newEntry = {
            type: object.type,
            date: parseString(object.date),
            specialist: parseString(object.specialist),
            description: parseString(object.description),
            employerName: parseString(object.employerName),
            sickLeave: parseSickLeave(object.sickLeave)
          };
        } else if ('employerName' in object) {
          newEntry = {
            type: object.type,
            date: parseString(object.date),
            specialist: parseString(object.specialist),
            description: parseString(object.description),
            employerName: parseString(object.employerName),
          };
        } else {
          throw new Error('incorrect or missing data');
        }
        break;
      case "HealthCheck":
        if ('healthCheckRating' in object && 'diagnosisCodes' in object) {
          newEntry = {
            type: object.type,
            date: parseString(object.date),
            specialist: parseString(object.specialist),
            description: parseString(object.description),
            diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
            healthCheckRating: parseHealthCheckRating(object.healthCheckRating)
          };
        } else if ('healthCheckRating' in object) {
          newEntry = {
            type: object.type,
            date: parseString(object.date),
            specialist: parseString(object.specialist),
            description: parseString(object.description),
            healthCheckRating: parseHealthCheckRating(object.healthCheckRating)
          };
        } else {
          throw new Error('incorrect or missing data');
        }
        break;
      default:
        throw new Error('incorrect or missing data');
    }
    return newEntry;
  } else {
    throw new Error('incorrect or missing data');
  }

};

