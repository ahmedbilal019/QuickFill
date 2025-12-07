import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Input from "../components/Input";
import Button from "../components/Button";
import Alert from "../components/Alert";
import { validateEmail, validatePassword } from "../utils/validation";

/**
 * Login Page
 */
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      newErrors.email = emailValidation.message;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      newErrors.password = passwordValidation.message;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!validate()) return;

    setLoading(true);

    try {
      const result = await login(formData);

      if (result.success) {
        setAlert({ type: "success", message: "Login successful! 🎉" });
        setTimeout(() => {
          navigate("/dashboard");
        }, 1000);
      } else {
        setAlert({ type: "error", message: result.message });
      }
    } catch (error) {
      setAlert({
        type: "error",
        message: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <Link to="/">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">QuickFill</h1>
          </Link>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Alert */}
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
            className="mb-6"
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            placeholder="your@email.com"
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="Enter your password"
            required
          />

          <Button type="submit" variant="primary" fullWidth loading={loading}>
            Sign In
          </Button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
