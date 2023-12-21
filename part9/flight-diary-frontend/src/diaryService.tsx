import axios from 'axios';
import { Diary, newDiaryType } from './types';

const baseUrl = 'http://localhost:3001/api/diaries'

export const getAllDiaries = () => {
  return axios
    .get<Diary[]>(baseUrl)
    .then(response => response.data)
}

export const createDiary = async (object: newDiaryType) => {
   const data = await axios
    .post<Diary>(baseUrl, object)

  return data.data
}