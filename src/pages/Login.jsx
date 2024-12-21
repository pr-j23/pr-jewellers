import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import classNames from "classnames";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const { login } = useAuth();

  const fields = [
    {
      id: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter your email",
    },
    {
      id: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
    },
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const isFormValid =
    formData.email.trim() === "admin@example.com" &&
    formData.password.trim() === "admin123";

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isFormValid && login(formData.email, formData.password)) {
      toast.success("Logged in successfully!");
      navigate("/");
    } else {
      toast.error("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="flex justify-center w-full px-4 py-8">
      <div className="w-full max-w-md">
        <h1 className="mb-8 text-3xl font-bold text-center">Admin Use Only</h1>
        <p className="mb-6 text-center text-gray-600">
          Use <span className="font-bold">admin@example.com</span> and{" "}
          <span className="font-bold">admin123</span> for demo access.
        </p>
        <form onSubmit={handleSubmit} className="grid gap-6">
          {fields.map((field) => (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                className="block mb-2 font-bold text-gray-700"
              >
                {field.label}
              </label>
              <input
                id={field.id}
                type={field.type}
                required
                placeholder={field.placeholder}
                className="w-full px-3 py-2 text-gray-700 border rounded shadow focus:outline-none focus:shadow-outline"
                value={formData[field.id]}
                onChange={handleChange}
              />
            </div>
          ))}
          <button
            type="submit"
            className={classNames(
              "py-2 px-4 my-4 font-bold text-white transition-colors rounded-md bg-purple-600",
              isFormValid
                ? "hover:bg-purple-700"
                : "opacity-50 cursor-not-allowed"
            )}
            disabled={!isFormValid}
            aria-disabled={!isFormValid}
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
