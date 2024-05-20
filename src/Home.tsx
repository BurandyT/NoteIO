import React, { useEffect, useRef, useState } from 'react';
import NavBar from './components/homeComponent/navbar/NavBar';
import Page from './components/homeComponent/page/Page';

const Home: React.FC = () => {
  const [sidebarWidth, setSidebarWidth] = useState<number>(250);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [selectedNote, setSelectedNote] = useState<{ id: string; content: string; title: string } | null>(null);

  const handleMouseMove = (e: MouseEvent) => {
    if (sidebarRef.current) {
      const newWidth = e.clientX;
      if (newWidth >= 50 && newWidth <= 350) {
        setSidebarWidth(newWidth);
      }
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };

  const handleMouseDown = () => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (sidebarWidth < 200) {
      setSidebarWidth(60);
    }
  }, [sidebarWidth]);

  const handleNoteSelection = (note: { id: string; content: string; title: string }) => {
    setSelectedNote(note);
  };

  return (
    <section className='flex h-full bg-[#EAD196]'>
      <div
        ref={sidebarRef}
        style={{ width: `${sidebarWidth}px` }}
        className='relative shadow-5xl shadow bg-[#BF3131] select-none'
      >
        <div style={{ display: sidebarWidth >= 200 ? 'block' : 'none' }}>
          <NavBar onNoteSelect={handleNoteSelection} />
        </div>
        <div style={{ display: sidebarWidth >= 200 ? 'none' : 'flex' }} className='justify-center p-2'>
          <div className='p-3 rounded-full hover:bg-[#7D0A0A] transition-all duration-300' onClick={() => setSidebarWidth(200)}>
            <svg
              className="w-6 h-6 text-gray-800 dark:text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 17 14"
            >
              <path d="M16 2H1a1 1 0 0 1 0-2h15a1 1 0 1 1 0 2Zm0 6H1a1 1 0 0 1 0-2h15a1 1 0 1 1 0 2Zm0 6H1a1 1 0 0 1 0-2h15a1 1 0 0 1 0 2Z"></path>
            </svg>
          </div>
        </div>
        <div
          className="absolute top-0 right-0 w-2 h-full cursor-ew-resize"
          onMouseDown={handleMouseDown}
        />
      </div>
      <div className='w-full h-full'>
        <Page selectedNote={selectedNote} />
      </div>
    </section>
  );
};

export default Home;
