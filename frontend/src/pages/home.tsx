import React from 'react';
import '../styles/App.css';
import '../styles/home.css';
import Header from './header';

const Card = ({ name, description, head, members, createdAt }: { name: string, description: string, head: string, members: number, createdAt: string }) => {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>{description}</p>
      <div className="info">
        <span>👤 팀장: {head}</span>
        <span>👥 팀원: {members}명</span>
        <span>📅 생성 날짜: {createdAt}</span>
      </div>
      <button className="btn">자세히 보기</button>
    </div>
  );
}

const Home = () => {
  const tfList = [
    {
      id: 1,
      name: "동잠 TF",
      description: "2025년 동아리 잠바를 만드는는 TF",
      head: "홍길동",
      members: 5,
      createdAt: "2025-04-28",
    },
    {
      id: 2,
      name: "홍보 TF",
      description: "2025년 동아리 홍보를 위한 TF",
      head: "김길동",
      members: 11,
      createdAt: "2025-03-15",
    },
    {
      id: 3,
      name: "회의 준비 TF",
      description: "2025년 동아리 회의를 준비하는 TF",
      head: "이길동",
      members: 3,
      createdAt: "2025-01-20",
    },
    {
      id: 4,
      name: "회의 준비 TF",
      description: "2025년 동아리 회의를 준비하는 TF",
      head: "이길동",
      members: 3,
      createdAt: "2025-01-20",
    },
  ];

  console.log(tfList);

  return (
    <div className="page-wrapper">
      <Header />
      <main className="main container">
        <h2 className="section-title">전체 TF</h2>
        <div className="card-grid">
          {tfList.map((tf) => (
            <Card
              key={tf.id}
              name={tf.name}
              description={tf.description}
              head={tf.head}
              members={tf.members}
              createdAt={tf.createdAt}
            />
          ))}
          <div className="card create">
            <button className="create-btn">+ 새로운 TF 만들기</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;