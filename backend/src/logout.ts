import express from 'express';

const router = express.Router();

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

export default router;