import React, { useEffect, useState } from 'react';
import { db } from '../../../firebase';
import {doc, getDoc } from 'firebase/firestore';
import { EditorContent, EditorRoot, JSONContent } from "novel";
import { StarterKit } from 'novel/extensions';
import { defaultExtensions } from './EditorExtensions';
import { extensions } from '@tiptap/core';


interface PageProps {
  selectedNote: { id: string; title: string } | null;
}

const Page: React.FC<PageProps> = ({ selectedNote }) => {
  const [noteContent, setNoteContent] = useState<JSONContent | undefined>(undefined);
  const [noteItems, setNoteItems] = useState<any[]>([]);
  const [noteTitle, setNoteTitle] = useState<string>('');
  const [createdAt, setCreatedAt] = useState<string>('');
  const [userId, setUserId] = useState<string>('');


  useEffect(() => {
    if (selectedNote) {
      const fetchNoteItems = async () => {
        try {
          const docRef = doc(db, 'notebooks', selectedNote.id);
          const docSnapshot = await getDoc(docRef);
          if (docSnapshot.exists()) {
            const itemData = docSnapshot.data();
            if (itemData) {
              setNoteItems([{ id: docSnapshot.id, ...itemData }]);
              console.log(noteItems)
              setNoteTitle(itemData.name);
              setCreatedAt(itemData.createdAt ? itemData.createdAt.toDate().toString() : '');
              console.log(createdAt)
              setUserId(itemData.userId || '');
              console.log(userId)
            }
          } else {
            setNoteItems([]);
          }
        } catch (error) {
          console.error('Error fetching note items:', error);
        }
      };

      fetchNoteItems();
    } else {
      setNoteItems([]);
    }
  }, [selectedNote]);

  // const editor = useEditor({
  //   extensions: [
  //     StarterKit,
  //     TaskList,
  //     TaskItem,
  //     SlashCommand.configure({
  //       commands: [
  //         {
  //           title: 'Text',
  //           command: ({ editor, range }) => {
  //             editor.chain().focus().deleteRange(range).setParagraph().run();
  //           },
  //         },
  //         {
  //           title: 'Heading',
  //           command: ({ editor, range }) => {
  //             editor.chain().focus().deleteRange(range).setHeading({ level: 1 }).run();
  //           },
  //         },
  //         {
  //           title: 'Task List',
  //           command: ({ editor, range }) => {
  //             editor.chain().focus().deleteRange(range).toggleTaskList().run();
  //           },
  //         },
  //         // Add more commands as needed
  //       ],
  //     }),
  //   ],
  //   content: noteContent,
  //   onUpdate({ editor }) {
  //     const json = editor.getJSON();
  //     setNoteContent(json);
  //   },
  // });


  return (
    <div className='bg-[#EAD196] w-full h-full'>
      {selectedNote ? (
        <div className='mx-24 bg-[#EAD196] h-full'>
          <div className='py-24 h-cover'>
          <div className='font-bold text-4xl'>{noteTitle}</div>
          <EditorRoot>
            <EditorContent
              extensions={[StarterKit.configure({})]}
              initialContent={noteContent}
              onUpdate={({ editor }) => {
                const json = editor.getJSON();
                setNoteContent(json);
                defaultExtensions
              }}
              className='h-full bg-[#EAD196]'
            />
          </EditorRoot>
          </div>
          
        </div>
      ) : (
        <div className='flex justify-center items-center w-full h-full text-9xl font-extrabold'>
          Howdy!
        </div>
      )}
    </div>
  );
};

export default Page;
