import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/createTF.css';
import '../styles/App.css';
import Header from './header';

const CreateTF = () => {
    const [teamName, setTeamName] = useState('');
    const [description, setDescription] = useState('');
    const [members, setMembers] = useState<string[]>(['']);
    const [createdAt, setCreatedAt] = useState('');
    const [leader, setLeader] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // 현재 시간 설정
        const now = new Date().toISOString().slice(0, 16).replace('T', ' ');
        setCreatedAt(now);

        // 로그인한 사용자 정보 가져오기 (예: 세션 또는 API로부터)
        fetch('http://localhost:4000/api/me', {
            credentials: 'include',
        })
        .then((res) => {
            if (!res.ok) {
                navigate('/login');
            }
            return res.json();
        })
        .then((data) => {
            if (data.user.username) setLeader(data.user.username);
        });
    }, []);

    const addMember = () => setMembers([...members, '']);
    const removeMember = (index: number) => {
        if (members.length > 1) {
            const newMembers = members.filter((_, i) => i !== index);
            setMembers(newMembers);
        }
    };

    const handleMemberChange = (index: number, value: string) => {
        const newMembers = [...members];
        newMembers[index] = value;
        setMembers(newMembers);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('http://localhost:4000/api/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name: teamName, description, leader, members }),
        });

        const data = await res.json();
        if (res.ok) {
            alert('TF 생성 완료');
            window.location.href = '/';
        } else {
            alert(data.message || '생성 실패');
        }
    };

    return (
        <div className='page-wrapper'>
            <Header />
            <div className="tf-create-wrapper">
                <form onSubmit={handleSubmit} className="tf-form">
                    <div>
                        <label>TF 이름</label>
                        <input
                            type="text"
                            placeholder="TF 이름"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>TF 설명</label>
                        <textarea
                            placeholder="TF 설명(200자 이내)"
                            maxLength={200}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label>생성 날짜</label>
                        <input type="text" value={createdAt} readOnly />
                    </div>

                    <div>
                        <label>팀장</label>
                        <input type="text" value={leader} readOnly />
                    </div>

                    <div className="member-section">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <label>팀원</label>
                            <button type="button" onClick={addMember}>팀원 추가</button>
                        </div>
                        {members.map((member, index) => (
                            <div key={index} className="member-item">
                                <input
                                    type="text"
                                    placeholder={`팀원 ${index + 1} 닉네임`}
                                    value={member}
                                    onChange={(e) => handleMemberChange(index, e.target.value)}
                                />
                                <button type="button" onClick={() => removeMember(index)}>삭제</button>
                            </div>
                        ))}
                    </div>

                    <button type="submit">TF 생성</button>
                </form>
            </div>
        </div>
    );
};

export default CreateTF;