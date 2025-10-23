import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
type Props = {
  children: React.ReactNode;
};
const ReactQueryProvider = ({ children }: Props) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 1000 * 0, //0seconds
        refetchOnMount: "always",
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchInterval: 1000 * 0, //0 seconds
        refetchIntervalInBackground: false,
        gcTime: 1000 * 0,
      },
      mutations: {
        retry: 0,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default ReactQueryProvider;
