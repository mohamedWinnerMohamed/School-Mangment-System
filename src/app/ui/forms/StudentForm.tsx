"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useRouter } from "next/navigation";
import Select from "react-select";
import { useState, useRef, useEffect } from "react";
import {
  checkValidationAction,
  createStudentAction,
  updateStudentAction,
} from "@/app/lib/actions";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createPortal } from "react-dom";
import { useClasses, useParents } from "@/app/lib/hooks/useSWRData";
import { useToast } from "@/app/context/ToastContext";

const schema = z.object({
  userName: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  studentId: z.string().min(1, { message: "Student ID is required!" }),
  phoneNumber: z
    .string()
    .min(1, { message: "Phone is required!" })
    .regex(/^01[0125]\d{8}$/, { message: "Enter a valid phone number!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  grade: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .refine((val) => val !== undefined, {
      message: "Grade is required!",
    }),
  bloodType: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .refine((val) => val !== undefined, {
      message: "Blood Type is required!",
    }),
  class: z.object({
    value: z.any(),
    label: z.string(),
  }),
  gender: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .refine((val) => val !== undefined, {
      message: "Gender is required!",
    }),
  birthday: z
    .preprocess((val) => {
      if (typeof val === "string" || val instanceof Date) return new Date(val);
      if (val === undefined || val === null) return undefined;
      return undefined;
    }, z.date({ required_error: "Birthday is required!" }))
    .refine((date) => !isNaN(date.getTime()), { message: "Invalid date" }),
  parent: z
    .object({
      value: z.any(),
      label: z.string(),
    })
    .refine((val) => val !== undefined, {
      message: "Parent is required!",
    }),
});

type Inputs = z.infer<typeof schema>;

