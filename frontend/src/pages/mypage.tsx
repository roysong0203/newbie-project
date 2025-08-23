import React, { useState, useEffect } from 'react';
import { useUser } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import '../styles/App.css';
import '../styles/home.css';
import Header from './header';
import Card from './tfCard';

const MyPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [leaderTfList, setLeaderTfList] = useState<any[]>([]);
  const [followerTfList, setFollowerTfList] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/mytfs`, {
      credentials: 'include',
    })
    .then(res => {
        if (!res.ok) {
            if (res.status === 401) {
                navigate('/login');
            }
            throw new Error('TF 목록을 불러오는 데 실패했습니다.');
        }
        return res.json();
    })
    .then(data => {
      setLeaderTfList(data.leaderTFs);
      setFollowerTfList(data.followerTFs);
    })
    .catch(err => console.error('TF 목록 불러오기 실패:', err));
  }, []);

  return (
    <div className="page-wrapper">
      <Header />
      <div className="main container" style={{ width: '87.5%' }}>
        <h2 className="section-title">{user?.username} 님이 속한 TF</h2>
        <div className="card-grid">
          {leaderTfList.map((tf) => (
            <Card
              id={tf.id}
              key={tf.id}
              name={tf.name}
              description={tf.description}
              head={tf.User?.name ?? "알 수 없음"}
              members={tf._count?.TFMember ?? 0}
              createdAt={new Date(tf.createdAt).toISOString().split('T')[0]}
            />
          ))}
          {followerTfList.map((tf) => (
            <Card
              id={tf.id}
              key={tf.id}
              name={tf.name}
              description={tf.description}
              head={tf.User?.name ?? "알 수 없음"}
              members={tf._count?.TFMember ?? 0}
              createdAt={new Date(tf.createdAt).toISOString().split('T')[0]}
            />
          ))}
          <div className="card create">
            <button className="create-btn" onClick={() => navigate('/createTF')}>+ 새로운 TF 만들기</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
