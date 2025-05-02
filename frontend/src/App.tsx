import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import Login from "./pages/login";
import './App.css'

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

const Header = () => {
  return (
    <header className="navbar">
      <div className="container">
        <a href="/"><h1 className="logo">동아리 TF 관리 시스템</h1></a>
        <nav className="nav-links">
          <a href="#">마이페이지</a>
          <a href="/login">로그인</a>
        </nav>
      </div>
    </header>
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

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App