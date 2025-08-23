import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// 회원 목록 조회 API
router.get('/members', async (req: Request, res: Response):Promise<any> => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                name: true,
            },
        });
        res.json(users);
    } catch (error) {
        console.error('회원 목록 조회 실패:', error);
        res.status(500).json({ message: '서버 오류로 인해 회원 목록을 불러올 수 없습니다.' });
    }
});

export default router;