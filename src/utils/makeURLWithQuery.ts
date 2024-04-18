import { ParsedUrlQuery } from "node:querystring";

export const makeURLWithQuery = (
  host: string,
  queryParams: ParsedUrlQuery,
  available: string[] = ["page", "limit"]
): URL => {
  const url = new URL(host);
  available.forEach((key) => {
    if (typeof queryParams?.[key] !== "undefined" && !Array.isArray(queryParams?.[key])) {
      url.searchParams.append(key, String(queryParams[key]));
    }
  });
  return url;
};
