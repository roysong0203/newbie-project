import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import './styles/App.css'
import Login from "./pages/login";
import SignUp from "./pages/signup";
import Home from "./pages/home";
import CreateTF from "./pages/createTF";
import TFInfo from "./pages/tfInfo";
import MyPage from "./pages/mypage";
import { UserProvider } from "./context/userContext";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/createTF" element={<CreateTF />} />
          <Route path="/tf" element={<TFInfo />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;