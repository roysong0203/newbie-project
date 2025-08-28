// TF의 정보를 보여주는 페이지입니다.
import React, { useState, useEffect, use } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { API_BASE_URL } from '../config';
import '../styles/tfInfo.css';
import '../styles/App.css';
import Header from './header';

const TFInfo = () => {
    const { tfId } = useParams();
    const [tf, setTf] = useState<any>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [isLeader, setIsLeader] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const navigate = useNavigate();

    // console.log('TFInfo id:', id);

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/me`, {
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
        fetch(`${API_BASE_URL}/api/tf/${tfId}`, {
            credentials: 'include',
        })
        .then(res => res.json())
        .then(data => {
            // console.log(data);
            if (data) {
                // console.log(user);
                if (user && 'TFMember' in data && 'id' in user) {
                    const memberIds = data.TFMember.map((member: any) => member.User.id);
                    if (memberIds.includes(user.id)) {
                        // console.log("isMember true");
                        setIsMember(true);
                    }
                }
                setTf(data);
                if (user && 'id' in user && data.leaderId === user.id) {
                    setIsLeader(true);
                }
            } else {
                console.error('TF 정보가 없습니다.');
            }
            return setTf(data);
        })
        .catch(err => console.error('TF 정보 불러오기 실패:', err));
    }, [user, tfId]);

    if (!tf) return <div>Loading...</div>;

    // console.log(tf);

    const handleDelete = async () => {
        if(confirm('정말 삭제하시겠습니까?') === false) return;

        const res = await fetch(`${API_BASE_URL}/api/tf/${tfId}`, {
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
        if (!isLoggedIn) {
            alert('로그인 후 이용해주세요.');
            navigate('/login');
            return;
        }
        if (!isLeader) {
            alert('팀장만 수정할 수 있습니다.');
            return;
        }
        navigate(`/editTF/${tfId}`);
    }

    const handleJoin = async () => {
        if (!isLoggedIn) {
            alert('로그인 후 이용해주세요.');
            navigate('/login');
            return;
        }

        const res = await fetch(`${API_BASE_URL}/api/tf/${tfId}/join`, {
            method: 'POST',
            credentials: 'include',
        });

        if (res.ok) {
            alert('TF 참여 요청이 전송되었습니다.');
        } else {
            res.json().then(data => alert(data.message || 'TF 참여에 실패했습니다.'));
        }
    }

    const handleQuit = async () => {
        if(confirm('정말 탈퇴하시겠습니까?') === false) return;

        const res = await fetch(`${API_BASE_URL}/api/tf/${tfId}/quit`, {
            method: 'DELETE',
            credentials: 'include',
        });
        if (res.ok) {
            alert('TF에서 탈퇴되었습니다.');
            window.location.reload();
        } else {
            alert('TF 탈퇴에 실패했습니다.');
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
                    {(!isLoggedIn || ( !isLeader && !isMember )) && <button className="join-btn" onClick={() => handleJoin()} style={{width: '75%'}}>TF 참여 요청</button>}
                    {isLoggedIn && isMember && <button className="delete-btn" onClick={() => { handleQuit() }} style={{width: '75%'}}>TF 탈퇴</button>}
                    {isLeader && <button className="edit-btn" onClick={() => { handleEdit() }} style={{width: '75%'}}>수정</button>}
                    {isLeader && <button className="delete-btn" onClick={() => { handleDelete() }} style={{width: '75%'}}>삭제</button>}
                </div>
            </main>
        </div>
    );
}

export default TFInfo;
