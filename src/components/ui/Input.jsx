const Input = ({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    required = false,
}) => {
    return (
        <div className="space-y-2">
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700"
                >
                    {label}
                </label>
            )}

            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
        </div>
    );
};

export default Input;