import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://192.168.255.47:5000/api";

const Signup = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    accountType: "",
  });
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState("");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const typedFile = new File([file], file.name, { type: file.type || "image/jpeg" });
      setPhoto(typedFile);
      console.log("Selected photo:", {
        name: typedFile.name,
        size: typedFile.size,
        type: typedFile.type,
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    setError("Please enter a valid email address.");
    return;
  }
  if (!formData.password || formData.password.length < 6) {
    setError("Password must be at least 6 characters long.");
    return;
  }
  if (!formData.accountType) {
    setError("Please select an account type.");
    return;
  }
  if (formData.accountType === "student" && !photo) {
    setError("Please upload a photo for student account.");
    return;
  }

  let requestOptions;
  if (formData.accountType === "student") {
    // Convert photo to Base64
    const reader = new FileReader();
    const base64Photo = await new Promise((resolve) => {
      reader.onload = () => resolve(reader.result.split(",")[1]); // Remove data:image/jpeg;base64,
      reader.readAsDataURL(photo);
    });

    const payload = {
      email: formData.email,
      password: formData.password,
      accountType: formData.accountType,
      photo: base64Photo,
      photoName: photo.name,
      photoType: photo.type,
    };

    console.log("JSON payload:", {
      email: payload.email,
      password: payload.password,
      accountType: payload.accountType,
      photoName: payload.photoName,
      photoType: payload.photoType,
      photo: payload.photo.slice(0, 50) + "...",
    });

    requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };
  } else {
    const urlEncodedData = new URLSearchParams();
    urlEncodedData.append("email", formData.email);
    urlEncodedData.append("password", formData.password);
    urlEncodedData.append("accountType", formData.accountType);

    console.log("URL-encoded data:", urlEncodedData.toString());

    requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: urlEncodedData,
    };
  }

  try {
    console.log("Request URL:", `${BASE_URL}/V1/users/signup`);
    console.log("Request Options:", {
      method: requestOptions.method,
      headers: requestOptions.headers,
      body: formData.accountType === "student" ? "[JSON]" : requestOptions.body.toString(),
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(`${BASE_URL}/V1/users/signup`, {
      ...requestOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log("Response Status:", response.status);
    console.log("Response Headers:", Object.fromEntries(response.headers.entries()));

    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
      console.log("Response JSON:", data);
    } else {
      const text = await response.text();
      console.error("Non-JSON response:", text.slice(0, 500));
      throw new Error(`Server returned non-JSON response (status: ${response.status})`);
    }

    if (response.ok) {
      console.log("Signup successful:", data);
      alert(data.message || "Signup successful!");
      setFormData({ email: "", password: "", accountType: "" });
      setPhoto(null);

      const dashboardRoutes = {
        student: "/student-dashboard",
        teacher: "/teacher-dashboard",
        parent: "/parent-dashboard",
        admin: "/admin-dashboard",
      };
      const route = dashboardRoutes[data.user?.accountType];
      if (route) {
        navigate(route);
      } else {
        setError("Invalid account type received from server.");
      }
    } else {
      console.error("Signup failed:", data);
      setError(data.message || `Signup failed (Status: ${response.status})`);
    }
  } catch (error) {
    console.error("Network or fetch error during signup:", error);
    setError(`Failed to sign up: ${error.message}`);
  }
};

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-blue-800 to-blue-600 text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-blue-700">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-2xl text-white"
          >
            ×
          </button>
        </div>
        <nav className="p-4 space-y-2">
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors">
            <i className="fas fa-home"></i>
            <span>Home</span>
          </a>
          <a href="/about" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors">
            <i className="fas fa-info-circle"></i>
            <span>About</span>
          </a>
          <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors">
            <i className="fas fa-book"></i>
            <span>Courses</span>
          </a>
          <a href="/login" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors">
            <i className="fas fa-sign-in-alt"></i>
            <span>Login</span>
          </a>
          <a href="/signup" className="flex items-center space-x-3 p-3 rounded-lg bg-blue-500 text-white transition-colors">
            <i className="fas fa-user-plus"></i>
            <span>Sign Up</span>
          </a>
          <a href="/contact" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-700 transition-colors">
            <i className="fas fa-envelope"></i>
            <span>Contact</span>
          </a>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4 flex items-center justify-between lg:justify-start">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-blue-600 text-2xl"
          >
            <i className="fas fa-bars"></i>
          </button>
          <div className="flex items-center justify-center flex-1">
            <span className="text-3xl font-bold text-gray-800">Sign Up Page</span>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Sign Up</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4 relative">
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 hover:text-gray-800 mt-8"
                >
                  <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
              <div className="mb-4">
                <label htmlFor="accountType" className="block text-gray-700 font-medium mb-2">
                  Account Type
                </label>
                <select
                  id="accountType"
                  name="accountType"
                  value={formData.accountType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Account Type</option>
                  <option value="student">Student</option>
                  <option value="parent">Parent</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              {formData.accountType === "student" && (
                <div className="mb-4">
                  <label htmlFor="photo" className="block text-gray-700 font-medium mb-2">
                    Upload Photo (Clear face image)
                  </label>
                  <input
                    type="file"
                    id="photo"
                    name="photo"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              )}
              {error && <p className="text-red-500 text-center mb-4">{error}</p>}
              <div className="flex justify-between">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </button>
                <button
                  type="reset"
                  className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
                  onClick={() => {
                    setFormData({ email: "", password: "", accountType: "" });
                    setPhoto(null);
                  }}
                >
                  Clear
                </button>
              </div>
            </form>
            <p className="text-center mt-4 text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 hover:underline">
                Login
              </a>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Signup;