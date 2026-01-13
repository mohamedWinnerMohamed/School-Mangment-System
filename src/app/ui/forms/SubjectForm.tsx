"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import InputField from "../InputField";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  checkValidationAction,
  createSubjectAction,
  updateSubjectAction,
} from "@/app/lib/actions";
import { mutate } from "swr";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

const schema = z.object({
  name: z.string().min(1, { message: "Name is required!" }),
  grade: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .refine((val) => val !== undefined, {
      message: "Grade is required!",
    }),
  isActive: z.boolean().default(true),
  subjectId: z.string().min(1, { message: "subjectId is required!" }),
  // teachers: z.array(
  //   z.object({
  //     value: z.any(),
  //     label: z.string(),
  //   })
  // ),
});

type Inputs = z.infer<typeof schema>;

const SubjectForm = ({
  type,
  data,
  // teachers,
  onClose,
}: {
  type: "create" | "update";
  data?: any;
  onClose?: () => void;
  // teachers: {
  //   documentId: string;
  //   userName: string;
  // }[];
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [nameDone, setNameDone] = useState<boolean>(false);
  const [idDone, setIdDone] = useState<boolean>(false);
  const gradeOptions = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "3", label: "3" },
    { value: "4", label: "4" },
    { value: "5", label: "5" },
    { value: "6", label: "6" },
    { value: "7", label: "7" },
    { value: "8", label: "8" },
    { value: "9", label: "9" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
  ];

  // const teachersNamesOptions = (teachers || []).map((teacherNameItem) => ({
  //   value: teacherNameItem.documentId,
  //   label: teacherNameItem.userName,
  // }));

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setError,
    clearErrors,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: data?.name,
      grade: data?.grade
        ? gradeOptions.find((opt) => opt.value === data.grade)
        : undefined,
      isActive: data?.isActive ?? true,
      subjectId: data?.subjectId,
      // teachers: data?.teachers
      //   ? data.teachers.map((t: any) => ({
      //       value: t.documentId,
      //       label: t.userName,
      //     }))
      //   : [],
    },
  });

  // function for submit btn
  const onSubmit = handleSubmit(async (formData: Inputs) => {
    setIsSubmitting(true);
    setServerError(null);
    // const teachersNamesIDs = (formData.teachers || []).map((t) => t.value);
    // const { students, ...otherFields } = formData;
    const {grade, ...otherFields } = formData;
    const strapiData = {
      ...otherFields,
      // teachers: teachersNamesIDs,
      grade: grade.value,
    };
    try {
      const result =
        type === "create"
          ? await createSubjectAction(strapiData)
          : await updateSubjectAction(data?.documentId, strapiData);
      if (result.success) {
        mutate("/api/subjects?active=active");
        mutate("/api/subjects?active=all");
        router.refresh();
        if (onClose) onClose();
      }
    } catch (error) {
      setServerError((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  });

  // for handel check id
  const handleIdChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const subjectId = e.target.value;
    if (errors.subjectId) {
      clearErrors("subjectId");
    }
    try {
      const result = await checkValidationAction(
        data?.documentId,
        "subject",
        "subjectId",
        subjectId
      );
      if (subjectId.length == 0) {
        setError("subjectId", {
          type: "server",
          message: "Id is required",
        });
      }

      if (!result.success) {
        if (result.field === "subjectId") {
          setError("subjectId", {
            type: "server",
            message: result.error || "Id is already used",
          });
        }
      }
      if (subjectId.length > 0 && result.success) {
        setIdDone(true);
      } else {
        setIdDone(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // for handel check name
  const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (errors.name) {
      clearErrors("name");
    }
    try {
      const result = await checkValidationAction(
        data?.documentId,
        "subject",
        "name",
        name
      );
      if (!result.success) {
        if (result.field === "name") {
          setError("name", {
            type: "server",
            message: result.error || "Name is already used",
          });
        }
      }
      if (name.length > 0 && result.success) {
        setNameDone(true);
      } else {
        setNameDone(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // for handel scroll bar in controller component
  const selectWrapperRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scrollContainer =
      selectWrapperRef.current?.querySelector<HTMLDivElement>(
        ".custom-select__value-container"
      );
    if (!scrollContainer) return;
    const handleWheelScroll = (event: WheelEvent) => {
      if (scrollContainer.scrollWidth > scrollContainer.clientWidth) {
        event.preventDefault();
        scrollContainer.scrollLeft += event.deltaY;
      }
    };
    scrollContainer.addEventListener("wheel", handleWheelScroll, {
      passive: false,
    });
    return () => {
      scrollContainer.removeEventListener("wheel", handleWheelScroll);
    };
  }, []);

  // for handel design select inputs
  const customSelectStyles = (hasError: boolean = false) => ({
    control: (provided: any, state: any) => ({
      ...provided,
      borderRadius: "0.45rem",
      height: "38px",
      paddingLeft: "4px",
      textAlign: "left",
      color: "#4b5563",
      border: hasError
        ? "1px solid #ef4444"
        : state.isFocused
        ? "1px solid #60a5fa"
        : "1px solid #ddd",
      boxShadow: state.isFocused ? "none" : provided.boxShadow,
      "&:hover": {
        borderColor: hasError ? "#ef4444" : "#60a5fa",
        cursor: "pointer",
      },
    }),
    valueContainer: (provided: any) => ({
      ...provided,
      padding: "0 6px",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      fontSize: "12px",
    }),
  });

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Create a new Subject</h1>

      <div className="flex flex-col gap-5">
        <span className="text-xs text-gray-400 font-medium">
          Subject Information
        </span>
        <div className="flex justify-start flex-wrap gap-6 md:gap-8">
          <InputField
            label="Name"
            name="name"
            onChange={handleNameChange}
            register={register}
            error={errors?.name}
            success={nameDone}
          />

          <InputField
            label="Subject ID"
            name="subjectId"
            register={register}
            onChange={handleIdChange}
            error={errors.subjectId}
            success={idDone}
          />

          {/* <div className="relative flex flex-col gap-1 w-full md:w-[29%]">
            <label className="absolute -top-[0.65rem] left-3 bg-white z-10 px-[0.20rem] text-xs text-gray-500">
              Teacher/s Name/s
            </label>
            <Controller
              name="teachers"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={teachersNamesOptions}
                  isMulti
                  classNamePrefix="custom-select"
                  maxMenuHeight={120}
                  menuPortalTarget={document.body}
                  styles={{
                    ...customSelectStyles(!!errors.teachers),
                    menuPortal: (provided) => ({
                      ...provided,
                      zIndex: 9999,
                      fontSize: "13px",
                    }),
                  }}
                  placeholder="Select..."
                />
              )}
            />

            {errors.teachers?.message && (
              <p className="text-xs text-red-400">
                {errors.teachers.message.toString()}
              </p>
            )}
          </div> */}
          <div className="relative flex flex-col gap-1 w-full md:w-[29%]">
            <label className="absolute -top-[0.65rem] left-3 bg-white z-10 px-[0.20rem] text-xs text-gray-500">
              Grade
            </label>
            <Controller
              name="grade"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  maxMenuHeight={120}
                  options={gradeOptions}
                  menuPortalTarget={document.body}
                  styles={{
                    ...customSelectStyles(!!errors.grade),
                    menuPortal: (provided) => ({
                      ...provided,
                      zIndex: 9999,
                      fontSize: "13px",
                    }),
                  }}
                  placeholder="Select..."
                />
              )}
            />
            {errors.grade?.message && (
              <p className="text-xs text-red-400">
                {errors.grade.message.toString()}
              </p>
            )}
          </div>
          <div className="relative flex items-center gap-3 w-full md:w-[29%] mb-1 border border-1 border-[#ddd] rounded-md p-2 pr-3 max-w-fit">
            <input
              type="checkbox"
              {...register("isActive")}
              id="isActive"
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
            />
            <label
              htmlFor="isActive"
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              Is Active
            </label>
            {errors.isActive?.message && (
              <p className="text-xs text-red-400 absolute -bottom-5">
                {errors.isActive.message.toString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {type === "create" ? (
        <button
          type="submit"
          className=" bg-blue-400 mb-2 text-white p-2 rounded-md disabled:bg-gray-400"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create"}
        </button>
      ) : (
        <button
          type="submit"
          className=" bg-blue-400 text-white p-2 rounded-md disabled:bg-gray-400 "
          disabled={isSubmitting}
        >
          {isSubmitting ? "Loading..." : "Update"}
        </button>
      )}
      {serverError && (
        <p className="text-xs text-red-500 text-center">{serverError}</p>
      )}
    </form>
  );
};

export default SubjectForm;
