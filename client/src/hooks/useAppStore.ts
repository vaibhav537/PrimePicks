import { useState, useEffect } from "react";

interface UserStructure {
  id: number;
  username: string;
  email: string;
  phonenumber: string;
  firstname: string;
  lastname: string;
  isadmin: boolean;
}

export const useUserDetails = () => {
  const [user, setUser] = useState<UserStructure | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          throw new Error(`No token available`);
        }
        const payload = JSON.parse(atob(token.split(".")[1]));
        const userID = payload.id;
        if (!userID) {
          throw new Error("User ID not Found");
        }

        const response = await fetch(`/api/users/${userID}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Include token for auth if needed
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user details");
        }

        const data: UserStructure = await response.json();

        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);
};
