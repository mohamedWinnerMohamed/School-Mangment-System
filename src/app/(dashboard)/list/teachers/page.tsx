import FormModal from "@/app/ui/FormModal";
import Pagination from "@/app/ui/Pagination";
import Table from "@/app/ui/Table";
import TableSearch from "@/app/ui/TableSearch";
import { role, teachersData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { getClasses, getTeachers, getSubjects } from "@/app/lib/data";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const dynamic = "force-dynamic";

type Teacher = {
  id: number;
  teacherId: string;
  userName: string;
  email?: string;
  photo: string;
  phoneNumber: string;
  subjects: { name: string }[];
  classes: { name: string }[];
  address: string;
  profilePicture: any;
  birthday: string;
};

const columns = [
  {
    header: "Info",
    accessor: "info",
    className: "pl-2",
  },
  {
    header: "Teacher ID",
    accessor: "teacherId",
    className: "hidden md:table-cell",
  },
  {
    header: "Subjects",
    accessor: "subjects",
    className: "hidden md:table-cell",
  },
  {
    header: "Classes",
    accessor: "classes",
    className: "hidden md:table-cell",
  },
  {
    header: "Phone",
    accessor: "phone",
    className: "hidden md:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const TeacherListPage = async () => {
  const STRAPI_URL = process.env.STRAPI_API_URL || "http://localhost:1337";
  const teachers = await getTeachers();
  const classes = await getClasses();
  const subjects = await getSubjects();

  const renderRow = (item: Teacher) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 py-4 px-2">
        {
          <Image
            src="/profile.png"
            alt="picture of teacher"
            width={40}
            height={40}
            className=" rounded-full object-cover"
          />
        }
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.userName}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.teacherId}</td>
      <td className="hidden md:table-cell">
        {item.subjects?.map((sub) => sub.name).join(",")}
      </td>
      <td className="hidden md:table-cell">
        {item.classes.map((cls) => cls.name).join(",")}
      </td>
      <td className="hidden md:table-cell">{item.phoneNumber}</td>
      <td className="hidden md:table-cell">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/list/teachers/${item.id}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <FormModal table="teacher" type="delete" id={item.id} />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold px-2">
          All Teachers
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end ">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              <FormModal
                table="teacher"
                type="create"
                classes={classes}
                subjects={subjects}
              />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={teachers} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default TeacherListPage;
