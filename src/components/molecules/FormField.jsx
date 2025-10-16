import Input from "@/components/atoms/Input";

const FormField = ({ 
  label, 
  id, 
  error, 
  required,
  type = "text",
  ...props 
}) => {
  return (
    <div className="w-full">
      <label 
        htmlFor={id} 
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <Input 
        id={id} 
        type={type}
        error={error}
        {...props} 
      />
      {error && (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      )}
    </div>
  );
};

export default FormField;