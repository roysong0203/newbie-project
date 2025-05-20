import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/App.css';
import '../styles/home.css';
import Header from './header';

const Card = ({ id, name, description, head, members, createdAt }: { id: number, name: string, description: string, head: string, members: number, createdAt: string }) => {
  const navigate = useNavigate();

  return (
    <div className="card">
      <h3>{name}</h3>
      <p>{description}</p>
      <div className="info">
        <span>👤 팀장: {head}</span>
        <span>👥 팀원: {members}명</span>
        <span>📅 생성 날짜: {createdAt}</span>
      </div>
      <button className="btn" onClick={ () => navigate('/tf', { state: { id } }) }>자세히 보기</button>
    </div>
  );
}

const MyPage = () => {
  const navigate = useNavigate();
  const [leaderTfList, setLeaderTfList] = useState<any[]>([]);
  const [followerTfList, setFollowerTfList] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/mytfs', {
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
      <main className="main container">
        <h2 className="section-title">내가 만든 TF</h2>
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
          <div className="card create">
            <button className="create-btn" onClick={() => navigate('/createTF')}>+ 새로운 TF 만들기</button>
          </div>
        </div>
      </main>
      <main className="main container">
        <h2 className="section-title">내가 속한 TF</h2>
        <div className="card-grid">
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
      </main>
    </div>
  );
}

export default MyPage;