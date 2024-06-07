import UsersApi from "@/api/usersApi";
import User from "@/models/user/user";
import { UseQueryResult } from "@tanstack/react-query";
import { createContext } from "react";
type filterParams = Parameters<typeof UsersApi.listUsers>[0];
interface FilterParams extends filterParams {
  enabled?: boolean | null | undefined;
}
interface IUsersContext {
  query: UseQueryResult<
    {
      count: number;
      users: Map<number, User>;
    },
    unknown
  >;
  filters: FilterParams;
  setFilters: React.Dispatch<
    React.SetStateAction<FilterParams>
  >;
}

//@ts-expect-error 431
export const usersContext = createContext<IUsersContext>(null);
