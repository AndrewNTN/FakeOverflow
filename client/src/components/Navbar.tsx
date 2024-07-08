import { Link, NavLink, useNavigate } from "react-router-dom";
import { IconBrandStackoverflow, IconSearch } from "@tabler/icons-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useAuthentication } from "@/helper.ts";
import { useCookies } from "react-cookie";
import axiosInstance from "../../api.config.ts";

export default function Navbar() {
  const { user, loggedIn, setLoggedIn } = useAuthentication();
  const [cookies, setCookies] = useCookies(["access_token"]);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const logOut = () => {
    axiosInstance.delete("/api/session", { withCredentials: true }).then(() => {
      setCookies("access_token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      });
      setLoggedIn(false);
      navigate("/");
    });
  };

  useEffect(() => {
    console.log("Logged in:", loggedIn);
  }, [loggedIn, cookies.access_token]);

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query) navigate(`/questions/search/${query}`);
    else navigate(`/questions/`);
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <div className="fixed w-full border-b border-gray-200 bg-white z-50 border-t-[3px] border-t-[#e7700d]">
      <header className="flex items-center gap-4 justify-between h-14 max-w-[1264px] m-auto">
        <Link
          to="/"
          className="text-xl flex items-center hover:bg-gray-200 h-full px-2 rounded"
        >
          <IconBrandStackoverflow width={32} height={32} color="#e7700d" />
          fake <span className="font-bold ml-0.5">overflow</span>
        </Link>
        <div className="flex items-center flex-grow">
          <div className="border p-2 rounded-md border-gray-300 w-full flex gap-1 focus-within:outline-double outline-blue-200">
            <label htmlFor="search">
              <IconSearch width={18} color="gray" />
            </label>
            <form onSubmit={handleSearchSubmit} className="w-full">
              <input
                type="text"
                id="search"
                placeholder="Search..."
                className="w-full relative outline-none"
                onChange={(e) => handleSearch(e)}
              />
            </form>
          </div>
        </div>
        {!loggedIn ? (
          <div>
            <ol className="flex gap-2">
              <NavLink
                to="/users/login"
                className="border border-blue-700 p-2 rounded text-blue-600 hover:bg-blue-200 focus:outline-none"
              >
                Log In
              </NavLink>
              <NavLink
                to="/users/signup"
                className="bg-blue-500 p-2 rounded text-white hover:bg-blue-600"
              >
                Sign Up
              </NavLink>
            </ol>
          </div>
        ) : (
          <>
            <button
              onClick={logOut}
              className="bg-blue-500 p-2 rounded text-white hover:bg-blue-600"
            >
              Log Out
            </button>
            <Link
              to={`/users/${user?.id}`}
              className="text-lg text-[#e7700d] hover:text-[#c4610e]"
            >
              {user?.username}
            </Link>
          </>
        )}
      </header>
    </div>
  );
}
