import { getParents, getStudents } from "@/app/lib/data";
import ErrorPage from "@/app/ui/ErrorPage";
import FormModal from "@/app/ui/FormModal";
import AppPagination from "@/app/ui/Pagination";
import Table from "@/app/ui/Table";
import TableSearch from "@/app/ui/TableSearch";
import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export const dynamic = "force-dynamic";

type Parent = {
  parentId: number;
  documentId: string;
  userName: string;
  email: string;
  phoneNumber: string;
  address: string;
  students: { userName: string }[];
};

const columns = [
  {
    header: "Info",
    accessor: "info",
    className: "pl-2",
  },
  {
    header: "Parent ID",
    accessor: "parentId",
    className: "hidden md:table-cell text-center",
  },
  {
    header: "Student/s Name/s",
    accessor: "studentName",
    className: "hidden md:table-cell text-center",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden md:table-cell text-center",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden md:table-cell text-center",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "table-cell text-center",
  },
];

const ParentsListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const apiResponse = await getParents(page);

  if (!apiResponse.meta) {
    return <ErrorPage code={apiResponse.errorCode ?? 500} />;
  }

  const parentsData = apiResponse.data;
  const count = apiResponse.meta.pagination.total;
  const studentsRes = await getStudents();
  const students = studentsRes.data;

  console.log("StudentsNames(from parents page):", students);
  if (parentsData.length === 0 && page > 1) {
    const params = new URLSearchParams(searchParams as any);
    params.set("page", (page - 1).toString());
    redirect(`/list/parents?${params.toString()}`);
  }

  const renderRow = (item: Parent) => (
    <tr
      key={item.parentId}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-1 md:gap-3 py-3 px-2">
        {
          <Image
            src="/profile.png"
            alt="picture of teacher"
            width={30}
            height={30}
            className=" rounded-full object-cover"
          />
        }
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.userName}</h3>
          <p className="text-xs text-gray-500">{item.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell px-2 text-center max-w-[50px] truncate">
        {item.parentId}
      </td>
      <td className="hidden md:table-cell px-2 text-center max-w-[100px] truncate">
        {item.students?.length > 0
          ? item.students?.map((s) => s.userName).join(", ")
          : "There isn't a student yet"}
      </td>
      <td className="hidden md:table-cell px-2 text-center max-w-[50px] truncate">
        {item.phoneNumber}
      </td>
      <td className="hidden md:table-cell px-2 text-center max-w-[50px] truncate">
        {item.address}
      </td>
      <td className="table-cell text-center px-2">
        <div className="flex items-center justify-center gap-2">
          <Link href={`/list/parents/${item.documentId}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <img
                width="20"
                height="20"
                src="https://img.icons8.com/material-outlined/24/visible--v1.png"
                alt="visible--v1"
              />
            </button>
          </Link>
          {role === "admin" && (
            <>
              <FormModal table="parent" type="delete" id={item.documentId} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 flex flex-col justify-between items-center">
      <div className={`w-full ${parentsData.length > 0 ? "" : "h-full"}`}>
        {/* TOP */}
        <div className="flex items-center justify-between w-full">
          <h1 className="hidden md:block text-lg font-semibold px-2">
            All Parent&apos;s
          </h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />
            <div className="flex items-center gap-4 self-end">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                <img
                  width="22"
                  height="22"
                  src="https://img.icons8.com/fluency-systems-filled/48/vertical-settings-mixer.png"
                  alt="vertical-settings-mixer"
                />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                <img
                  width="20"
                  height="16"
                  src="https://img.icons8.com/plumpy/24/generic-sorting.png"
                  alt="generic-sorting"
                />
              </button>
              {role === "admin" && (
                <FormModal table="parent" type="create" students={students} />
              )}
            </div>
          </div>
        </div>
        {/* LIST */}
        <Table columns={columns} renderRow={renderRow} data={parentsData} />
      </div>
      {/* PAGINATION */}
      <div className="mt-5">
        <AppPagination count={count} />
      </div>
    </div>
  );
};

export default ParentsListPage;
