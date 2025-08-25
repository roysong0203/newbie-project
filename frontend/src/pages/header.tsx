import { useUser } from "../context/userContext";
import { useEffect, useState } from "react";
import { API_BASE_URL } from '../config';
import '../styles/header.css';
import { Link } from "react-router-dom";

const Header = () => {
    const { user, setUser } = useUser();
    const isLoggedIn = user !== null;
    const [ leaderTfList, setLeaderTfList ] = useState<any[]>([]);
    const [ notificationCount, setNotificationCount ] = useState(0);
    const [ showMypageMenu, setShowMypageMenu ] = useState(false); // 드롭다운 상태

    useEffect(() => {
        if (isLoggedIn) {
            fetch(`${API_BASE_URL}/api/mytfs`, { credentials: 'include' })
                .then(res => {
                    if (!res.ok) throw new Error('TF 목록을 불러오는 데 실패했습니다.');
                    return res.json();
                })
                .then(data => setLeaderTfList(data.leaderTFs))
                .catch(err => console.error('TF 목록 불러오기 실패:', err));

            fetch(`${API_BASE_URL}/api/myrequests`, { credentials: 'include' })
                .then(res => {
                    if (!res.ok) throw new Error('내 요청 알림을 불러오는 데 실패했습니다.');
                    return res.json().then(data => data.filter((item: any) => item.isConfirmed === 1 || item.isConfirmed === 2));
                })
                .then(data => setNotificationCount(data.length))
                .catch(err => console.error('내 요청 알림 불러오기 실패:', err));
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (isLoggedIn && leaderTfList.length > 0) {
            Promise.all(leaderTfList.map(tf =>
                fetch(`${API_BASE_URL}/api/tf/${tf.id}/requests`, { credentials: 'include' })
                    .then(res => {
                        if (!res.ok) throw new Error('가입 요청 알림을 불러오는 데 실패했습니다.');
                        return res.json();
                    })
            ))
            .then(results => {
                const allRequests = results.flat();
                setNotificationCount(prevCount => prevCount + allRequests.length);
            })
            .catch(err => console.error('가입 요청 알림 불러오기 실패:', err));
        }
    }, [isLoggedIn, leaderTfList]);

    const handleLogout = async () => {
        if(confirm('정말 로그아웃하시겠습니까?') === false) return;

        const res = await fetch(`${API_BASE_URL}/api/logout`, {
            method: 'POST',
            credentials: 'include',
        });

        if (res.ok) {
            setUser(null);
            alert('로그아웃 되었습니다.');
        } else {
            alert('로그아웃에 실패했습니다.');
        }
    };

    return (
        <header className="navbar">
            <div className="container">
                <Link to="/"><h1 className="logo">동아리 TF 관리 시스템</h1></Link>
                <nav className="nav-links">
                    { isLoggedIn && 
                        <Link to='/notification' className="notification-wrapper">
                            <img src="src/assets/bell.png" alt="notification" className="notification-icon" title="알림"/>
                            { notificationCount > 0 &&
                                <span className="notification-count">{ notificationCount > 9 ? '9+' : notificationCount }</span> }
                        </Link>
                    }
                    { isLoggedIn && <div className="welcome"><strong>{user.username}</strong> 님, 반갑습니다!</div>}
                    <a href="/" title="홈으로">홈으로</a>
                    
                    { isLoggedIn && (
                        <div 
                            className="mypage-dropdown"
                            onMouseEnter={() => setShowMypageMenu(true)}
                            onMouseLeave={() => setShowMypageMenu(false)}
                        >
                            <span className="mypage-link">마이페이지 ▾</span>
                            { showMypageMenu && (
                                <div className="dropdown-menu">
                                    <Link to="/editProfile">회원정보 수정</Link>
                                    <Link to="/mypage">내가 속한 TF</Link>
                                </div>
                            )}
                        </div>
                    )}
                    
                    { !isLoggedIn && <Link to='/signup' title="회원가입">회원가입</Link>}
                    { !isLoggedIn && <Link to="/login" title="로그인">로그인</Link> }
                    { isLoggedIn && <Link to="/" onClick={handleLogout} title="로그아웃">로그아웃</Link> }
                </nav>
            </div>
        </header>
    );
}

export default Header;