"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import InputField from "../InputField";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  checkValidationAction,
  createLessonAction,
  updateLessonAction,
} from "@/app/lib/actions";
import { mutate } from "swr";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";
import { useToast } from "@/app/context/ToastContext";

const schema = z.object({
  grade: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .refine((val) => val !== undefined, {
      message: "Grade is required!",
    }),
  lessonId: z.string().min(1, { message: "lessonId is required!" }),
  classes: z
    .array(
      z.object({
        value: z.any(),
        label: z.string(),
      })
    )
    .min(1, { message: "Class is required!" }),
  subjects: z
    .array(
      z.object({
        value: z.any(),
        label: z.string(),
      })
    )
    .min(1, { message: "Subject is required!" }),
  teacher: z
    .array(
      z.object({
        value: z.any(),
        label: z.string(),
      })
    )
    .min(1, { message: "Teacher is required!" }),
});

type Inputs = z.infer<typeof schema>;

const LessonForm = ({
  type,
  data,
  onClose,
}: {
  type: "create" | "update";
  data?: any;
  onClose?: () => void;
}) => {
  const router = useRouter();
  const { showToast } = useToast();
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
      grade: data?.grade
        ? gradeOptions.find((opt) => opt.value === data.grade)
        : undefined,
      lessonId: data?.classId,
    },
  });

  // function for submit btn
  const onSubmit = handleSubmit(async (formData: Inputs) => {
    setIsSubmitting(true);
    setServerError(null);
    const { grade, ...otherFields } = formData;
    const strapiData = {
      ...otherFields,
      grade: grade.value,
    };
    try {
      const result =
        type === "create"
          ? await createLessonAction(strapiData)
          : await updateLessonAction(data?.id, strapiData);
      if (result.success) {
        showToast(
          type === "create"
            ? "Lesson created successfully!"
            : "Lesson updated successfully!",
          "success"
        );
        mutate("/api/teachers");
        mutate("/api/Lesson");
        router.refresh();
        if (onClose) onClose();
      } else {
        showToast(result.error || "An error occurred", "error");
        setServerError(result.error || "An error occurred");
      }
    } catch (error) {
      const errorMessage = (error as Error).message;
      showToast(errorMessage, "error");
      setServerError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  });

  // for handel check id
  const handleIdChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const lessonId = e.target.value;
    if (errors.lessonId) {
      clearErrors("lessonId");
    }
    try {
      const result = await checkValidationAction(
        data?.documentId,
        "lesson",
        "lessonId",
        lessonId
      );
      if (lessonId.length == 0) {
        setError("lessonId", {
          type: "server",
          message: "Id is required",
        });
      }

      if (!result.success) {
        if (result.field === "lessonId") {
          setError("lessonId", {
            type: "server",
            message: result.error || "Id is already used",
          });
        }
      }
      if (lessonId.length > 0 && result.success) {
        setIdDone(true);
      } else {
        setIdDone(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // // for handel check name
  // const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const name = e.target.value;
  //   if (errors.name) {
  //     clearErrors("name");
  //   }
  //   try {
  //     const result = await checkValidationAction(
  //       data?.documentId,
  //       "classe",
  //       "name",
  //       name
  //     );
  //     if (!result.success) {
  //       if (result.field === "name") {
  //         setError("name", {
  //           type: "server",
  //           message: result.error || "Name is already used",
  //         });
  //       }
  //     }
  //     if (name.length > 0 && result.success) {
  //       setNameDone(true);
  //     } else {
  //       setNameDone(false);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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
      paddingLeft: "4px",
      height: "38px",
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
      <h1 className="text-xl font-semibold">Create a new lesson</h1>

      <div className="flex flex-col gap-5">
        <span className="text-xs text-gray-400 font-medium">
          lesson Information
        </span>
        <div className="flex justify-start flex-wrap gap-6 md:gap-8">
          {/* <InputField
            label="Name"
            name="name"
            onChange={handleNameChange}
            register={register}
            error={errors?.name}
            success={nameDone}
          /> */}

          <InputField
            label="Lesson ID"
            name="lessonId"
            register={register}
            onChange={handleIdChange}
            error={errors.lessonId}
            success={idDone}
          />

          {/* <InputField
            label="Capacity"
            name="capacity"
            register={register}
            error={errors.capacity}
            defaultValue="30"
          /> */}

          {/* <div className="relative flex flex-col gap-1 w-full md:w-[29%]">
            <label className="absolute -top-[0.65rem] left-3 bg-white z-10 px-[0.20rem] text-xs text-gray-500">
              Supervisor Name
            </label>
            <Controller
              name="supervisor"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  classNamePrefix="custom-select"
                  maxMenuHeight={120}
                  options={supervisorsNamesOptions}
                  menuPortalTarget={document.body}
                  styles={{
                    ...customSelectStyles(!!errors.supervisor),
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

            {errors.supervisor?.message && (
              <p className="text-xs text-red-400">
                {errors.supervisor.message.toString()}
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

          <div className="relative flex flex-col gap-1 w-full md:w-[29%]">
            <label className="absolute -top-[0.65rem] left-3 bg-white z-10 px-[0.20rem] text-xs text-gray-500">
              Teacher
            </label>
            <Controller
              name="teacher"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  maxMenuHeight={120}
                  options={teacherOptions}
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

export default LessonForm;
