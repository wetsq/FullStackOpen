import express from 'express';
import calculateBmi from './bmiCalculator';
import calculateExercises from './exerciseCalculator';
const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  res.send(calculateBmi(req.query.height, req.query.weight));
});

app.post('/exercises', (req, res) => {
  res.send(calculateExercises(req.body));
});

const PORT = 3003;

app.listen(PORT);