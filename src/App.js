import { BrowserRouter, Routes, Route } from "react-router-dom";
import Spinner from "./components/Spinner";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import { useSelector } from "react-redux";
import DoctorForm from "./pages/DoctorForm";

function App() {
  const {loading} = useSelector(state => state.loader);
  return (
    <div>
      {loading && <Spinner />}
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path='/apply-doctor' element={<ProtectedRoute><DoctorForm /></ProtectedRoute>} />
          <Route path='/admin' element={<ProtectedRoute><Admin /></ProtectedRoute>} />

        </Routes>
      </BrowserRouter>


    </div>
  );
}

export default App;
