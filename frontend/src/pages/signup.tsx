import { useState } from 'react';
import '../styles/App.css';
import '../styles/login.css';
import Header from './header';
import { useNavigate } from 'react-router-dom';

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
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const res = await fetch('https://dori.api.newbie.sparcs.me/api/signup', {
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
        }, 1000);
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
          <input type="text" placeholder="이름" value={name} onChange={e => setName(e.target.value)} required />
          <input type="text" placeholder="아이디" value={id} onChange={e => setId(e.target.value)} required />
          <input type="text" placeholder="닉네임" value={username} onChange={e => setUsername(e.target.value)} required />
          <input type="password" placeholder="비밀번호" value={password} onChange={e => setPassword(e.target.value)} required />
          <input type="password" placeholder="비밀번호 재확인" value={passwordCheck} onChange={e => setPasswordCheck(e.target.value)} required />
          <button type="submit">회원가입</button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}
      </div>
    </div>
  );
};

export default SignUp;
