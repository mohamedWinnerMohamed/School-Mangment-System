import { FieldError } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  maxLength?: number;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const InputField = ({
  onChange,
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
  maxLength,
  inputProps,
}: InputFieldProps) => {
  return (
    <div className="relative w-full md:w-[29%] ">
      <label className=" absolute -top-[0.6rem] left-3 text-xs text-gray-500 bg-white px-[0.20rem]">
        {label}
      </label>
      <input
        type={type}
        {...register(name)}
        onChange={(e) => {
          register(name).onChange(e); // Call react-hook-form's onChange
          if (onChange) {
            onChange(e); // Call our custom onChange
          }
        }}
        className={`ring-[1px] mb-1 text-md ${
          error
            ? "ring-red-500 hover:ring-red-500 focus:ring-red-500 "
            : "ring-[#ddd] hover:ring-blue-400 focus:ring-blue-400 "
        } hover:cursor-pointer focus:outline-none p-2 rounded-md text-gray-600 text-sm w-full`}
        {...inputProps}
        defaultValue={defaultValue}
        maxLength={maxLength}
      />
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
