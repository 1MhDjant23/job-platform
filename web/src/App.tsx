import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage/>}/>
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<p>Home Page</p>}/>
      </Route>
    </Routes>
  );
}

export default App
