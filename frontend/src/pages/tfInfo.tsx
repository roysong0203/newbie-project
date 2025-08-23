// TF의 정보를 보여주는 페이지입니다.
import React, { useState, useEffect, use } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/tfInfo.css';
import '../styles/App.css';
import Header from './header';

const TFInfo = () => {
    const { id } = useLocation().state;
    const [tf, setTf] = useState<any>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isLeader, setIsLeader] = useState(false);
    const navigate = useNavigate();

    // console.log('TFInfo id:', id);

    useEffect(() => {
        fetch('http://localhost:4000/api/me', {
            credentials: 'include',
        })
        .then(res => {
            if (res.status === 200) {
                setIsLoggedIn(true);
            }
            return res.json();
        })
        .then(data => {
            // console.log('user', data);
            if (data.user) {
                setUser(data.user);
            }
        })
        .catch(err => console.error('TF 정보 불러오기 실패:', err));
    }, []);

    useEffect(() => {
        fetch(`http://localhost:4000/api/tf/${id}`, {
            credentials: 'include',
        })
        .then(res => res.json())
        .then(data => {
            if (data) {
                setTf(data);
                if ('id' in user && data.leaderId === user.id) {
                    setIsLeader(true);
                }
            } else {
                console.error('TF 정보가 없습니다.');
            }
            return setTf(data);
        })
        .catch(err => console.error('TF 정보 불러오기 실패:', err));
    }, [user, id]);

    if (!tf) return <div>Loading...</div>;

    // console.log(tf)

    const handleDelete = async () => {
        if(confirm('정말 삭제하시겠습니까?') === false) return;

        const res = await fetch(`http://localhost:4000/api/tf/${id}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (res.ok) {
            alert('TF가 삭제되었습니다.');
            window.location.href = '/';
        } else {
            alert('TF 삭제에 실패했습니다.');
        }
    }

    const handleEdit = () => {
        navigate('/editTF', {
            state: {
                id: id
            }
        });
    }

    const handleJoin = async () => {
        const res = await fetch(`http://localhost:4000/api/tf/${id}/join`, {
            method: 'POST',
            credentials: 'include',
        });

        if (res.ok) {
            alert('TF에 참여 요청을 보냈습니다.');
        } else {
            res.json().then(data => alert(data.message || 'TF 참여 요청에 실패했습니다.'));
        }
    }

    return (
        <div className="page-wrapper">
            <Header />
            <main className="tfinfo-container">
                <h2 className="section-title">{tf.name}</h2>
                <p>{tf.description}</p>
                <div className="tfinfo">
                    <span>👤 팀장: {tf.User?.name ?? "알 수 없음"}({tf.User?.username})</span>
                    {tf.TFMember.length == 0 && <span>👥 팀원: 없음</span>}
                    {tf.TFMember.length > 0 && <span>👥 팀원: {tf.TFMember.map((member: any) => (
                            `${member.User.name}(${member.User.username})`
                        )).join(', ')}
                    </span>}
                    <span>📅 생성 날짜: {new Date(tf.createdAt).toISOString().split('T')[0]}</span>
                </div>
                <div style={{margin: "1.5rem 0.5rem 1.5rem", display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '0.5rem'}}>
                    {isLoggedIn && !isLeader && <button className="join-btn" onClick={() => handleJoin()} style={{width: '75%'}}>TF 참여</button>}
                    {isLeader && <button className="edit-btn" onClick={() => { handleEdit() }} style={{width: '75%'}}>수정</button>}
                    {isLeader && <button className="delete-btn" onClick={() => { handleDelete() }} style={{width: '75%'}}>삭제</button>}
                </div>
            </main>
        </div>
    );
}

export default TFInfo;