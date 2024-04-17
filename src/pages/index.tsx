import Head from "next/head";
import { Inter } from "next/font/google";
import Table from "react-bootstrap/Table";
import { Alert, Container } from "react-bootstrap";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { makeURLWithQuery } from "@/utils/makeURLWithQuery";
import { availableQueryParams, defaults, makeUsersRequest, usersHostname } from "@/dal/users.api";
import { useBatchState } from "@/hooks/useBatchState";

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
  const { page, limit, totalCount, statusCode, users, pageLoading, setPageLoading, setLimit, setAllResponses } =
    useBatchState(props);
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

          {/*TODO add pagination*/}
        </Container>
      </main>
    </>
  );
}
