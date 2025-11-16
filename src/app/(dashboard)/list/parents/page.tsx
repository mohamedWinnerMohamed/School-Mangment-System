import FormModal from "@/app/ui/FormModal";
import Pagination from "@/app/ui/Pagination";
import Table from "@/app/ui/Table";
import TableSearch from "@/app/ui/TableSearch";
import { parentsData, role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type parent = {
  id: number;
  students: string[];
  name: string;
  email?: string;
  phone?: string;
  address: string;
};

const columns = [
  {
    header: "Info",
    accessor: "info",
    className: "pl-2",
  },
  {
    header: "Student Name",
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
    className: "hidden lg:table-cell text-center",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "text-center",
  },
];

function ParentsListPage() {
  const renderRow = (item: parent) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 py-4">
        <div className="flex flex-col px-2">
          <h3 className="font-semibold ">{item.name}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell text-center">
        {item.students.join(",")}
      </td>
      <td className="hidden md:table-cell text-center">{item.phone}</td>
      <td className="hidden lg:table-cell text-center">{item.address}</td>
      <td>
        <div className="flex items-center justify-center gap-2">
          {/* <Link href={`/list/teachers/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/edit.png" alt="" width={16} height={16} />
            </button>
          </Link> */}
          {role === "admin" && (
            // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
            //   <Image src="/delete.png" alt="" width={16} height={16} />
            // </button>
            <>
              <FormModal table="parent" type="update" data={item} />
              <FormModal table="parent" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </tr>
  );
  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 ">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold px-2">
          All Parent's
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              // <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              //   <Image src="/plus.png" alt="" width={14} height={14} />
              // </button>
              <FormModal table="parent" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={parentsData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
}

export default ParentsListPage;
