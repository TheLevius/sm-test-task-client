import Head from "next/head";
import { Inter } from "next/font/google";
import Table from "react-bootstrap/Table";
import Pagination from "react-bootstrap/Pagination";
import Form from "react-bootstrap/Form";
import { Alert, Container } from "react-bootstrap";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getContextUsersOffset, getOffsetUsers } from "@/dal/users.api";
import { useBatchState } from "@/hooks/useBatchState";
import { makeDisplayPageNumbers } from "@/utils/makeDisplayNumbers";
import { ChangeEvent, useEffect, useState } from "react";
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

export type TGetServerSideProps = UsersOffset & StatusCode;
export type StatusCode = { statusCode: number };
export type UsersOffset = {
  users: TUserItem[];
  page: number;
  limit: number;
  totalCount: number;
};

const defaultPageRange = 10;

export const getServerSideProps = (async (ctx: GetServerSidePropsContext): Promise<{ props: TGetServerSideProps }> => {
  const response = await getContextUsersOffset(ctx.query);
  return { props: response };
}) satisfies GetServerSideProps<TGetServerSideProps>;

export default function Home(props: TGetServerSideProps) {
  const router = useRouter();

  const [pageLoading, setPageLoading] = useState(false);
  const { page, limit, totalCount, statusCode, users, setAllResponses } = useBatchState(props);

  const totalPages = Math.ceil(totalCount / limit);
  const displayPageRange = totalPages < defaultPageRange ? totalPages : defaultPageRange;
  const displayPages = makeDisplayPageNumbers(page, totalPages, displayPageRange);

  const onChangeLimitHandle = async (e: ChangeEvent<HTMLSelectElement>) => {
    const newLimit = Number(e.target.value);
    const resetPageNumber = 1;
    getAndSetUsersOffset(resetPageNumber, newLimit);
  };
  const changePage = async (pageNumber: number) => {
    getAndSetUsersOffset(pageNumber, limit);
  };

  const getAndSetUsersOffset = async (page: number, limit: number) => {
    try {
      setPageLoading(true);
      const data = await getOffsetUsers(page, limit);
      setAllResponses(data);
    } catch (err) {
      console.error(err);
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
            onChange={onChangeLimitHandle}
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
            <Pagination.First disabled={pageLoading || page === 1} onClick={() => changePage(1)} />
            <Pagination.Prev disabled={pageLoading || page === 1} onClick={() => changePage(page - 1)} />
            {displayPages.map((pageNumber) => (
              <Pagination.Item
                disabled={pageLoading}
                onClick={() => changePage(pageNumber)}
                key={pageNumber}
                active={pageNumber === page}
              >
                {pageNumber}
              </Pagination.Item>
            ))}
            <Pagination.Next disabled={pageLoading || page === totalPages} onClick={() => changePage(page + 1)} />
            <Pagination.Last disabled={pageLoading || page === totalPages} onClick={() => changePage(totalPages)} />
          </Pagination>
        </Container>
      </main>
    </>
  );
}
