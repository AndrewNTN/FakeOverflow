import { FormEvent, useState } from "react";
import FormError from "@/components/FormError.tsx";
import axiosInstance from "../../../api.config.ts";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    let valid = true;

    setEmailError("");
    setPasswordError("");

    if (email.trim() === "") {
      setEmailError("Email cannot be empty");
      valid = false;
    }

    if (password.trim() === "") {
      setPasswordError("Password cannot be empty");
      valid = false;
    }

    if (valid) {
      const user = {
        email: email,
        password: password,
      };

      // Verify login credentials and login
      axiosInstance
        .post("/api/session", user)
        .then(() => {
          navigate("/questions");
        })
        .catch((err) => {
          valid = false;
          setPasswordError(err.response.data.message);
        });
    }
  };

  return (
    <>
      <div className="shadow-xl rounded-2xl p-14">
        <form
          action=""
          className="flex flex-col gap-8 w-96"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl font-bold mb-2">Log In</h1>
          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="border border-gray-300 rounded p-2"
              onChange={(e) => setEmail(e.target.value)}
            />
            <FormError message={emailError} />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="border border-gray-300 rounded p-2"
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormError message={passwordError} />
          </div>
          <button className="bg-blue-500 p-2 rounded text-white hover:bg-blue-600">
            Log In
          </button>
        </form>
      </div>
    </>
  );
}
