import { useNavigate } from 'react-router-dom';
import '../styles/App.css';
import '../styles/tfCard.css';

const Card = ({ id, name, description, head, members, createdAt }: { id: number, name: string, description: string, head: string, members: number, createdAt: string }) => {
  const navigate = useNavigate();

  return (
    <div className="card">
      <h3>{name}</h3>
      <span>{description}</span>
      <div className="info">
        <span>👤 팀장: {head}</span>
        <span>👥 팀원: {members}명</span>
        <span>📅 생성 날짜: {createdAt}</span>
        <button className="btn" onClick={() => navigate('/tf', { state: { id } })}>자세히 보기</button>
      </div>
    </div>
  );
}

export default Card;