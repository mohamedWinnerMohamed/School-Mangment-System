"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";

const schema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long!" })
    .max(20, { message: "Username must be at most 20 characters long!" }),
  email: z.string().email({ message: "Invalid email address!" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long!" }),
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  phone: z.string().min(1, { message: "Phone is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  studentNames: z
    .string()
    .min(1, { message: "At least one student name is required!" })
    .transform((val) => val.split(",").map((name) => name.trim()))
    .refine((names) => names.every((name) => name.length > 0), {
      message:
        "Student names cannot be empty. Check your comma-separated list.",
    }),
});

type Inputs = z.infer<typeof schema>;

const ParentForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
  });

  return (
    
      
      <form className="flex flex-col gap-8" onSubmit={onSubmit}>
        {type === "create" && (
          <h1 className="text-xl font-semibold">Create a new parent</h1>
        )}
        {type === "update" && (
          <h1 className="text-xl font-semibold">Update Information</h1>
        )}
        <span className="text-xs text-gray-400 font-medium">
          Authentication Information
        </span>
        <div className="flex justify-start flex-wrap gap-4 md:gap-8">
          <InputField
            label="Username"
            name="username"
            defaultValue={data?.name}
            register={register}
            error={errors?.username}
          />
          <InputField
            label="Email"
            name="email"
            defaultValue={data?.email}
            register={register}
            error={errors?.email}
          />
         
        </div>
        <span className="text-xs text-gray-400 font-medium">
          Personal Information
        </span>
        <div className="flex justify-start flex-wrap gap-4 md:gap-8">
          <InputField
            label="First Name"
            name="firstName"
            defaultValue={data?.name.split(" ")[0]}
            register={register}
            error={errors.firstName}
          />
          <InputField
            label="Last Name"
            name="lastName"
            defaultValue={data?.name.split(" ")[1]}
            register={register}
            error={errors.lastName}
          />
          <InputField
            label="Phone"
            name="phone"
            defaultValue={data?.phone}
            register={register}
            error={errors.phone}
          />
          <InputField
            label="Address"
            name="address"
            defaultValue={data?.address}
            register={register}
            error={errors.address}
          />
          <InputField
            label={
              data?.students.length > 1 ? "Student's Name's" : "Student Name"
            }
            name="studentNames"
            defaultValue={data?.students}
            register={register}
            error={errors?.studentNames as any}
          />
          {errors?.studentNames?.message && (
            <p className="text-xs text-red-400">
              {errors.studentNames.message.toString()}
            </p>
          )}
        </div>
        <button className="bg-blue-400 text-white p-2 rounded-md">
          {type === "create" ? "Create" : "Update"}
        </button>
      </form>
    
  );
};

export default ParentForm;
