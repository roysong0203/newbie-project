"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// TF 생성 API
router.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('req.body', req.body);
    const { name, description, leader, members } = req.body;
    if (!name || !leader) {
        return res.status(400).json({ message: '이름과 팀장 닉네임은 필수입니다.' });
    }
    try {
        // 팀장 정보 가져오기
        const leaderUser = yield prisma.user.findUnique({
            where: { username: leader },
        });
        // console.log('leaderUser', leaderUser);
        if (!leaderUser) {
            return res.status(404).json({ message: '팀장 정보를 찾을 수 없습니다.' });
        }
        // 팀원 정보 가져오기
        const memberUsers = yield prisma.user.findMany({
            where: {
                username: {
                    in: members,
                },
            },
        });
        // 팀원 정보가 불일치할 경우 에러 처리
        const memberUsernames = memberUsers.map((user) => user.username);
        const invalidMembers = members.filter((member) => !memberUsernames.includes(member));
        if (members > 0 && invalidMembers.length > 0) {
            console.log('memberUsernames', memberUsernames);
            console.log('invalidMembers', invalidMembers);
            return res.status(400).json({ message: `다음 팀원은 존재하지 않습니다: ${invalidMembers.join(', ')}` });
        }
        // 팀원 중 팀장 포함 여부 확인
        if (members.includes(leader)) {
            console.log('팀원 목록에 팀장이 포함되어 있습니다.');
            return res.status(400).json({ message: '팀원 목록에 팀장이 포함되어 있습니다.' });
        }
        // console.log('memberUsers', memberUsers);
        const newTF = yield prisma.tF.create({
            data: {
                name,
                description,
                leaderId: leaderUser === null || leaderUser === void 0 ? void 0 : leaderUser.id,
                TFMember: {
                    create: (memberUsers === null || memberUsers === void 0 ? void 0 : memberUsers.map((user) => ({ userId: user.id }))) || [],
                },
            },
        });
        res.status(201).json({ message: 'TF 생성 완료', tf: newTF });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류 발생' });
    }
}));
// TF 수정 API
router.put('/edit', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('req.body', req.body);
    const { id, name, description, leader, members } = req.body;
    if (!name || !leader) {
        return res.status(400).json({ message: '이름과 팀장 닉네임은 필수입니다.' });
    }
    try {
        // 팀장 정보 가져오기
        const leaderUser = yield prisma.user.findUnique({
            where: { username: leader },
        });
        // console.log('leaderUser', leaderUser);
        if (!leaderUser) {
            return res.status(404).json({ message: '팀장 정보를 찾을 수 없습니다.' });
        }
        // 팀원 정보 가져오기
        const memberUsers = yield prisma.user.findMany({
            where: {
                username: {
                    in: members,
                },
            },
        });
        // 팀원 정보가 불일치할 경우 에러 처리
        const memberUsernames = memberUsers.map((user) => user.username);
        const invalidMembers = members.filter((member) => !memberUsernames.includes(member));
        if (members > 0 && invalidMembers.length > 0) {
            console.log('memberUsernames', memberUsernames);
            console.log('invalidMembers', invalidMembers);
            return res.status(400).json({ message: `다음 팀원은 존재하지 않습니다: ${invalidMembers.join(', ')}` });
        }
        // 팀원 중 팀장 포함 여부 확인
        if (members.includes(leader)) {
            console.log('팀원 목록에 팀장이 포함되어 있습니다.');
            return res.status(400).json({ message: '팀원 목록에 팀장이 포함되어 있습니다.' });
        }
        // console.log('memberUsers', memberUsers);
        // TF 수정
        const newTF = yield prisma.tF.update({
            where: { id: Number(req.body.id) },
            data: {
                name,
                description,
                leaderId: leaderUser === null || leaderUser === void 0 ? void 0 : leaderUser.id,
                TFMember: {
                    deleteMany: {},
                    create: (memberUsers === null || memberUsers === void 0 ? void 0 : memberUsers.map((user) => ({ userId: user.id }))) || [],
                },
            },
        });
        res.status(201).json({ message: 'TF 수정 완료', tf: newTF });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류 발생' });
    }
}));
// TF 전체 조회 API
router.get('/tfs', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('TF 전체 조회 API 호출');
    try {
        const tfList = yield prisma.tF.findMany({
            include: {
                User: true,
                _count: {
                    select: { TFMember: true },
                },
            },
        });
        res.json(tfList);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
}));
// TF 상세 조회 API
router.get('/tf/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        // TF의 팀장 닉네임, 팀원 닉네임, 생성 날짜, TF 이름, TF 설명 조회(다른 정보는 포함하면 안 됨)
        const tfWithDetails = yield prisma.tF.findUnique({
            where: { id: Number(id) },
            select: {
                id: true,
                name: true,
                description: true,
                createdAt: true,
                leaderId: true,
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
        // console.log('tfWithDetails', tfWithDetails);
        if (!tfWithDetails) {
            return res.status(404).json({ message: 'TF를 찾을 수 없습니다.' });
        }
        res.json(tfWithDetails);
    }
    catch (error) {
        console.error(error);
        console.log(id);
        res.status(500).json({ message: '서버 오류' });
    }
}));
// 내가 속한 TF 목록 조회 API
router.get('/mytfs', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.session.user;
    if (!user) {
        return res.status(401).json({ message: '로그인 필요' });
    }
    // console.log('user', user);
    try {
        const leaderTFs = yield prisma.tF.findMany({
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
        const followerTFs = yield prisma.tF.findMany({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
}));
// TF 삭제 API
router.delete('/tf/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const deletedTF = yield prisma.tF.delete({
            where: { id: Number(id) },
        });
        res.json({ message: 'TF 삭제 완료', tf: deletedTF });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
}));
// TF 가입 API
router.post('/tf/:id/join', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = req.session.user;
    if (!user) {
        console.log('로그인 필요');
        return res.status(401).json({ message: '로그인 필요' });
    }
    try {
        const tf = yield prisma.tF.findUnique({
            where: { id: Number(id) },
        });
        if (!tf) {
            console.log('TF를 찾을 수 없습니다.');
            return res.status(404).json({ message: 'TF를 찾을 수 없습니다.' });
        }
        // console.log('tf', tf);
        // TF에 이미 가입되어 있는지 확인
        const existingMember = yield prisma.tFMember.findFirst({
            where: {
                tfId: tf.id,
                userId: user.id,
            },
        });
        if (existingMember || tf.leaderId === user.id) {
            console.log('이미 가입된 TF입니다.');
            return res.status(400).json({ message: '이미 가입된 TF입니다.' });
        }
        yield prisma.tFMember.create({
            data: {
                tfId: tf.id,
                userId: user.id,
            },
        });
        res.json({ message: 'TF 가입 완료' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류' });
    }
}));
exports.default = router;
