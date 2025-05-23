"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('세션 삭제 실패:', err);
            return res.status(500).json({ message: '로그아웃 실패' });
        }
        res.clearCookie('connect.sid'); // 세션 쿠키 삭제
        res.status(200).json({ message: '로그아웃 성공' });
    });
});
exports.default = router;
