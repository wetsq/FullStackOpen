import { PartProps } from "../../types";

const Part = (props: PartProps) => {
  const course = props.course;
  switch (course.kind) {
    case 'basic':
      return(
        <div>
          <strong>{course.name} {course.exerciseCount}</strong>
          <ul>
            <li><i>{course.description}</i></li>
          </ul>
        </div>
      );
    case 'group':
      return(
        <div>
          <strong>{course.name} {course.exerciseCount}</strong>
          <ul>
            <li>project count: {course.groupProjectCount}</li>
          </ul>
        </div>
      )
    case 'background':
      return(
        <div>
          <strong>{course.name} {course.exerciseCount}</strong>
          <ul>
            <li><i>{course.description}</i></li>
            <li><a href={course.backgroundMaterial}>{course.backgroundMaterial}</a></li>
          </ul>
        </div>
      )
    case 'special':
      return(
        <div>
          <strong>{course.name} {course.exerciseCount}</strong>
          <ul>
            <li><i>{course.description}</i></li>
          </ul>
          Requirements:
          <ul>
            {course.requirements.map(r => (<li key={r}>{r}</li>))}
          </ul>
        </div>
      )
    default:
      throw new Error('kind not handled ' + course)
  }
}

export default Part