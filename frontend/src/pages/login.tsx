import '../styles/App.css';
import '../styles/login.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './header';

const Login = () => {
    const navigate = useNavigate();
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('https://dori.api.newbie.sparcs.me/api/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, password })
        });

        const data = await res.json();

        if (res.ok) {
            setError('');
            setSuccess(`환영합니다, ${data.user.username}님!`);
            setTimeout(() => {
                navigate('/');
                window.location.reload();
            }, 100);
        } else {
            setError(data.message);
            setSuccess('');
            navigate('/login');
        }
    };

    return (
        <div className='page-wrapper'>
            <Header />
            <div className='login-container'>
                <h1>로그인</h1>
                <form onSubmit={handleLogin}>
                    <input type="text" id="username" value={id} onChange={e => setId(e.target.value)} placeholder="아이디를 입력해주세요" />
                    <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호를 입력해주세요" />
                    <button type="submit">로그인</button>
                </form>
                <p style={{color: "green"}}> {success} </p>
                <p style={{color: "red"}}> {error} </p>
                <p>아직 계정이 없으신가요? <a href="/signup">회원가입</a></p>
            </div>
        </div>
    );
}

export default Login;
