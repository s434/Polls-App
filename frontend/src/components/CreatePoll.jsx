import { useState } from 'react';
import api from '../api';
import './CreatePoll.css';
import Toast from './Toast';
import { useAuth } from '../context/AuthContext';
export default function CreatePoll({ onCreated }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['','']);
  const { user } = useAuth();
  // const [creatorId] = useState('a0428020-adb5-43b1-a107-c01539ae2613');
  const [toast, setToast] = useState(null);

  const addOption = () => setOptions([...options, '']);
  const changeOption = (index, value) => { const copy=[...options]; copy[index]=value; setOptions(copy); };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/polls', { question, options: options.filter(o=>o.trim()), creatorId: user?.id, isPublished: true });
      setQuestion(''); setOptions(['','']); if (onCreated) onCreated();
      setToast({ message: 'Poll Created!', type: 'success' });
    } catch (err) {
      setToast({ message: "Enter a question and atleast 2 options", type: 'error' });
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <form className="create-poll-form" onSubmit={handleCreate}>
        
        <input className="poll-input" placeholder="Question" value={question} onChange={e => setQuestion(e.target.value)} />
        {options.map((opt,i) => (
          <input key={i} className="poll-input" placeholder={`Option ${i+1}`} value={opt} onChange={e => changeOption(i,e.target.value)} />
        ))}
        <button type="button" className="btn btn-add" onClick={addOption}>+ Add option</button>
        <button type="submit" className="btn btn-create">Create Poll</button>
      </form>
    </>
  );
}
