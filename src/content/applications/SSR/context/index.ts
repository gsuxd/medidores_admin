import SSRApi from "@/api/ssrAPI";
import SSR from "@/models/ssr";
import { UseQueryResult } from "@tanstack/react-query";
import { createContext } from "react";
type FilterParams = Parameters<typeof SSRApi.list>[0];
interface ISSRContext {
  query: UseQueryResult<
    {
      count: number;
      pages: number;
      ssr: Map<number, SSR>;
    },
    unknown
  >;
  filters: FilterParams;
  setFilters: React.Dispatch<
    React.SetStateAction<FilterParams>
  >;
}

//@ts-expect-error 431
export const ssrContext = createContext<ISSRContext>(null);
