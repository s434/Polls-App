import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useState } from "react";
import PollView from "./components/PollView";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePoll from "./components/CreatePoll";
import PollList from "./components/PollList";
import "./App.css"; 

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  const [selectedPoll, setSelectedPoll] = useState(null);
  const [refreshPolls, setRefreshPolls] = useState(false);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <div className="app-wrapper">
                  <div className="card-container">
                    <h1 className="app-title">Polls App</h1>

                    {!selectedPoll ? (
                      <div className="poll-sections">
                        <div className="poll-section">
                          <h2>Create Poll</h2>
                          <CreatePoll onCreated={() => setRefreshPolls(prev => !prev)} />
                        </div>
                        <div className="poll-section">
                          <h2>Available Polls</h2>
                          <PollList key={refreshPolls} onSelect={setSelectedPoll} />
                        </div>
                      </div>
                    ) : (
                      <PollView
                        pollId={selectedPoll}
                        onBack={() => setSelectedPoll(null)}
                      />
                    )}
                  </div>
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
