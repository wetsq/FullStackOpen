import { courseProps } from "../../types"

const Total = (props: courseProps) => {
  const totalExercises = props.courseParts.reduce((accumulator, course) => accumulator + course.exerciseCount, 0)
  return(
    <div>
      Total Number of exercises: {totalExercises}
    </div>
  )
}

export default Total