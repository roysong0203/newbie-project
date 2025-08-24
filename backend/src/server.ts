import express from 'express';
import cors from 'cors';
import session from 'express-session';
import signupRouter from './signup';
import loginRouter from './login';
import logoutRouter from './logout';
import tfRouter from './tf';
import memberRouter from './member';
import dotenv from 'dotenv';

declare module 'express-session' {
  interface SessionData {
    cookie: Cookie; 
    user?: {
      id: string;
      username: string;
    } | undefined;
  }
}

dotenv.config();

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'https://dori.newbie.sparcs.me'], // 프론트엔드 주소
  credentials: true, // 쿠키를 주고받기 위해 필수
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 1000 * 60 * 60 * 2 // 2시간
  }
}));

app.use('/api', signupRouter);
app.use('/api', loginRouter);
app.use('/api', logoutRouter);
app.use('/api', tfRouter);
app.use('/api', memberRouter);

app.listen(8000, () => {
  console.log('Server running at https://dori.api.newbie.sparcs.me');
});

app.listen(4000, () => {
  console.log('Server running at http://localhost:4000');
});
