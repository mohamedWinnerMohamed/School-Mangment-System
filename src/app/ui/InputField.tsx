import { FieldError } from "react-hook-form";

type InputFieldProps = {
  label: string;
  type?: string;
  register: any;
  name: string;
  defaultValue?: string;
  error?: FieldError;
  success?: boolean;
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
  error,
  success,
  maxLength,
  inputProps,
  defaultValue,
}: InputFieldProps) => {
  console.log("success", success);
  console.log("error", error);
  return (
    <div className="relative w-full md:w-[29%] ">
      <label className="absolute -top-[0.65rem] left-3 text-xs text-gray-500 bg-white px-[0.20rem]">
        {label}
      </label>
      <input
        defaultValue={defaultValue}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        type={type}
        {...register(name)}
        onChange={(e) => {
          register(name).onChange(e);
          if (onChange) {
            onChange(e);
          }
        }}
        className={`ring-[1px] mb-1 text-md ${
          error
            ? "ring-red-500 hover:ring-red-500 focus:ring-red-500 "
            : "ring-[#ddd] hover:ring-blue-400 focus:ring-blue-400 "
        }${
          success
            ? "ring-green-500 hover:ring-green-500 focus:ring-green-500 "
            : "ring-[#ddd] hover:ring-blue-400 focus:ring-blue-400 "
        }
          hover:cursor-pointer focus:outline-none p-2 rounded-md text-gray-600 text-sm w-full`}
        {...inputProps}
        maxLength={maxLength}
      />
      {error?.message && (
        <p className="text-xs text-red-400">{error.message.toString()}</p>
      )}
    </div>
  );
};

export default InputField;
