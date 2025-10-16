import React from 'react';
import {type User} from "firebase/auth";
import {useState} from "react";
import { type Class } from "../types/class.js";
import { addNewClass} from "../api/classOperations.js";

interface AddNewClassViewProps {
    user: User;
}
const AddNewClassView = (props: AddNewClassViewProps) => {
  const { user } = props;
  const [className, setClassName] = useState("");
  const [admissionYear, setAdmissionYear] = useState("");
  const [majorCode, setMajorCode] = useState("");
    const [errors, setErrors] = useState<{ className?: string | undefined; admissionYear?: string | undefined }>({});

    const checkClassName = (name: string) => {
        setErrors(prev => ({
            ...prev,
            className: name.trim() === "" ? "クラス名を入力してください。" : undefined
        }));
    };

    const checkAdmissionYear = (year: string) => {
        const yearNum = Number(year);
        setErrors(prev => ({
            ...prev,
            admissionYear:
                isNaN(yearNum) || yearNum < 10 || yearNum > 99
                    ? "入学年度は10から100の間の数字で入力してください。"
                    : undefined
        }));
    };


    const handleSubmit = async (event: React.FormEvent) => {
            event.preventDefault();
            checkClassName(className);
            checkAdmissionYear(admissionYear);

            if (!errors.className && !errors.admissionYear) {
                const newClass = {
                    teacherID: user.uid,
                    name: className,
                    admissionYear: Number(admissionYear),
                    majorCode: majorCode
                }
                try {
                    await addNewClass(newClass as Class)
                }catch (error) {
                    alert(`クラスの追加に失敗しました。${error}`);
                }
            }

            // フォームをリセット
            setClassName("");
            setAdmissionYear("");
            setMajorCode("");
            setErrors({});

    }


    return (
      <div>
          <h2>クラス追加ページ</h2> <br/>
          <input
              placeholder="クラス名"
              value={className}
              onChange={(event)=>{
                  setClassName(event.target.value)
                  checkClassName(event.target.value)
              }
          } /> <br/>

          <input
              placeholder="対象の入学年度"
              value={admissionYear}
              onChange={(event)=>{
                  setAdmissionYear(event.target.value)
                  checkAdmissionYear(event.target.value)}}
          /> <br/>

          <input
              placeholder="対象の専攻コード"
              value={majorCode}
              onChange={(event)=>setMajorCode(event.target.value)}
          /> <br/>

          {errors.className && <p style={{ color: "red" }}>{errors.className}</p>}
          {errors.admissionYear && <p style={{ color: "red" }}>{errors.admissionYear}</p>}

          <button disabled={ errors.className != null && errors.admissionYear != null} onClick={handleSubmit}>クラスを追加する</button>
      </div>
  );
};

export default AddNewClassView;