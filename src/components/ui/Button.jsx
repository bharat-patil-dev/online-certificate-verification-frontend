const Button = ({
    children,
    type = "button",
    variant = "primary",
    onClick,
    disabled = false,
    className = "",
}) => {
    const base =
        "px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none";

    const variants = {
        primary:
            "bg-blue-600 text-white hover:bg-blue-700",
        secondary:
            "bg-gray-100 text-gray-800 hover:bg-gray-200",
        danger:
            "bg-red-600 text-white hover:bg-red-700",
        success:
            "bg-green-600 text-white hover:bg-green-700",
        outline:
            "border border-gray-300 text-gray-700 hover:bg-gray-50",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${variants[variant]} ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
            } ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;