import { TGetServerSideProps } from "@/pages";

export const usersHostname = "http://localhost:3000/users";

export const defaults: Omit<TGetServerSideProps, "statusCode"> = {
  page: 1,
  limit: 20,
  totalCount: 0,
  users: [],
};

export const availableQueryParams = ["page", "limit"];

export const makeUsersRequest = async (url: URL, initValues = defaults): Promise<TGetServerSideProps> => {
  try {
    const res = await fetch(url, {
      method: "GET",
    });

    if (!res.ok) {
      return { statusCode: res.status, ...initValues };
    }

    const data: Omit<TGetServerSideProps, "statusCode"> = await res.json();
    return { statusCode: res.status, ...data };
  } catch (err) {
    return { statusCode: 500, ...initValues };
  }
};
