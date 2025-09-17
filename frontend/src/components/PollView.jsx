import { useEffect, useState } from 'react';
import api from '../api';
import socket from '../socket';
import './PollView.css';
import Toast from './Toast';
import { useAuth } from '../context/AuthContext';

export default function PollView({ pollId, onBack }) {
  const [poll, setPoll] = useState(null);
  const { user } = useAuth();
  // const [userId] = useState('a0428020-adb5-43b1-a107-c01539ae2613');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    let mounted = true;
    api.get(`/polls/${pollId}`).then(res => { if (mounted) setPoll(res.data); }).catch(console.error);

    socket.emit('joinPoll', { pollId });
    socket.on('pollUpdate', (data) => {
      if (data.pollId === pollId) setPoll(old => ({ ...old, options: data.options }));
    });

    return () => {
      mounted = false;
      socket.emit('leavePoll', { pollId });
      socket.off('pollUpdate');
    };
  }, [pollId]);

  const handleVote = async (optionId) => {
    try {
      await api.post(`/polls/${pollId}/vote`, { userId: user?.id, pollOptionId: optionId });
      setToast({ message: 'Vote submitted!', type: 'success' });
    } catch (err) {
      setToast({ message: err.response?.data?.error || 'Vote failed', type: 'error' });
    }
  };

  if (!poll) return <div className="loading">Loading...</div>;

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="poll-view-container">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h2>{poll.question}</h2>
        <ul className="options-list">
          {poll.options.map(o => (
            <li key={o.id}>
              <button className="option-btn" onClick={() => handleVote(o.id)}>
                {o.text} <span className="vote-count">{o.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
