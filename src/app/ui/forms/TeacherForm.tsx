"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useRouter } from "next/navigation";
import {
  checkValidationAction,
  createTeacherAction,
  updateTeacherAction,
} from "@/app/lib/actions";
import Select from "react-select";
import { useState, useRef, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createPortal } from "react-dom";

const schema = z.object({
  userName: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  teacherId: z.string().min(1, { message: "Teacher ID is required!" }),
  phoneNumber: z
    .string()
    .min(1, { message: "Phone is required!" })
    .regex(/^01[0125]\d{8}$/, { message: "Enter a valid phone number!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  birthday: z
    .preprocess((val) => {
      if (typeof val === "string" || val instanceof Date) return new Date(val);
      if (val === undefined || val === null) return undefined;
      return undefined;
    }, z.date({ required_error: "Birthday is required!" }))
    .refine((date) => !isNaN(date.getTime()), { message: "Invalid date" }),
  gender: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .refine((val) => val !== undefined, {
      message: "Gender is required!",
    }),
  bloodType: z
    .object({
      value: z.string(),
      label: z.string(),
    })
    .refine((val) => val !== undefined, {
      message: "Blood Type is required!",
    }),
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
});

type Inputs = z.infer<typeof schema>;

const TeacherForm = ({
  type,
  data,
  onClose,
  classes,
  subjects,
}: {
  type: "create" | "update";
  data?: any;
  onClose?: () => void;
  classes: { id: number | string; name: string }[];
  subjects: { id: number | string; name: string }[];
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const classOptions = classes.map((classItem) => ({
    value: classItem.id,
    label: classItem.name,
  }));

  const subjectOptions = subjects.map((subjectItem) => ({
    value: subjectItem.id,
    label: subjectItem.name,
  }));

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
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
      teacherId: data?.teacherId,
      phoneNumber: data?.phoneNumber,
      address: data?.address,
      bloodType: data?.bloodType
        ? bloodTypeOptions.find((opt) => opt.value === data.bloodType)
        : undefined,
      gender: data?.gender
        ? genderOptions.find((opt) => opt.value === data.gender)
        : undefined,
      birthday: data?.birthday ? new Date(data.birthday) : undefined,
      subjects:
        data?.subjects?.map((s: any) => ({
          value: s.id,
          label: s.name,
        })) || [],
      classes:
        data?.classes?.map((c: any) => ({
          value: c.id,
          label: c.name,
        })) || [],
    },
  });

  // function for submit btn
  const onSubmit = handleSubmit(async (formData: Inputs) => {
    setIsSubmitting(true);
    setServerError(null);
    const classIDs = formData.classes.map((c) => c.value);
    const subjectIDs = formData.subjects.map((s) => s.value);
    const { subjects, classes, bloodType, gender, ...otherFields } = formData;
    const strapiData = {
      ...otherFields,
      classes: classIDs,
      subjects: subjectIDs,
      gender: gender.value,
      bloodType: bloodType.value,
    };
    try {
      const result =
        type === "create"
          ? await createTeacherAction(strapiData)
          : await updateTeacherAction(data?.documentId, strapiData);
      if (result.success) {
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
    const teacherId = e.target.value;
    if (errors.teacherId) {
      clearErrors("teacherId");
    }
    try {
      const result = await checkValidationAction(
        data?.documentId,
        "teacher",
        "teacherId",
        teacherId
      );
      if (teacherId.length == 0) {
        setError("teacherId", {
          type: "server",
          message: "Id is required",
        });
      }
      if (!result.success) {
        if (result.field === "teacherId") {
          setError("teacherId", {
            type: "server",
            message: result.error || "Id is already used",
          });
        }
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
        "teacher",
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
      <h1 className="text-xl font-semibold">Create a new teacher</h1>
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
          />
          <InputField
            label="Email"
            name="email"
            register={register}
            error={errors?.email}
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
            label="Teacher ID"
            name="teacherId"
            onChange={handleIdChange}
            register={register}
            error={errors.teacherId}
          />
          <InputField
            label="Phone"
            name="phoneNumber"
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
            <label className="absolute -top-[0.55rem] left-3 bg-white z-10 px-[0.20rem] text-xs text-gray-500">
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
            className="relative flex flex-col gap-1 w-full md:w-[29%]"
            ref={selectWrapperRef}
          >
            <label className="absolute -top-[0.55rem] left-3 bg-white z-10 px-[0.20rem] text-xs text-gray-500">
              Subject
            </label>
            <Controller
              name="subjects"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={subjectOptions}
                  isMulti
                  classNamePrefix="custom-select"
                  maxMenuHeight={120}
                  menuPortalTarget={document.body}
                  styles={{
                    ...customSelectStyles(!!errors.subjects),
                    menuPortal: (provided) => ({
                      ...provided,
                      zIndex: 9999,
                      fontSize: "13px",
                    }),
                  }}
                />
              )}
            />
            {errors.subjects?.message && (
              <p className="text-xs text-red-400">
                {errors.subjects.message.toString()}
              </p>
            )}
          </div>
          <div
            className="relative flex flex-col gap-1 w-full md:w-[29%] "
            ref={selectWrapperRef}
          >
            <label className="absolute -top-[0.55rem] left-3 bg-white z-10 px-[0.20rem] text-xs text-gray-500">
              Class
            </label>
            <Controller
              name="classes"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={classOptions}
                  isMulti
                  classNamePrefix="custom-select"
                  maxMenuHeight={120}
                  menuPortalTarget={document.body}
                  styles={{
                    ...customSelectStyles(!!errors.classes),
                    menuPortal: (provided) => ({
                      ...provided,
                      zIndex: 9999,
                      fontSize: "13px",
                    }),
                  }}
                />
              )}
            />
            {errors.classes?.message && (
              <p className="text-xs text-red-400">
                {errors.classes.message.toString()}
              </p>
            )}
          </div>
          <div className="relative flex flex-col gap-1 w-full md:w-[29%]">
            <label className="absolute -top-[0.55rem] left-3 bg-white z-10 px-[0.20rem] text-xs text-gray-500">
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
            <label className="absolute -top-[0.55rem] left-3 bg-white z-10 px-[0.20rem] text-xs text-gray-500">
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

export default TeacherForm;
