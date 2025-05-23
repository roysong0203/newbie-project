"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const signup_1 = __importDefault(require("./signup"));
const login_1 = __importDefault(require("./login"));
const logout_1 = __importDefault(require("./logout"));
const tf_1 = __importDefault(require("./tf"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'https://dori.newbie.sparcs.me', // 프론트엔드 주소
    credentials: true, // 쿠키를 주고받기 위해 필수
}));
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 2 // 2시간
    }
}));
app.use('/api', signup_1.default);
app.use('/api', login_1.default);
app.use('/api', logout_1.default);
app.use('/api', tf_1.default);
app.listen(8000, () => {
    console.log('Server running at https://dori.api.newbie.sparcs.me');
});