const StudentForm = ({
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

  const { classes } = useClasses();
  const { parents } = useParents();

  // Filter to show only non-full classes
  const classOptions = classes
    .filter((classItem: any) => !classItem.full)
    .map((classItem: any) => ({
      value: classItem.documentId,
      label: classItem.name,
    }));

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];
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

  const bloodTypeOptions = [
    { value: "A+", label: "A+" },
    { value: "B+", label: "B+" },
    { value: "AB+", label: "AB+" },
    { value: "O+", label: "O+" },
    { value: "A-", label: "A-" },
    { value: "B-", label: "B-" },
    { value: "AB-", label: "AB-" },
    { value: "O-", label: "O-" },
  ];
  const parentNamesOptions = (parents || []).map((parentNameItem: any) => ({
    value: parentNameItem.id,
    label: parentNameItem.userName,
  }));
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
      userName: data?.userName,
      email: data?.email,
      firstName: data?.firstName,
      lastName: data?.lastName,
      studentId: data?.studentId,
      phoneNumber: data?.phoneNumber,
      address: data?.address,
      bloodType: data?.bloodType
        ? bloodTypeOptions.find((opt) => opt.value === data.bloodType)
        : undefined,
      gender: data?.gender
        ? genderOptions.find((opt) => opt.value === data.gender)
        : undefined,
      birthday: data?.birthday ? new Date(data.birthday) : undefined,
      grade: data?.grade
        ? gradeOptions.find((opt) => opt.value === data.grade)
        : undefined,
      class: data?.class
        ? {
            value: data.class.documentId,
            label: data.class.name,
          }
        : undefined,
      parent: data?.parent
        ? {
            value: data.parent.id,
            label: data.parent.userName,
          }
        : undefined,
    },
  });

  // function for submit btn
  const onSubmit = handleSubmit(async (formData: Inputs) => {
    setIsSubmitting(true);
    setServerError(null);
    const classIDs = formData.class.value;
    const parentID = formData.parent.value;
    const {
      parent,
      class: classObj,
      bloodType,
      gender,
      grade,
      ...otherFields
    } = formData;
    const strapiData = {
      ...otherFields,
      class: classIDs,
      gender: gender.value,
      bloodType: bloodType.value,
      grade: grade.value,
      parent: parentID,
      oldClassId: data?.class?.documentId,
    };
    try {
      const result =
        type === "create"
          ? await createStudentAction(strapiData)
          : await updateStudentAction(data?.documentId, strapiData);
      if (result.success) {
        showToast(
          type === "create"
            ? "Student created successfully!"
            : "Student updated successfully!",
          "success"
        );
        // const updateStudentData = {
        //   students,
        //   parent: true,
        // };
        // console.log("updateStudentData :", updateStudentData);
        // await updateStudentAction(data?.documentId, updateStudentData);
        router.refresh();
        if (onClose) onClose();
      } else {
        // عرض الخطأ من السيرفر
        const errorMessage = result.error || "An error occurred";
        showToast(errorMessage, "error");
        setServerError(errorMessage);
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
    const studentId = e.target.value;
    if (errors.studentId) {
      clearErrors("studentId");
    }
    try {
      const result = await checkValidationAction(
        data?.documentId,
        "student",
        "studentId",
        studentId
      );
      if (studentId.length == 0) {
        setError("studentId", {
          type: "server",
          message: "Id is required",
        });
      }

      if (!result.success) {
        if (result.field === "studentId") {
          setError("studentId", {
            type: "server",
            message: result.error || "Id is already used",
          });
        }
      }
      if (studentId.length > 0 && result.success) {
        setIdDone(true);
      } else {
        setIdDone(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // for handel check userName
  const handleUserNameChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const userName = e.target.value;
    if (errors.userName) {
      clearErrors("userName");
    }
    try {
      const result = await checkValidationAction(
        data?.documentId,
        "student",
        "userName",
        userName
      );
      if (!result.success) {
        if (result.field === "userName") {
          setError("userName", {
            type: "server",
            message: result.error || "User Name is already used",
          });
        }
      }
      if (userName.length > 0 && result.success) {
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
      paddingLeft: "4px",
      height: "38px",
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

  // for handel calendar for birthday input
  const [portal, setPortal] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const portalRoot = document.body;
    const el = document.createElement("div");
    el.id = "datepicker-portal-wrapper";
    portalRoot.appendChild(el);
    setPortal(el);
    return () => {
      portalRoot.removeChild(el);
    };
  }, []);

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Create a new student</h1>
      <div className="flex flex-col gap-5">
        <span className="text-xs text-gray-400 font-medium">
          Authentication Information
        </span>
        <div className="flex justify-start flex-wrap gap-6 md:gap-8">
          <InputField
            label="User Name"
            name="userName"
            onChange={handleUserNameChange}
            register={register}
            error={errors?.userName}
            success={nameDone}
          />
          <InputField
            label="Email"
            name="email"
            register={register}
            error={errors?.email}
          />
          <InputField
            label="Student ID"
            name="studentId"
            register={register}
            onChange={handleIdChange}
            error={errors.studentId}
            success={idDone}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <span className="text-xs text-gray-400 font-medium">
          Personal Information
        </span>
        <div className="flex justify-start flex-wrap gap-6 md:gap-8">
          <InputField
            label="First Name"
            name="firstName"
            register={register}
            error={errors.firstName}
          />
          <InputField
            label="Last Name"
            name="lastName"
            register={register}
            error={errors.lastName}
          />
          <InputField
            label="Phone"
            name="phoneNumber"
            maxLength={11}
            register={register}
            error={errors.phoneNumber}
          />
          <InputField
            label="Address"
            name="address"
            register={register}
            error={errors.address}
          />

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
              Blood Type
            </label>
            <Controller
              name="bloodType"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  maxMenuHeight={120}
                  options={bloodTypeOptions}
                  menuPortalTarget={document.body}
                  styles={{
                    ...customSelectStyles(!!errors.bloodType),
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
            {errors.bloodType?.message && (
              <p className="text-xs text-red-400">
                {errors.bloodType.message.toString()}
              </p>
            )}
          </div>
          <div
            className="relative flex flex-col gap-1 w-full md:w-[29%] "
            ref={selectWrapperRef}
          >
            <label className="absolute -top-[0.65rem] left-3 bg-white z-10 px-[0.20rem] text-xs text-gray-500">
              Class
            </label>
            <Controller
              name="class"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={classOptions}
                  classNamePrefix="custom-select"
                  maxMenuHeight={120}
                  menuPortalTarget={document.body}
                  onChange={async (selectedOption) => {
                    field.onChange(selectedOption);
                  }}
                  styles={{
                    ...customSelectStyles(!!errors.class),
                    menuPortal: (provided) => ({
                      ...provided,
                      zIndex: 9999,
                      fontSize: "13px",
                    }),
                  }}
                />
              )}
            />
            {errors.class?.message && (
              <p className="text-xs text-red-400">
                {errors.class.message.toString()}
              </p>
            )}
          </div>

          <div className="relative flex flex-col gap-1 w-full md:w-[29%]">
            <label className="absolute -top-[0.65rem] left-3 bg-white z-10 px-[0.20rem] text-xs text-gray-500">
              Gender
            </label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={genderOptions}
                  menuPortalTarget={document.body}
                  styles={{
                    ...customSelectStyles(!!errors.gender),
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
            {errors.gender?.message && (
              <p className="text-xs text-red-400">
                {errors.gender.message.toString()}
              </p>
            )}
          </div>

          <div
            className="relative flex flex-col gap-1 w-full md:w-[29%] "
            ref={selectWrapperRef}
          >
            <label className="absolute -top-[0.65rem] left-3 bg-white z-10 px-[0.20rem] text-xs text-gray-500">
              Birthday
            </label>
            <Controller
              name="birthday"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  className={`ring-[1px] p-2 rounded-md text-sm w-full focus:outline-none 
                              ${
                                errors.birthday
                                  ? "ring-red-500 hover:ring-red-500 focus:ring-red-500"
                                  : "ring-gray-300 hover:ring-blue-400 focus:ring-blue-400"
                              }`}
                  placeholderText="mm/dd/yyyy"
                  dateFormat="MM/dd/yyyy"
                  showYearDropdown
                  scrollableYearDropdown
                  popperContainer={({ children }) => {
                    if (!portal) return null;
                    return createPortal(children, portal);
                  }}
                  popperClassName="datepicker-popper-on-top"
                />
              )}
            />
            {errors.birthday?.message && (
              <p className="text-xs text-red-400">
                {errors.birthday.message.toString()}
              </p>
            )}
          </div>
          <div className="relative flex flex-col gap-1 w-full md:w-[29%]">
            <label className="absolute -top-[0.65rem] left-3 bg-white z-10 px-[0.20rem] text-xs text-gray-500">
              Parent Name
            </label>
            <Controller
              name="parent"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  classNamePrefix="custom-select"
                  maxMenuHeight={120}
                  options={parentNamesOptions}
                  menuPortalTarget={document.body}
                  styles={{
                    ...customSelectStyles(!!errors.parent),
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

            {errors.parent?.message && (
              <p className="text-xs text-red-400">
                {errors.parent.message.toString()}
              </p>
            )}
          </div>
        </div>
      </div>

      {type === "create" ? (
        <button
          type="submit"
          className=" bg-blue-400 text-white p-2 rounded-md disabled:bg-gray-400"
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

export default StudentForm;
