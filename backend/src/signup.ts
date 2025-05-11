// signup.ts
import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/signup', async (req: Request, res: Response):Promise<any> => {
  const { name, username, password } = req.body;

  try {
    const existing = await prisma.user.findMany({ where: { username } });
    if (existing.length > 0) {
      return res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        name,
        username,
        password: hashed,
      },
    });

    res.status(200).json({ message: '회원가입 성공' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

export default router;