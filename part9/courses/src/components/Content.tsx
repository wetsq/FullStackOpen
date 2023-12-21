import { courseProps } from "../../types";
import Part from "./Part";

const Content = (props: courseProps) => {
  return (
    <div>
      {props.courseParts.map(course => <Part key={course.name} course={course} />)}
    </div>
  )
}

export default Content;