import { useEffect, useState } from 'react';
import api from '../api';
import './PollList.css';

export default function PollList({ onSelect }) {
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    api.get('/polls')
      .then(res => setPolls(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="poll-list-container">
      <ul className="poll-list">
        {polls.map(p => (
          <li key={p.id}>
            <button className="poll-btn" onClick={() => onSelect(p.id)}>
              {p.question} 
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
