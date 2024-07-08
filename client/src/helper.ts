import { useState, useEffect } from "react";
import axiosInstance from "../api.config.ts";
import User from "@server/types/user";

export const timeSinceDate = (dateString: Date) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears >= 1)
    return `${date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} ${date.getFullYear()} at ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
  else if (diffInDays >= 1)
    return `${date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })} at ${date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`;
  else if (diffInHours >= 1)
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  else if (diffInMinutes >= 1)
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  else
    return `${diffInSeconds} second${diffInSeconds > 1 || diffInSeconds == 0 ? "s" : ""} ago`;
};

export const validateHyperlinks = (text: string) => {
  const linkFormat = /\[([^\]]*)]\(([^)]*)\)/g;
  let matches;

  while ((matches = linkFormat.exec(text)) !== null) {
    const url = matches[2];
    console.log(url);
    if (
      url.trim() === "" ||
      (!url.startsWith("http://") && !url.startsWith("https://"))
    ) {
      return false;
    }
  }

  return true;
};

export const sluggify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");

export const useAuthentication = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/api/session", {
          withCredentials: true,
        });
        if (res.data) {
          setLoggedIn(true);
          setUser(res.data);
          if (res.data.isStaff) setIsAdmin(res.data.isAdmin);
        } else {
          setLoggedIn(false);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData().then();
  }, []);

  return { user, loggedIn, isAdmin, setLoggedIn, setIsAdmin, loading };
};
