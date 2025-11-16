import { FieldError } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
};

const InputField = ({
  label,
  type = "text",
  register,
  name,
  defaultValue,
  error,
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
        className="ring-[1px] ring-[#ddd] hover:ring-blue-400 hover:cursor-pointer focus:ring-blue-400 focus:outline-none p-2 rounded-md text-gray-600 text-sm w-full"
        {...inputProps}
        defaultValue={defaultValue}
      />
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
