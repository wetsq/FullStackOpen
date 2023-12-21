
interface ExerciseResponse {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface errorResponse {
  error: string;
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
const calculateExercises = (data: any): ExerciseResponse | errorResponse => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = data;
  try {
    if (daily_exercises === undefined || target === undefined) {
      throw new Error ('parameters missing');
    }
    if (isNaN(Number(target))) {
      throw new Error ('malformatted parameters');
    }
    // eslint-disable-next-line
    daily_exercises.map((a: number) => {
      if (isNaN(Number(a))) {
        throw new Error ('malformatted parameters');
      }
    });
  } catch(error) {
    if (error instanceof Error) {
      return {
        error: error.message
      };
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const hours: number[] = daily_exercises;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const daily_target: number = target;

  const periodLength = hours.length;
  const trainingDays = hours.filter(a => a !== 0).length;
  const average = hours.reduce((a, b) => a + b) / periodLength;
  const success = average >= daily_target;

  let rating;
  let ratingDescription;

  if (success){
    rating = 3;
    ratingDescription = 'you achieved your target';
  } else if ( (average * 2) >= daily_target ){
    rating = 2;
    ratingDescription = 'you almost achieved your target';
  } else {
    rating = 1;
    ratingDescription = 'you could do better';
  }

  return {
    periodLength: periodLength,
    trainingDays: trainingDays,
    success: success,
    rating: rating,
    ratingDescription: ratingDescription,
    target: daily_target,
    average: average
  };
};


export default calculateExercises;