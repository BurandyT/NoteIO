import React, { useEffect, useRef, useState } from 'react';
import { auth, db } from '../../../firebase';
import { User } from 'firebase/auth';
import { getDoc, doc, addDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { Navigate } from 'react-router-dom';

import './NavBar.css';

interface NavBarProps {
  onNoteSelect: (note: { id: string; title: string; content: string }) => void;
}

const NavBar: React.FC<NavBarProps> = ({ onNoteSelect }) => {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [notebookName, setNotebookName] = useState('');
  const [notebooks, setNotebooks] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await getUsername(currentUser.uid);
        await fetchUserNotebooks(currentUser.uid);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getUsername = async (uid: string) => {
    try {
      const docSnap = await getDoc(doc(db, 'users', uid));
      if (docSnap.exists()) {
        setUsername(docSnap.data()?.username);
      } else {
        setUsername(null);
      }
    } catch (error) {
      console.error('Error fetching username:', error);
    }
  };

  const fetchUserNotebooks = async (uid: string) => {
    try {
      const q = query(collection(db, 'notebooks'), where('userId', '==', uid));
      const querySnapshot = await getDocs(q);
      const fetchedNotebooks = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNotebooks(fetchedNotebooks);
    } catch (error) {
      console.error('Error fetching notebooks:', error);
    }
  };

  const handleCreateNotebook = () => {
    setShowInput(true);
  };

  const handleNotebookNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNotebookName(e.target.value);
  };

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (notebookName.trim().length > 0) {
        try {
          const docRef = await addDoc(collection(db, 'notebooks'), {
            name: notebookName,
            userId: user?.uid,
            createdAt: new Date(),
          });
          setNotebooks(prevNotebooks => [
            ...prevNotebooks,
            { id: docRef.id, name: notebookName, userId: user?.uid, createdAt: new Date() },
          ]);
          setNotebookName('');
          setShowInput(false);
        } catch (error) {
          console.error('Error creating notebook:', error);
        }
      } else {
        setShowInput(false);
      }
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
      setShowInput(false);
    }
  };

  useEffect(() => {
    if (showInput) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInput]);

  const handleDeleteNotebook = async (notebookId: string) => {
    try {
      await deleteDoc(doc(db, 'notebooks', notebookId));
      setNotebooks(prevNotebooks => prevNotebooks.filter(notebook => notebook.id !== notebookId));
    } catch (error) {
      console.error('Error deleting notebook:', error);
    }
  };

  const handleNoteClick = async (noteId: string) => {
    try {
      const docRef = doc(db, 'notebooks', noteId);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        const noteData = docSnapshot.data();
        if (noteData) {
          onNoteSelect({ id: noteId, title: noteData.title, content: noteData.content });
          console.log(noteData)
        }
      } else {
        console.error('No such document!');
      }
    } catch (error) {
      console.error('Error getting document:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <section className='bg-[#BF3131] h-screen w-full text-white'>
      <div className='h-full w-full flex flex-col justify-start items-center px-4 py-2 gap-2 text-white'>
        <div className='w-[95%]'>
          <div className='font-RobotoMono hover:bg-[#7D0A0A] duration-150 transition-all ease-in-out p-2 w-full rounded-lg cursor-pointer profileSection'>
            Welcome, {username}
          </div>
          <div className='profileSubSection'>
            <div className='font-RobotoMono text-xs hover:bg-[#7D0A0A] duration-150 transition-all ease-in-out p-2 w-[95%] rounded-lg cursor-pointer profileSection'>Edit profile</div>
            <div className='font-RobotoMono text-xs hover:bg-[#7D0A0A] duration-150 transition-all ease-in-out p-2 w-[95%] rounded-lg cursor-pointer profileSection' onClick={handleLogout}>Logout</div>
          </div>
        </div>
        <div className='font-RobotoMono hover:bg-[#7D0A0A] duration-150 transition-all ease-in-out p-2 w-[95%] rounded-lg cursor-pointer'>Settings</div>
        <div className='h-0.5 bg-[#7D0A0A] w-[95%]'></div>
        <div className='font-RobotoMono hover:bg-[#7D0A0A] duration-150 transition-all ease-in-out p-2 w-[95%] rounded-lg flex justify-around cursor-pointer' onClick={handleCreateNotebook}>
          <div>Create Notebook</div>
          <div>+</div>
        </div>
        {showInput && (
          <div className='font-RobotoMono p-1 w-[95%] rounded-lg '>
            <input
              type='text'
              value={notebookName}
              onChange={handleNotebookNameChange}
              onKeyDown={handleKeyPress}
              className='w-full p-2 rounded-md bg-[#7D0A0A] border-none'
              placeholder='Enter notebook name'
              ref={inputRef}
            />
          </div>
        )}
        <div className='w-full mt-1'>
          <div className='list-disc list-inside'>
            {notebooks.map(notebook => (
              <div
                key={notebook.id}
                className='font-RobotoMono p-2 rounded-lg hover:bg-[#7D0A0A] duration-150 transition-all ease-in-out cursor-pointer flex justify-between items-center notebook-item'
                onClick={() => handleNoteClick(notebook.id)}
              >
                <div>{notebook.name}</div>
                <div className='deleteButton hidden' onClick={() => handleDeleteNotebook(notebook.id)}>
                  &#10005;
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NavBar;
