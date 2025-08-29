import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/login', async (req: Request, res: Response):Promise<any> => {
  const { id, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(401).json({ message: '아이디 혹은 패스워드가 일치하지 않습니다.' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: '아이디 혹은 패스워드가 일치하지 않습니다.' });
    }

    req.session.user = { id: user.id, username: user.username };
    req.session.save(err => {
      if (err) {
        console.error('Session save error:', err);
        return res.status(500).json({ message: '세션 저장 실패' });
      }
      res.status(200).json({ message: '로그인 성공', user: req.session.user });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

router.get('/me', (req: Request, res: Response) => {
  console.log(req.session);
  if (req.session.user) {
    res.json({ user: req.session.user });
  } else {
    res.status(401).json({ message: '로그인되어 있지 않습니다.' });
  }
});

export default router;
