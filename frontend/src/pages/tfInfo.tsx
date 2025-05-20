// TF의 정보를 보여주는 페이지입니다.
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/tfInfo.css';
import '../styles/App.css';
import Header from './header';

const TFInfo = () => {
    const { id } = useLocation().state;
    const [tf, setTf] = useState<any>(null);
    const navigate = useNavigate();

    // console.log('TFInfo id:', id);

    useEffect(() => {
        fetch(`http://localhost:4000/api/tf/${id}`, {
        credentials: 'include',
        })
        .then(res => res.json())
        .then(data => setTf(data))
        .catch(err => console.error('TF 정보 불러오기 실패:', err));
    }, [id]);

    if (!tf) return <div>Loading...</div>;

    // console.log(tf)

    return (
        <div className="page-wrapper">
            <Header />
            <main className="tfinfo-container">
                <h2 className="section-title">{tf.name}</h2>
                <p>{tf.description}</p>
                <div className="tfinfo">
                    <span>👤 팀장: {tf.User?.name ?? "알 수 없음"}({tf.User?.username})</span>
                    {tf.TFMember.length == 0 && <span>👥 팀원: 없음</span>}
                    {tf.TFMember.length > 0 && <span>👥 팀원: </span>}
                    {
                        tf.TFMember.length > 0 && 
                        <ul>
                            {tf.TFMember.map((member: any) => (
                                <li key={member.id}>
                                    {member.name}({member.username})
                                </li>
                            ))}
                        </ul>
                    }
                    <span>📅 생성 날짜: {new Date(tf.createdAt).toISOString().split('T')[0]}</span>
                </div>
            </main>
        </div>
    );
}

export default TFInfo;