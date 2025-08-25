import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post('/signup', async (req: Request, res: Response):Promise<any> => {
  const { name, id, username, password } = req.body;

  try {
    const existing = await prisma.user.findUnique({ where: { id } });
    if ( existing ) {
      return res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
    }

    // 아이디, 패스워드, 이름, 닉네임 유효성 검사
    if (!id || !password || !name || !username) {
      return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: '패스워드는 최소 6자 이상이어야 합니다.' });
    }
    if (id.length > 20) {
      return res.status(400).json({ message: '아이디는 최대 20자까지 가능합니다.' });
    }

    if (/\s/.test(id)) {
      return res.status(400).json({ message: '아이디에 공백을 포함할 수 없습니다.' });
    }
    if (/\s/.test(password)) {
      return res.status(400).json({ message: '패스워드에 공백을 포함할 수 없습니다.' });
    }
    if (/\s/.test(username)) {
      return res.status(400).json({ message: '닉네임에 공백을 포함할 수 없습니다.' });
    }
    
    if (id.length > 20 || password.length > 20 || name.length > 20 || username.length > 20) {
      return res.status(400).json({ message: '최대 20자까지 가능합니다.' });
    }

    const hashed = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        id, 
        name,
        username,
        password: hashed,
      },
    });

    res.status(201).json({ message: '회원가입 성공' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 오류' });
  }
});

export default router;