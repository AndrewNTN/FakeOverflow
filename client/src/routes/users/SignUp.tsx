import { FormEvent, useState } from "react";
import FormError from "@/components/FormError.tsx";
import User from "@server/types/user";

export default function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyPassword, setVerifyPassword] = useState("");

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [verifyPasswordError, setVerifyPasswordError] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    let valid = true;

    setNameError("");
    setEmailError("");
    setPasswordError("");
    setVerifyPasswordError("");

    const emailPattern = /^([\w.-]+)@/;
    const match = email.match(emailPattern);
    const emailId = match ? match[1] : "";

    if (password.includes(emailId)) {
      setPasswordError("Password cannot include email ID");
      valid = false;
    }

    if (password.includes(name)) {
      setPasswordError("Password cannot include name");
      valid = false;
    }

    if (password.trim() === "") {
      setPasswordError("Password cannot be empty");
      valid = false;
    }

    if (name.trim() === "") {
      setNameError("Name cannot be empty");
      valid = false;
    }

    if (email.trim() === "") {
      setEmailError("Email cannot be empty");
      valid = false;
    }

    if (password.trim() !== verifyPassword.trim()) {
      setVerifyPasswordError("Passwords must match");
      valid = false;
    }

    if (valid) {
      const newUser: User = {
        username: name,
        email: email,
        password: password,
      };

      // TODO: ask server if unique email, break and show errors accordingly
      // No two users can create an account with the same
      // email. The email should have a valid form. The
      // typed password should not contain their first or
      // last name, or their email id. Nicely styled feedback
      // must be presented to the user if the account could
      // not be created due to the above reasons or any
      // other reason
      console.log(newUser);
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
          <h1 className="text-2xl font-bold mb-2">Create your account</h1>
          <div className="flex flex-col">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="border border-gray-300 rounded p-2"
              onChange={(e) => setName(e.target.value)}
            />
            <FormError message={nameError} />
          </div>
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
          <div className="flex flex-col">
            <label htmlFor="vpassword">Verify Password</label>
            <input
              type="password"
              id="vpassword"
              name="vpassword"
              className="border border-gray-300 rounded p-2"
              onChange={(e) => setVerifyPassword(e.target.value)}
            />
            <FormError message={verifyPasswordError} />
          </div>
          <button className="bg-blue-500 p-2 rounded text-white hover:bg-blue-600">
            Sign Up
          </button>
        </form>
      </div>
    </>
  );
}
