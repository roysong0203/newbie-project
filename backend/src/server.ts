// server.ts
import express from 'express';
import cors from 'cors';
import signupRouter from './signup'; // 위 코드가 signup.ts라면

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', signupRouter);

app.listen(4000, () => {
  console.log('Server running at http://localhost:4000');
});