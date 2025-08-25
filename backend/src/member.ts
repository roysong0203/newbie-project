import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

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

// 특정 회원 조회 API
router.get('/members/:id', async (req: Request, res: Response):Promise<any> => {
    const userId = req.params.id;
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, username: true, name: true },
        });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: '회원이 존재하지 않습니다.' });
        }
    } catch (error) {
        console.error('회원 조회 실패:', error);
        res.status(500).json({ message: '서버 오류로 인해 회원 정보를 불러올 수 없습니다.' });
    }
});

// 회원 정보 수정 API
router.put('/members/:id', async (req: Request, res: Response):Promise<any> => {
    const userId = req.params.id;
    const { name, username, currentPassword, newPassword } = req.body;
    try {
        // 현재 패스워드 확인
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const matched = await bcrypt.compare(currentPassword, user?.password || '');
        if (!user || !matched) {
            return res.status(401).json({ message: '현재 패스워드가 일치하지 않습니다.' });
        }

        const updateData: any = {};
        console.log({ name, username, newPassword });
        if (name) updateData.name = name;
        if (username) updateData.username = username;
        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updateData.password = hashedPassword;
        }
        console.log(updateData);

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: { id: true, username: true, name: true },
        });
        res.json(updatedUser);
    } catch (error) {
        console.error('회원 정보 수정 실패:', error);
        res.status(500).json({ message: '서버 오류로 인해 회원 정보를 수정할 수 없습니다.' });
    }
});

export default router;