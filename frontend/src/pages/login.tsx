import '../App.css';
import './login.css';

const Login = () => {
    return (
        <div className='page-wrapper'>
            <header className="navbar">
                <div className="container">
                    <a href="/"><h1 className="logo">동아리 TF 관리 시스템</h1></a>
                    <nav className="nav-links">
                    <a href="/login">마이페이지</a>
                    <a href="/login">로그인</a>
                    </nav>
                </div>
            </header>
            <div className='login-container'>
                <h1>로그인</h1>
                <form>
                    <input type="text" id="username" placeholder="아이디를 입력해주세요" />
                    <input type="password" id="password" placeholder="비밀번호를 입력해주세요" />
                    <button type="submit">로그인</button>
                </form>
                <p>아직 계정이 없으신가요? <a href="/signup">회원가입</a></p>
            </div>
        </div>
    );
}

export default Login;