import { useState } from "react";
import { DiaryFormProps, newDiaryType } from "../types";
import { createDiary } from "../diaryService";
import axios from 'axios';

const DiaryForm = (props: DiaryFormProps) => {

  const [date, setDate] = useState<string>('')
  const [visibility, setVisibility] = useState<string>('ok')
  const [weather, setWeather] = useState<string>('sunny')
  const [comment, setComment] = useState<string>('')

  const [notification, setNotification] = useState<string | null>(null)

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setNotification(null)
    const diary = {
      date,
      visibility,
      weather,
      comment
    }
    const newDiary = diary as newDiaryType;
    try {
      const data = await createDiary(newDiary)
      props.setDiaries(props.diaries.concat(data))
      setDate('')
      setVisibility('')
      setWeather('')
      setComment('')
    
    } catch (e) {
      if (axios.isAxiosError(e)) {
        console.log(e.response?.data)
        setNotification(e.response?.data)
      }
    }
  }

  return (
    <div>
      <h2>Add new entry</h2>
      {notification && <p style={{color: "red"}} >{notification}</p>}
      <form>
        <label>
        date:
        <input type="date" name="date" value={date} onChange={(event) => setDate(event.target.value)}/>
        </label>
        <br />
        <label>
        visibility:
        Great
        <input type="radio" name="visibility" onClick={() => setVisibility('great')} defaultChecked/>
        Good
        <input type="radio" name="visibility" onClick={() => setVisibility('good')}/>
        Ok
        <input type="radio" name="visibility" onClick={() => setVisibility('ok')} />
        Poor
        <input type="radio" name="visibility" onClick={() => setVisibility('poor')}/>
        </label>
        <br />
        <label>
        weather:
        Sunny
        <input type="radio" name="weather" onClick={() => setWeather('sunny')} defaultChecked/>
        Rainy
        <input type="radio" name="weather" onClick={() => setWeather('rainy')} />
        Cloudy
        <input type="radio" name="weather" onClick={() => setWeather('cloudy')} />
        Stormy
        <input type="radio" name="weather" onClick={() => setWeather('stormy')} />
        Windy
        <input type="radio" name="weather" onClick={() => setWeather('windy')} />
        </label>
        <br />
        <label>
        comment:
        <input type="text" name="comment" value={comment} onChange={(event) => setComment(event.target.value)}/>
        </label>
        <br />
        <button type="submit" onClick={handleSubmit}>add</button>
      </form>
    </div>
  )
}

export default DiaryForm