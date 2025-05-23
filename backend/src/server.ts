import express from 'express';
import cors from 'cors';
import session from 'express-session';
import signupRouter from './signup';
import loginRouter from './login';
import logoutRouter from './logout';
import tfRouter from './tf';

declare module 'express-session' {
  interface SessionData {
    cookie: Cookie; 
    user?: {
      id: string;
      username: string;
    } | undefined;
  }
}

const app = express();

app.use(cors({
  origin: 'https://dori.newbie.sparcs.me', // 프론트엔드 주소

  credentials: true, // 쿠키를 주고받기 위해 필수
}));

app.use(express.json());

app.use(session({
  secret: 'your_secret_key',
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

app.listen(8000, () => {
  console.log('Server running at https://dori.api.newbie.sparcs.me');
});
