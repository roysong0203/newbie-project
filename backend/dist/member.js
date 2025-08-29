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
const bcrypt_1 = __importDefault(require("bcrypt"));
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// 회원 목록 조회 API
router.get('/members', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany({
            select: {
                id: true,
                username: true,
                name: true,
            },
        });
        res.json(users);
    }
    catch (error) {
        console.error('회원 목록 조회 실패:', error);
        res.status(500).json({ message: '서버 오류로 인해 회원 목록을 불러올 수 없습니다.' });
    }
}));
// 특정 회원 조회 API
router.get('/members/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const user = yield prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, username: true, name: true },
        });
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ message: '회원이 존재하지 않습니다.' });
        }
    }
    catch (error) {
        console.error('회원 조회 실패:', error);
        res.status(500).json({ message: '서버 오류로 인해 회원 정보를 불러올 수 없습니다.' });
    }
}));
// 회원 정보 수정 API
router.put('/members/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const { name, username, currentPassword, newPassword } = req.body;
    try {
        // 현재 패스워드 확인
        const user = yield prisma.user.findUnique({ where: { id: userId } });
        const matched = yield bcrypt_1.default.compare(currentPassword, (user === null || user === void 0 ? void 0 : user.password) || '');
        if (!user || !matched) {
            return res.status(401).json({ message: '현재 패스워드가 일치하지 않습니다.' });
        }
        const updateData = {};
        console.log({ name, username, newPassword });
        if (name)
            updateData.name = name;
        if (username)
            updateData.username = username;
        if (newPassword) {
            const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
            updateData.password = hashedPassword;
        }
        console.log(updateData);
        const updatedUser = yield prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: { id: true, username: true, name: true },
        });
        res.json(updatedUser);
    }
    catch (error) {
        console.error('회원 정보 수정 실패:', error);
        res.status(500).json({ message: '서버 오류로 인해 회원 정보를 수정할 수 없습니다.' });
    }
}));
exports.default = router;
