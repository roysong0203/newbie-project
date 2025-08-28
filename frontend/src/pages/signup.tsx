import { useState } from 'react';
import '../styles/App.css';
import '../styles/login.css';
import Header from './header';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const SignUp = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordCheck) {
      setError('패스워드가 일치하지 않습니다.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, id, username, password }),
      });

      if (res.ok) {
        setSuccess('회원가입이 완료되었습니다.');
        setError('');
        setTimeout(() => {
          navigate('/');
        }, 500);
      } else {
        const data = await res.json();
        setError(data.message || '회원가입 실패');
        setSuccess('');
      }
    } catch (err) {
      setError('서버 오류가 발생했습니다.');
      setSuccess('');
    }
  };

  return (
    <div className='page-wrapper'>
      <Header />
      <div className='login-container'>
        <h1>회원가입</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='name'>이름</label>
            <input id='name' type="text" placeholder="이름" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label htmlFor='id'>아이디</label>
            <input id='id' type="text" placeholder="아이디" value={id} onChange={e => setId(e.target.value)} required />
          </div>
          <div>
            <label htmlFor='username'>닉네임</label>
            <input id='username' type="text" placeholder="닉네임" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div>
            <label htmlFor='password'>패스워드</label>
            <input id='password' type="password" placeholder="패스워드" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div>
            <label htmlFor='password-check'>패스워드 재확인</label>
            <input id='password-check' type="password" placeholder="패스워드 재확인" value={passwordCheck} onChange={e => setPasswordCheck(e.target.value)} required />
          </div>
          
          <button type="submit">회원가입</button>
          <p>이미 계정이 있으신가요? <a href="/signup">로그인</a></p>
        </form>
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}
      </div>
    </div>
  );
};

export default SignUp;
