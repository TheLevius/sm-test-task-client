import Head from "next/head";
import { Inter } from "next/font/google";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import Form from "react-bootstrap/Form";
import { Alert, Container } from "react-bootstrap";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { makeURLWithQuery } from "@/utils/makeURLWithQuery";
import { availableQueryParams, defaults, makeUsersRequest, usersHostname } from "@/dal/users.api";
import { useBatchState } from "@/hooks/useBatchState";
import { makeDisplayPageNumbers } from "@/utils/makeDisplayNumbers";
import { useEffect } from "react";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

type TUserItem = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  updatedAt: string;
};

export type TGetServerSideProps = {
  statusCode: number;
  users: TUserItem[];
  page: number;
  limit: number;
  totalCount: number;
};

const makeQueryParams = (page: number, limit: number) => ({ page: String(page), limit: String(limit) });

export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  const url = makeURLWithQuery(usersHostname, ctx.query, availableQueryParams);

  const defaultsWithCtx = {
    ...defaults,
    page: Number(ctx.query?.page) ?? 1,
    limit: Number(ctx.query?.limit) ?? 20,
  };

  const response = await makeUsersRequest(url, defaultsWithCtx);
  return { props: response };
}) satisfies GetServerSideProps<TGetServerSideProps>;

export default function Home(props: TGetServerSideProps) {
  const {
    page,
    limit,
    totalCount,
    statusCode,
    users,
    pageLoading,
    setPageLoading,
    setPage,
    setLimit,
    setAllResponses,
  } = useBatchState(props);

  const router = useRouter();

  const totalPages = Math.ceil(totalCount / limit);
  const displayPageRange = totalPages < 10 ? totalPages : 10;
  const displayPages = makeDisplayPageNumbers(page, totalPages, displayPageRange);

  const changePageRequest = async (pageNumber: number) => {
    const queryParams = makeQueryParams(pageNumber, limit);
    const url = makeURLWithQuery(usersHostname, queryParams, availableQueryParams);
    try {
      setPageLoading(true);
      const data = await makeUsersRequest(url, {
        page: pageNumber,
        limit,
        users,
        totalCount,
      });
      setAllResponses(data);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    router.push(
      {
        query: { ...router.query, page, limit },
      },
      undefined,
      { shallow: true }
    );
  }, [page, limit]);

  useEffect(() => {
    changePageRequest(page);
  }, [limit]);

  if (statusCode !== 200) {
    return <Alert variant={"danger"}>Ошибка {statusCode} при загрузке данных</Alert>;
  }

  if (statusCode !== 200) {
    return <Alert variant={"danger"}>Ошибка {statusCode} при загрузке данных</Alert>;
  }

  return (
    <>
      <Head>
        <title>Тестовое задание</title>
        <meta name="description" content="Тестовое задание" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={inter.className}>
        <Container>
          <h1 className={"mb-5"}>Пользователи</h1>
          <Form.Select
            disabled={pageLoading}
            value={limit}
            onChange={(v) => {
              setPage(1);
              setLimit(Number(v.target.value));
            }}
            aria-label="Default select example"
            style={{ marginBottom: "10px", float: "right" }}
          >
            <option value="20">20</option>
            <option value="40">40</option>
            <option value="100">100</option>
            <option value="1500">1500</option>
          </Form.Select>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Имя</th>
                <th>Фамилия</th>
                <th>Телефон</th>
                <th>Email</th>
                <th>Дата обновления</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.firstname}</td>
                  <td>{user.lastname}</td>
                  <td>{user.phone}</td>
                  <td>{user.email}</td>
                  <td>{user.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            <Pagination.First disabled={pageLoading || page === 1} onClick={() => changePageRequest(1)} />
            <Pagination.Prev disabled={pageLoading || page === 1} onClick={() => changePageRequest(page - 1)} />
            {displayPages.map((pageNumber) => (
              <Pagination.Item
                disabled={pageLoading}
                onClick={() => changePageRequest(pageNumber)}
                key={pageNumber}
                active={pageNumber === page}
              >
                {pageNumber}
              </Pagination.Item>
            ))}
            <Pagination.Next
              disabled={pageLoading || page === totalPages}
              onClick={() => changePageRequest(page + 1)}
            />
            <Pagination.Last
              disabled={pageLoading || page === totalPages}
              onClick={() => changePageRequest(totalPages)}
            />
          </Pagination>
        </Container>
      </main>
    </>
  );
}
