import React from "react";

export enum Weather {
  Sunny = 'sunny',
  Rainy = 'rainy',
  Cloudy = 'cloudy',
  Stormy = 'stormy',
  Windy = 'windy',
}

export enum Visibility {
  Great = 'great',
  Good = 'good',
  Ok = 'ok',
  Poor = 'poor',
}

export interface Diary {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
}

export interface newDiaryType {
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment: string;
}

export interface DiariesProps {
  diaries: Diary[];
}

export interface DiaryFormProps {
  setDiaries: React.Dispatch<React.SetStateAction<Diary[]>>;
  diaries: Diary[];
}