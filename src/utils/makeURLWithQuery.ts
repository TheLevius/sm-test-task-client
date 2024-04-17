import { ParsedUrlQuery } from "node:querystring";

export const makeURLWithQuery = (host: string, queryParams: ParsedUrlQuery, available: string[] = []): URL => {
  const url = new URL(host);
  available.forEach((key) => {
    if (typeof queryParams?.[key] !== "undefined" && !Array.isArray(queryParams[key])) {
      url.searchParams.append(key, queryParams[key] as string);
    }
  });
  return url;
};
