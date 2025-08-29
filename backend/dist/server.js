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
const member_1 = __importDefault(require("./member"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'https://dori.newbie.sparcs.me',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json());
app.set('trust proxy', 1);
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: true, // HTTPS 환경이므로 true
        sameSite: 'none', // 크로스 도메인 쿠키 허용
        maxAge: 1000 * 60 * 60 * 2
    }
}));
app.use('/api', signup_1.default);
app.use('/api', login_1.default);
app.use('/api', logout_1.default);
app.use('/api', tf_1.default);
app.use('/api', member_1.default);
app.listen(8000, () => {
    console.log('Server running at https://dori.api.newbie.sparcs.me');
});
