import PaymentsApi from "@/api/paymentsApi";
import Payment from "@/models/payment";
import { UseQueryResult } from "@tanstack/react-query";
import { createContext } from "react";
type filterParams = Parameters<typeof PaymentsApi.list>[0];
interface FilterParams extends filterParams {
  enabled?: boolean | null | undefined;
}
interface IPaymentsContext {
  query: UseQueryResult<
    {
      count: number;
      payments: Map<number, Payment>;
    },
    unknown
  >;
  filters: FilterParams;
  setFilters: React.Dispatch<
    React.SetStateAction<FilterParams>
  >;
}

//@ts-expect-error 431
export const paymentsContext = createContext<IPaymentsContext>(null);
