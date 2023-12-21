import { DiariesProps } from "../types";

const Diaries = (props: DiariesProps) => {
  return(
    <div>
      {props.diaries.map(diary => {
        return(
          <div key={diary.id}>
            <h2>{diary.date}</h2>
            <p>visibility: {diary.visibility}</p>
            <p>weather: {diary.weather}</p>
          </div>
        )
      })}
    </div>
  )
}

export default Diaries;