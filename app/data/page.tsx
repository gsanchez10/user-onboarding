"use client";
import { useState } from "react";
import { Pagination, Table } from "flowbite-react";
import { User } from "@prisma/client";
import Loading from "onboarding/components/Loading";
import useFields from "onboarding/hooks/useFields";
import { useUsers } from "onboarding/hooks/useUsers";

const PAGE_SIZE = 20;

export default function Data() {
  const [currentPage, setCurrentPage] = useState(1);
  const onPageChange = (page: number) => setCurrentPage(page);
  const { fields, isLoading: isLoadingFields } = useFields();

  const { users, isLoading: isLoadingUsers, userCount } = useUsers(currentPage, PAGE_SIZE);
  const pages = Math.ceil(userCount / PAGE_SIZE);
  console.log("🚀 ~ Data ~ pages:", pages)
  if (isLoadingFields || isLoadingUsers) {
    return <Loading />;
  }
  return <div>
    <Table>
      <Table.Head>
        <Table.HeadCell>Email</Table.HeadCell>
        {fields.map((field) => <Table.HeadCell key={field.id}>{field.label}</Table.HeadCell>)}
      </Table.Head>
      <Table.Body>
        {users.map((user) => <Table.Row key={user.id}>
          <Table.Cell>{user.email}</Table.Cell>
          {fields.map((field) => {
            const value = user[field.name as keyof User];
            return <Table.Cell key={field.id}>{value instanceof Date ? `${value.getMonth()}/${value.getDate()}/${value.getFullYear()}` : value}</Table.Cell>
          })}
        </Table.Row>
        )}
      </Table.Body>
    </Table>
    <Pagination currentPage={currentPage} totalPages={pages} onPageChange={onPageChange} />
  </div>
}