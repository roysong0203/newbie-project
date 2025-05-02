const Login = () => {
    return (
        <div className="login">
        <h1>로그인</h1>
        <form>
            <input type="text" placeholder="아이디" />
            <input type="password" placeholder="비밀번호" />
            <button type="submit">로그인</button>
        </form>
        <p>아직 계정이 없으신가요? <a href="/signup">회원가입</a></p>
        </div>
    );
}

export default Login;