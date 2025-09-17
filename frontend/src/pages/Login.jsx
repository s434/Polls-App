import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Toast from "../components/Toast";
import './auth.css';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      setToast({ message: "Login successful!", type: "success" });
      navigate("/");
    } else {
      setToast({ message: "Login failed!", type: "error" });
    }
  };

  return (
    <div className="auth-container">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>

      <p className="auth-switch">
        Don’t have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
