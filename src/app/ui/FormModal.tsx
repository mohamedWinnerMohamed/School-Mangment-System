"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  deleteTeacherAction,
  deleteStudentAction,
  deleteParentAction,
  deleteSubjectAction,
  deleteClassAction,
} from "../lib/actions";
import StudentPage from "../(dashboard)/student/page";

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ParentForm = dynamic(() => import("./forms/ParentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const SubjectForm = dynamic(() => import("./forms/SubjectForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ClassForm = dynamic(() => import("./forms/ClassesForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    type: "create" | "update",
    data?: any,
    classes?: string[] | any,
    subjects?: string[] | any,
    students?: string[] | any,
    parent?: string[] | any,
    teachers?: string[] | any
  ) => JSX.Element;
} = {
  teacher: (setOpen, type, data) => (
    <TeacherForm type={type} data={data} onClose={() => setOpen(false)} />
  ),
  student: (setOpen, type, data) => (
    <StudentForm type={type} data={data} onClose={() => setOpen(false)} />
  ),
  parent: (setOpen, type, data, classes, subjects, students) => (
    <ParentForm
      type={type}
      data={data}
      students={students}
      onClose={() => setOpen(false)}
    />
  ),
  subject: (
    setOpen,
    type,
    data
  ) => (
    <SubjectForm
      type={type}
      data={data}
      // teachers={teachers}
      onClose={() => setOpen(false)}
    />
  ),
  class: (
    setOpen,
    type,
    data,
    classes,
    subjects,
    students,
    parent,
    teachers
  ) => (
    <ClassForm
      type={type}
      data={data}
      supervisor={teachers}
      onClose={() => setOpen(false)}
    />
  ),
};

const FormModal = ({
  table,
  type,
  data,
  id,
  classes,
  subjects,
  students,
  teachers,
  parent,
}: {
  table:
    | "teacher"
    | "student"
    | "parent"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "announcement";
  type: "create" | "update" | "delete";
  data?: any;
  classes?: string[];
  subjects?: string[];
  students?: any[];
  parent?: any[];
  teachers?: any[];
  id?: string;
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const deleteActions: { [key: string]: (id: string) => Promise<any> } = {
    teacher: deleteTeacherAction,
    student: deleteStudentAction,
    parent: deleteParentAction,
    subject: deleteSubjectAction,
    class: deleteClassAction,
  };

  const handleDeleteSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setServerError(null);
    const action = deleteActions[table];
    // Check if we have either id or data
    if (!action || (!id && !data)) {
      setServerError(
        `Action not configured for '${table}' or id/data is missing.`
      );
      return;
    }
    setIsSubmitting(true);
    try {
      // Pass data if available (optional), otherwise pass id
      const payload = data ? data : id;
      const result = await action(payload);
      if (result && result.success) {
        router.refresh();
        setOpen(false);
      } else {
        setServerError(result?.error || "An unknown error occurred.");
      }
    } catch (error) {
      setServerError((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const Form = () => {
    return type === "delete" && (id || data) ? (
      <div className=" ">
        <form className="p-4 flex flex-col gap-4">
          <span className="text-center font-medium text-lg">
            Are you sure you want to delete this {table}?
            <br />
            <span className="text-sm">All data will be lost</span>
          </span>
          <button
            type="submit"
            className="bg-red-500 hover:opacity-90 text-white font-bold py-2 px-4 rounded-md border-none w-max self-center disabled:bg-gray-400"
            disabled={isSubmitting}
            onClick={handleDeleteSubmit}
          >
            {isSubmitting ? "Deleting..." : "Delete"}
          </button>
          {serverError && (
            <p className="text-xs text-red-500 text-center">{serverError}</p>
          )}
        </form>
      </div>
    ) : type === "update" ? (
      forms[table](
        setOpen,
        type,
        data,
        classes,
        subjects,
        students,
        parent,
        teachers
      )
    ) : type === "create" ? (
      forms[table](
        setOpen,
        type,
        data,
        classes,
        subjects,
        students,
        parent,
        teachers
      )
    ) : (
      "Form not found!"
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${
          type === "create"
            ? "bg-lamaYellow"
            : type === "delete"
            ? " bg-red-400 "
            : "bg-slate-300"
        }`}
        onClick={() => setOpen(true)}
      >
        {/* <Image src={`/${type}.png`} alt="" width={16} height={16} /> */}
        {type === "create" ? (
          <img
            width="22"
            height="22"
            src="https://img.icons8.com/pulsar-line/48/plus.png"
            alt="plus"
          />
        ) : type === "delete" ? (
          <img
            width="16"
            height="16"
            src="https://img.icons8.com/pastel-glyph/128/trash.png"
            alt="filled-trash"
          />
        ) : (
          <img
            width="20"
            height="20"
            src="https://img.icons8.com/forma-bold-filled/24/pencil.png"
            alt="pencil"
          />
        )}
      </button>
      {open && (
        <div className=" w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div
            className="
            bg-white 
            max-h-[80%] 
            rounded-md 
            relative 
            w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%] 
            flex flex-col 
            overflow-hidden
          "
          >
            <div className="flex-shrink-0 p-4 pb-2">
              <div
                className="absolute top-4 right-4 cursor-pointer z-10 hover:bg-gray-100 p-2 rounded-md"
                onClick={() => setOpen(false)}
              >
                <Image src="/close.png" alt="" width={14} height={14} />
              </div>
            </div>

            <div className="flex-1 overflow-auto px-4 hide-scrollbar-arrows">
              <Form />
            </div>

            <div className="flex-shrink-0 h-[10px]"></div>
          </div>
        </div>
      )}
    </>
  );
};
export default FormModal;
