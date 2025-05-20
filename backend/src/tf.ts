import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// TF 생성 API
router.post('/create', async (req: Request, res: Response):Promise<any> => {
  // console.log('req.body', req.body);

  const { name, description, leader, members } = req.body;

  if (!name || !leader) {
    return res.status(400).json({ message: '이름과 팀장 닉네임은 필수입니다.' });
  }

  try {
    // 팀장 정보 가져오기
    const leaderUser = await prisma.user.findUnique({
      where: { username: leader },
    });

    // console.log('leaderUser', leaderUser);

    if (!leaderUser) {
      return res.status(404).json({ message: '팀장 정보를 찾을 수 없습니다.' });
    }

    // 팀원 정보 가져오기
    const memberUsers = await prisma.user.findMany({
      where: {
        username: {
          in: members,
        },
      },
    });

    // console.log('memberUsers', memberUsers);

    const newTF = await prisma.tF.create({
      data: {
        name,
        description,
        leaderId: leaderUser?.id,
        TFMember: {
          create: memberUsers?.map((user) => ({ userId: user.id })) || [],
        },
      },
    });

    res.status(201).json({ message: 'TF 생성 완료', tf: newTF });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류 발생' });
  }
});

// TF 전체 조회 API (옵션)
router.get('/tfs', async (_req: Request, res: Response) => {
  // console.log('TF 전체 조회 API 호출');

  try {
    const tfList = await prisma.tF.findMany({
      include: {
        User: true,
        _count: {
          select: { TFMember: true },
        },
      },
    });
    res.json(tfList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류' });
  }
});

// TF 상세 조회 API (옵션)
router.get('/tf/:id', async (req: Request, res: Response):Promise<any> => {
  const { id } = req.params;

  try {
    // TF의 팀장 닉네임, 팀원 닉네임, 생성 날짜, TF 이름, TF 설명 조회(다른 정보는 포함하면 안 됨)
    const tfWithDetails = await prisma.tF.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        User: {
          select: {
            username: true,
            name: true,
          },
        },
        TFMember: {
          select: {
            User: {
              select: {
              username: true,
              name: true,
              },
            },
          },
        },
      },
    });

    if (!tfWithDetails) {
      return res.status(404).json({ message: 'TF를 찾을 수 없습니다.' });
    }

    res.json(tfWithDetails);
  } catch (error) {
    console.error(error);
    console.log(id)
    res.status(500).json({ message: '서버 오류' });
  }
});

// 내가 속한 TF 목록 조회 API
router.get('/mytfs', async (req: Request, res: Response):Promise<any> => {
  const user = req.session.user;

  if (!user) {
    return res.status(401).json({ message: '로그인 필요' });
  }

  // console.log('user', user);

  try {
    const leaderTFs = await prisma.tF.findMany({
      where: {
        leaderId: user.id,
      },
      include: {
        User: true,
        _count: {
          select: { TFMember: true },
        },
      },
    });

    const followerTFs = await prisma.tF.findMany({
      where: {
        TFMember: {
          some: {
            userId: user.id,
          },
        },
      },
      include: {
        User: true,
        _count: {
          select: { TFMember: true },
        },
      },
    });

    res.json({
      leaderTFs,
      followerTFs,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 오류' });
  }
});

export default router;