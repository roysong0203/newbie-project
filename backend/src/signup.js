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
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, id, username, password } = req.body;
    try {
        const existing = yield prisma.user.findUnique({ where: { id } });
        if (existing) {
            return res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
        }
        // 아이디, 비밀번호, 이름, 닉네임 유효성 검사
        if (!id || !password || !name || !username) {
            return res.status(400).json({ message: '모든 필드를 입력해주세요.' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: '비밀번호는 최소 6자 이상이어야 합니다.' });
        }
        if (id.length > 20) {
            return res.status(400).json({ message: '아이디는 최대 20자까지 가능합니다.' });
        }
        if (/\s/.test(id)) {
            return res.status(400).json({ message: '아이디에 공백을 포함할 수 없습니다.' });
        }
        if (/\s/.test(password)) {
            return res.status(400).json({ message: '비밀번호에 공백을 포함할 수 없습니다.' });
        }
        if (/\s/.test(username)) {
            return res.status(400).json({ message: '닉네임에 공백을 포함할 수 없습니다.' });
        }
        if (id.length > 20 || password.length > 20 || name.length > 20 || username.length > 20) {
            return res.status(400).json({ message: '최대 20자까지 가능합니다.' });
        }
        const hashed = yield bcrypt_1.default.hash(password, 10);
        yield prisma.user.create({
            data: {
                id,
                name,
                username,
                password: hashed,
            },
        });
        res.status(201).json({ message: '회원가입 성공' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: '서버 오류' });
    }
}));
exports.default = router;
