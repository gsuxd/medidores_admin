import BillsApi from "@/api/billsApi";
import Bill from "@/models/bill";
import { UseQueryResult } from "@tanstack/react-query";
import { createContext } from "react";
type filterParams = Parameters<typeof BillsApi.listBills>[0];
interface FilterParams extends filterParams {
  enabled?: boolean | null | undefined;
}
interface IUserBillsContext {
  query: UseQueryResult<
    {
      count: number;
      pages: number;
      bills: Map<number, Bill>;
    },
    unknown
  >;
  filters: FilterParams;
  setFilters: React.Dispatch<
    React.SetStateAction<FilterParams>
  >;
}

//@ts-expect-error 431
export const userBillsContext = createContext<IUserBillsContext>(null);
