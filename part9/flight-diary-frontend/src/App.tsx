import axios from "axios";
import { useState, useEffect } from 'react'
import { Diary } from "./types";
import Diaries from "./components/diaries";
import DiaryForm from "./components/diaryForm";
import { getAllDiaries } from "./diaryService";

function App() {

  const [diaries, setDiaries] = useState<Diary[]>([]);

  useEffect(() => {
    getAllDiaries().then( data => {
      setDiaries(data)
    })
  }, [])

  return (
    <div>
      <DiaryForm setDiaries={setDiaries} diaries={diaries}/>
      <Diaries diaries={diaries} />
    </div>
  );
}

export default App;
