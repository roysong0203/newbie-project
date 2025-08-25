import { useEffect, useState } from 'react';
import '../styles/App.css';
import '../styles/login.css';
import Header from './header';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const EditProfile = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/me`, { credentials: 'include' })
      .then(res => {
        if (!res.ok) throw new Error('사용자 정보를 불러오는 데 실패했습니다.');
        return res.json();
      })
      .then(data => {
        setId(data.user.id);
        setUsername(data.user.username);
        fetch(`${API_BASE_URL}/api/members/${data.user.id}`, { credentials: 'include' })
          .then(res => {
            if (!res.ok) throw new Error('사용자 정보를 불러오는 데 실패했습니다.');
            return res.json();
          })
          .then(userData => {
            setName(userData.name);
          })
          .catch(err => {
            console.error('사용자 정보 불러오기 실패:', err);
            setError('사용자 정보를 불러오는 데 실패했습니다. 다시 로그인해주세요.');
            navigate('/login');
          });
      })
      .catch(err => {
        console.error('사용자 정보 불러오기 실패:', err);
        setError('사용자 정보를 불러오는 데 실패했습니다. 다시 로그인해주세요.');
        navigate('/login');
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== passwordCheck) {
      setError('패스워드가 일치하지 않습니다.');
      return;
    }

    // console.log({ name, id, username, currentPassword, newPassword });
    // return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/members/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, id, username, currentPassword, newPassword}),
      });

      if (res.ok) {
        setSuccess('회원 정보가 수정되었습니다.');
        setError('');
        setTimeout(() => {
          navigate('/');
        }, 500);
      } else {
        const data = await res.json();
        setError(data.message || '회원 정보 수정 실패');
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
        <h1>회원정보 수정</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='name'>이름</label>
            <input id='name' type="text" placeholder="이름" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <label htmlFor='username'>닉네임</label>
            <input id='username' type="text" placeholder="닉네임" value={username} onChange={e => setUsername(e.target.value)} />
          </div>
          <div>
            <label htmlFor='currentPassword'>현재 패스워드 <span style={{color: 'red'}}>*</span> </label>
            <input id='currentPassword' type="password" placeholder="현재 패스워드" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
          </div>
          <div>
            <label htmlFor='newPassword'>새 패스워드</label>
            <input id='newPassword' type="password" placeholder="새 패스워드" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          </div>
          <div>
            <label htmlFor='passwordCheck'>패스워드 재확인</label>
            <input id='passwordCheck' type="password" placeholder="패스워드 재확인" value={passwordCheck} onChange={e => setPasswordCheck(e.target.value)} />
          </div>
          <button type="submit">수정 완료</button>
        </form>
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: '1rem' }}>{success}</p>}
      </div>
    </div>
  );
};

export default EditProfile;
