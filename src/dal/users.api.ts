import { TGetServerSideProps, UsersOffset } from "@/pages";
import { makeURLWithQuery } from "@/utils/makeURLWithQuery";
import { ParsedUrlQuery } from "node:querystring";

export const usersHostname = "http://localhost:3000/users";

export const defaults: UsersOffset = {
  page: 1,
  limit: 20,
  totalCount: 0,
  users: [],
};

export const availableQueryParams = ["page", "limit"];

export const getContextUsersOffset = async (query: ParsedUrlQuery): Promise<TGetServerSideProps> => {
  const queryParams = {
    page: query?.page ?? String(defaults.page),
    limit: query?.limit ?? String(defaults.limit),
  };
  const url = makeURLWithQuery(usersHostname, queryParams, availableQueryParams);
  try {
    const res = await fetch(url);

    if (!res.ok) {
      return { ...defaults, statusCode: res.status };
    }

    const data: UsersOffset = await res.json();
    return { statusCode: res.status, ...data };
  } catch (err) {
    console.error(err);
    return { ...defaults, statusCode: 500 };
  }
};
export const getOffsetUsers = async (page: number, limit: number): Promise<TGetServerSideProps> => {
  const queryParams = { page: String(page), limit: String(limit) };
  const url = makeURLWithQuery(usersHostname, queryParams, availableQueryParams);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const data: UsersOffset = await res.json();
    return { ...data, statusCode: res.status };
  } catch (err) {
    console.error(err);
    throw new Error(err as string);
  }
};
