import { useUser } from "../context/userContext";
import '../styles/header.css';

const Header = () => {
    const { user, setUser } = useUser();
    const isLoggedIn = user !== null;

    const handleLogout = async () => {
        const res = await fetch('http://localhost:4000/api/logout', {
        method: 'POST',
        credentials: 'include',
        });

        if (res.ok) {
            setUser(null); // context 상태 초기화
        } else {
            alert('로그아웃에 실패했습니다.');
        }
    };

    return (
        <header className="navbar">
            <div className="container">
                <a href="/"><h1 className="logo">동아리 TF 관리 시스템</h1></a>
                <nav className="nav-links">
                    <a href="/">홈으로</a>
                    { !isLoggedIn && <a href='/signup'>회원가입</a>}
                    { !isLoggedIn && <a href="/login">로그인</a> }
                    { isLoggedIn && <a href="/" onClick={handleLogout}>로그아웃</a> }
                </nav>
            </div>
        </header>
    );
}

export default Header;