import { User } from "@prisma/client";
import { fetchUsersCount, handleFetchUsers, Response } from "onboarding/app/actions";
import { useEffect, useState } from "react";

// hook to fetch users from server action fetchUsers and handle pagination
export function useUsers(page: number, perPage: number) {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    fetchUsersCount().then((response: number) => {
      setUserCount(response ?? 0);
    })
  }, []);

  useEffect(() => {
    handleFetchUsers(page, perPage)
      .then((response: Response<User[]>) => {
        console.log("🚀 ~ .then ~ response.data:", response.data)
        setUsers(response.data ?? []);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error);
        setIsLoading(false);
      });
  }, [page, perPage]);

  return { users, isLoading, error, userCount };
}