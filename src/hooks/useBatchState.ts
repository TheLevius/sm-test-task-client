import { TGetServerSideProps } from "@/pages";
import { useState } from "react";

export const useBatchState = (initial: TGetServerSideProps) => {
  const [page, setPage] = useState(initial.page);
  const [limit, setLimit] = useState(initial.limit);
  const [totalCount, setTotalCount] = useState(initial.totalCount);
  const [statusCode, setStatusCode] = useState(initial.statusCode);
  const [users, setUsers] = useState(initial.users);

  const setAllResponses = (newValues: TGetServerSideProps) => {
    setPage(newValues.page);
    setLimit(newValues.limit);
    setTotalCount(newValues.totalCount);
    setStatusCode(newValues.statusCode);
    setUsers(newValues.users);
  };

  return {
    page,
    limit,
    totalCount,
    statusCode,
    users,
    setPage,
    setLimit,
    setAllResponses,
  };
};
