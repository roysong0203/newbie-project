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
  origin: 'https://dori.newbie.sparcs.me',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());

app.set('trust proxy', 1);

app.use(session({
  secret: process.env.SESSION_SECRET as string,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true, // HTTPS 환경이므로 true
    sameSite: 'none', // 크로스 도메인 쿠키 허용
    maxAge: 1000 * 60 * 60 * 2
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
