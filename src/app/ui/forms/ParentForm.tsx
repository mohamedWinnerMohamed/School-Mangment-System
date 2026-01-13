"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import InputField from "../InputField";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  checkValidationAction,
  createParentAction,
  updateParentAction,
  updateStudentAction,
} from "@/app/lib/actions";
import { mutate } from "swr";
import { Controller, useForm } from "react-hook-form";
import Select from "react-select";

const schema = z.object({
  userName: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  parentId: z.string().min(1, { message: "Teacher ID is required!" }),
  phoneNumber: z
    .string()
    .min(1, { message: "Phone is required!" })
    .regex(/^01[0125]\d{8}$/, { message: "Enter a valid phone number!" }),
  address: z.string().min(1, { message: "Address is required!" }),
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
  students: z.array(
    z.object({
      value: z.any(),
      label: z.string(),
    })
  ),
});

type Inputs = z.infer<typeof schema>;

const ParentForm = ({
  type,
  data,
  students,
  onClose,
}: {
  type: "create" | "update";
  data?: any;
  onClose?: () => void;
  students: {
    id: number;
    documentId: string;
    userName: string;
    email: string;
    phoneNumber: string;
    gender: "male" | "female";
    studentId: string;
    grade: string;
  }[];
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [nameDone, setNameDone] = useState<boolean>(false);
  const [idDone, setIdDone] = useState<boolean>(false);

  const studentsNamesOptions = (students || []).map((studentNameItem) => ({
    value: studentNameItem.documentId,
    label: studentNameItem.userName,
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
      parentId: data?.parentId,
      userName: data?.userName,
      email: data?.email,
      firstName: data?.firstName,
      lastName: data?.lastName,
      phoneNumber: data?.phoneNumber,
      address: data?.address,
      gender: data?.gender
        ? genderOptions.find((opt) => opt.value === data.gender)
        : undefined,
      bloodType: data?.bloodType
        ? bloodTypeOptions.find((opt) => opt.value === data.bloodType)
        : undefined,
      students: data?.students
        ? data.students.map((s: any) => ({
            value: s.documentId,
            label: s.userName,
          }))
        : [],
    },
  });

  // function for submit btn
  const onSubmit = handleSubmit(async (formData: Inputs) => {
    setIsSubmitting(true);
    setServerError(null);
    const studentsNamesIDs = (formData.students || []).map((s) => s.value);
    // const { students, ...otherFields } = formData;
    const { students, gender, bloodType, ...otherFields } = formData;
    const strapiData = {
      ...otherFields,
      gender: gender.value,
      bloodType: bloodType.value,
      students: studentsNamesIDs,
    };
    try {
      const result =
        type === "create"
          ? await createParentAction(strapiData)
          : await updateParentAction(data?.documentId, strapiData);
      if (result.success) {
        // const updateStudentData = {
        //   students,
        //   parent: true,
        // };
        // console.log("updateStudentData :", updateStudentData);
        // await updateStudentAction(data?.documentId, updateStudentData);
        mutate("/api/parents");
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
    const parentId = e.target.value;
    if (errors.parentId) {
      clearErrors("parentId");
    }
    try {
      const result = await checkValidationAction(
        data?.documentId,
        "parent",
        "parentId",
        parentId
      );
      if (parentId.length == 0) {
        setError("parentId", {
          type: "server",
          message: "Id is required",
        });
      }
      if (!result.success) {
        if (result.field === "parentId") {
          setError("parentId", {
            type: "server",
            message: result.error || "Id is already used",
          });
        }
      }
      if (parentId.length > 0 && result.success) {
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
        "parent",
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
      height: "38px",
      color: "#4b5563",
      paddingLeft: "4px",
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
      padding: "0 4px",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      fontSize: "12px",
    }),
  });

  return (
    <form className="flex flex-col gap-6" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">Create a new parent</h1>

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
            label="Parent ID"
            name="parentId"
            onChange={handleIdChange}
            register={register}
            error={errors.parentId}
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

          <div className="relative flex flex-col gap-1 w-full md:w-[29%]">
            <label className="absolute -top-[0.65rem] left-3 bg-white z-10 px-[0.20rem] text-xs text-gray-500">
              Student/s Name/s
            </label>
            <Controller
              name="students"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isMulti
                  classNamePrefix="custom-select"
                  maxMenuHeight={120}
                  options={studentsNamesOptions}
                  menuPortalTarget={document.body}
                  styles={{
                    ...customSelectStyles(!!errors.students),
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

            {errors.students?.message && (
              <p className="text-xs text-red-400">
                {errors.students.message.toString()}
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

export default ParentForm;
