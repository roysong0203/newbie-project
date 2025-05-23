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
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, password } = req.body;
    try {
        const user = yield prisma.user.findUnique({ where: { id } });
        if (!user) {
            return res.status(401).json({ message: '아이디 혹은 비밀번호가 일치하지 않습니다.' });
        }
        const match = yield bcrypt_1.default.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: '아이디 혹은 비밀번호가 일치하지 않습니다.' });
        }
        req.session.user = { id: user.id, username: user.username };
        res.status(200).json({ message: '로그인 성공', user: req.session.user });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: '서버 오류' });
    }
}));
router.get('/me', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    }
    else {
        res.status(401).json({ message: '로그인되어 있지 않습니다.' });
    }
});
exports.default = router;
