import DueApi from "@/api/dueApi";
import Due from "@/models/due";
import { UseQueryResult } from "@tanstack/react-query";
import { createContext } from "react";
type FilterParams = Parameters<typeof DueApi.getDues>[0];
interface IAdminDuesContext {
  query: UseQueryResult<
    {
      count: number;
      pages: number;
      dues: Map<number, Due>;
    },
    unknown
  >;
  filters: FilterParams;
  setFilters: React.Dispatch<
    React.SetStateAction<FilterParams>
  >;
}

//@ts-expect-error 431
export const adminDuesContext = createContext<IAdminDuesContext>(null);
