interface errorResponse {
  error: string;
}

interface bmiResponse {
  weight: number;
  height: number;
  bmi: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const calculateBmi = (height: any, weight: any): errorResponse | bmiResponse => {
  let numberHeight = 0;
  let numberWeight = 0;
  try {
    if (!isNaN(Number(height)) && !isNaN(Number(weight))) {
      numberHeight = Number(height);
      numberWeight = Number(weight);
    } else {
      throw new Error('invalid arguments');
    }
  } catch(error: unknown) {
    if (error instanceof Error) {
      return {
        error: error.message
      };
    }
  }

  const bmi = numberWeight / (numberHeight*0.01 * numberHeight*0.01);
  let explanation;
  if (bmi < 18.5) {
    explanation = 'Underweight';
  } else if (bmi > 24.9) {
    explanation = 'Overweight';
  } else {
    explanation = 'Normal (healthy weight)';
  }
  
  return {
    weight: numberWeight,
    height: numberHeight,
    bmi: explanation
  };
  
};

export default calculateBmi;


