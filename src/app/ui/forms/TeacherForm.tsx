"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import { useRouter } from "next/navigation";
import { createTeacherAction } from "@/app/lib/actions";
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
  phoneNumber: z.string().min(1, { message: "Phone is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.coerce.date({ message: "Birthday is required!" }),
  sex: z.object(
    {
      value: z.string(),
      label: z.string(),
    },
    { message: "Sex is required!" }
  ),
  classes: z
    .array(
      z.object({
        value: z.any(),
        label: z.string(),
      })
    )
    .min(1, { message: "Class is required." }),
  subjects: z
    .array(
      z.object({
        value: z.any(),
        label: z.string(),
      })
    )
    .min(1, { message: "Subject is required." }),
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
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const classOptions = classes.map((classItem) => ({
    value: classItem.id,
    label: classItem.name,
  }));

  const subjectOptions = subjects.map((subjectItem) => ({
    value: subjectItem.id,
    label: subjectItem.name,
  }));
  
// function for submit btn
  const onSubmit = handleSubmit(async (data: Inputs) => {
    setIsSubmitting(true);
    setServerError(null);
    const classIDs = data.classes.map((c) => c.value);
    const subjectIDs = data.subjects.map((s) => s.value);
    const { subjects, classes, sex, ...otherFields } = data;
    const strapiData = {
      ...otherFields,
      classes: classIDs,
      subjects: subjectIDs,
      sex: sex.value,
    };
    console.log(subjectIDs);
    console.log(classIDs);
    try {
      console.log("before res");
      const result = await createTeacherAction(strapiData);
      if (result.success) {
        router.refresh();
        if (onClose) onClose();
      } else {
        setServerError(result.error || "An unknown error occurred.");
      }
    } catch (error) {
      setServerError((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  });

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
  const customSelectStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      borderRadius: "0.45rem",
      height: "38px",
      color: "#4b5563",
      border: state.isFocused ? "1px solid #60a5fa" : "1px solid #ddd",
      boxShadow: state.isFocused ? "none" : provided.boxShadow,
      "&:hover": {
        borderColor: "#60a5fa",
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
  };
  const sexOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ];
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
            defaultValue={data?.userName}
            register={register}
            error={errors?.userName}
          />
          <InputField
            label="Email"
            name="email"
            defaultValue={data?.email}
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
            defaultValue={data?.firstName}
            register={register}
            error={errors.firstName}
          />
          <InputField
            label="Last Name"
            name="lastName"
            defaultValue={data?.lastName}
            register={register}
            error={errors.lastName}
          />
          <InputField
            label="Teacher ID"
            name="teacherId"
            defaultValue={data?.teacherId}
            register={register}
            error={errors.teacherId}
          />
          <InputField
            label="Phone"
            name="phoneNumber"
            defaultValue={data?.phoneNumber}
            register={register}
            error={errors.phoneNumber}
          />
          <InputField
            label="Address"
            name="address"
            defaultValue={data?.address}
            register={register}
            error={errors.address}
          />
          <InputField
            label="Blood Type"
            name="bloodType"
            defaultValue={data?.bloodType}
            register={register}
            error={errors.bloodType}
          />
          <div
            className="relative flex flex-col gap-2 w-full md:w-[29%]"
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
                    ...customSelectStyles,
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
          <div
            className="relative flex flex-col gap-2 w-full md:w-[29%] "
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
                    ...customSelectStyles,
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

          <div className="relative flex flex-col gap-2 w-full md:w-[29%]">
            <label className="absolute -top-[0.55rem] left-3 bg-white z-10 px-[0.20rem] text-xs text-gray-500">
              Sex
            </label>

            <Controller
              name="sex"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  options={sexOptions}
                  menuPortalTarget={document.body}
                  styles={{
                    ...customSelectStyles,
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

            {errors.sex?.message && (
              <p className="text-xs text-red-400">
                {errors.sex.message.toString()}
              </p>
            )}
          </div>
          <div
            className="relative flex flex-col gap-2 w-full md:w-[29%] "
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
                  className="ring-[1px] ring-gray-300 hover:ring-blue-400 focus:ring-blue-400 p-2 rounded-md text-sm w-full focus:outline-none"
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
      <button
        type="submit"
        className=" bg-blue-400 text-white p-2 rounded-md disabled:bg-gray-400"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Creating..." : type === "create" ? "Create" : "Update"}
      </button>
      {serverError && (
        <p className="text-xs text-red-500 text-center">{serverError}</p>
      )}
    </form>
  );
};

export default TeacherForm;
