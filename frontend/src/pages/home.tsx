import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import '../styles/App.css';
import '../styles/home.css';
import Header from './header';
import Card from './tfCard';

const Home = () => {
  const navigate = useNavigate();
  const [tfList, setTfList] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/tfs`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => setTfList(data))
      .catch(err => console.error('TF 목록 불러오기 실패:', err));
  }, []);

  return (
    <div className="page-wrapper">
      <Header />
      <main className="main" style={{ width: '87.5%' }}>
        <h2 className="section-title">전체 TF</h2>
        <div className="card-grid">
          {tfList.map((tf) => (
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

export default Home;
