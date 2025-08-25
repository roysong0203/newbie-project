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
import EditTF from "./pages/editTF";
import EditProfile from "./pages/editProfile";
import NotificationPage from "./pages/notification";
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
          <Route path="/editTF" element={<EditTF />} />
          <Route path="/tf" element={<TFInfo />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/editProfile" element={<EditProfile />} />
          <Route path="*" element={<Navigate to="/" />} />
          <Route path="/notification" element={<NotificationPage />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;