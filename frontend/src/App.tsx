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
import { UserProvider } from "./context/userContext";

const App = () => {
  console.log("App component rendered");

  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;