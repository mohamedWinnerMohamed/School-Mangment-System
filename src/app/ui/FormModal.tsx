"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteTeacherAction } from "../lib/actions";
// import { deleteStudentAction } from "../lib/actions";
// import { deleteParentAction } from "../lib/actions";

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const ParentForm = dynamic(() => import("./forms/ParentForm"), {
  loading: () => <h1>Loading...</h1>,
});

const forms: {
  [key: string]: (
    type: "create" | "update",
    data?: any,
    classes?: string[] | any,
    subjects?: string[] | any
  ) => JSX.Element;
} = {
  teacher: (type, data, classes, subjects) => (
    <TeacherForm
      type={type}
      data={data}
      classes={classes}
      subjects={subjects}
    />
  ),
  student: (type, data) => <StudentForm type={type} data={data} />,
  parent: (type, data) => <ParentForm type={type} data={data} />,
};

const FormModal = ({
  table,
  type,
  data,
  id,
  classes,
  subjects,
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
  id?: number;
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const deleteActions: { [key: string]: (id: number) => Promise<any> } = {
    teacher: deleteTeacherAction,
    // student: deleteStudentAction,
    // parent: deleteParentAction,
  };

  const handleDeleteSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setServerError(null);
    const action = deleteActions[table];
    if (!action || !id) {
      setServerError(`Action not configured for '${table}' or id is missing.`);
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await action(id);
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
    return type === "delete" && id ? (
      <div className=" ">
        <form onSubmit={handleDeleteSubmit} className="p-4 flex flex-col gap-4">
          <span className="text-center font-medium">
            All data will be lost. Are you sure you want to delete this {table}?
          </span>
          <button
            type="submit"
            className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center disabled:bg-gray-400"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Deleting..." : "Delete"}
          </button>
          {serverError && (
            <p className="text-xs text-red-500 text-center">{serverError}</p>
          )}
        </form>
      </div>
    ) : type === "create" || type === "update" ? (
      forms[table](type, data, classes, subjects)
    ) : (
      "Form not found!"
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
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
                className="absolute top-4 right-4 cursor-pointer z-10"
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
