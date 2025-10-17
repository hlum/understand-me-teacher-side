import React from 'react';
import {useLocation} from "react-router-dom";
// +-------------+--------------+------+-----+-------------------+-------------------+
// | Field       | Type         | Null | Key | Default           | Extra             |
// +-------------+--------------+------+-----+-------------------+-------------------+
// | id          | char(36)     | NO   | PRI | NULL              |                   |
// | teacher_id  | char(36)     | NO   | MUL | NULL              |                   |
// | class_id    | char(36)     | NO   | MUL | NULL              |                   |
// | title       | varchar(255) | NO   |     | NULL              |                   |
// | description | text         | YES  |     | NULL              |                   |
// | due_date    | date         | YES  |     | NULL              |                   |
// | created_at  | timestamp    | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
// +-------------+--------------+------+-----+-------------------+-------------------+
//     7 rows in set (0.01 sec)
export const AddNewHomeworkPage = () => {
  const location = useLocation();
  const { classID, teacherID } = location.state || {};
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [dueDate, setDueDate] = React.useState('');
  
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
            onClick={()=>{}} >追加する
        </button>
      </>

  )
}
