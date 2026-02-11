import React, { useState } from "react";
import { registerUser, type RegisterData } from "../services/authService";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";


const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const roleParam = searchParams.get("role");
  const roleMethod: "TENANT" | "OWNER" =
    roleParam === "OWNER" || roleParam === "TENANT" ? roleParam : "TENANT";

  const [formData, setFormData] = useState<RegisterData>({
    email: "",
    fullname: "",
    password: "",
    phone: "",
    role: roleMethod,
  });

  const [mes, setMes] = useState<string>("");
  const [isError, setIsError] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMes("");
    setIsError(false);

    try {
      const response = await registerUser(formData);
      if (response.success) {
        console.log("Registered User:", response.data);
        setMes("Registration successful");
      } 
    } catch (error: unknown) {
      setIsError(true);
      if(axios.isAxiosError(error)){
        setMes(error.response?.data?.mes || "Registration failed")
      }else{
        setMes("Registration failed")
      } 
    }
  };

  return (
    <div>
      <div>
        <h2>Register as {roleMethod === "OWNER" ? "Owner" : "Tenant"}</h2>
        {mes && (
          <div
            style={{ color: isError ? "red" : "green", marginBottom: "10px" }}
          >
            {mes}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Full Name</label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Register</button>
        </form>
        <div>
          <p>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{ cursor: "pointer" }}
            >
              Sign in
            </span>
          </p>
          <p onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            Change Role
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
