import React from 'react';
import {useLocation} from "react-router-dom";
import { addNewHomework } from '../api/HomeworksOperations.js';


export const AddNewHomeworkPage = () => {
  const location = useLocation();
  const { classID, teacherID } = location.state || {};
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [dueDate, setDueDate] = React.useState('');


  const handleSubmit = async () => {
    try {
      await addNewHomework(classID, teacherID, title, description, dueDate);
    } catch (error) {
        alert(`課題の追加に失敗しました。もう一度やり直してください。`);
        console.error(error);
    }
  }

  return (
      <>
        <h3>クラスID： {classID}</h3>
        <h3>教師ID： {teacherID}</h3>
        <h2>課題追加ページ</h2>
        <input
          placeholder="課題名"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <br/>
        <textarea
          placeholder="課題の説明"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <br/>
        <input
          type="date"
          placeholder="締め切り日"
          value={dueDate}
          onChange={(event) => setDueDate(event.target.value)}
        />
        <br/>
        <button
            onClick={handleSubmit} >追加する
        </button>
      </>

  )
}
