import FormModal from "@/app/ui/FormModal";
import Pagination from "@/app/ui/Pagination";
import Table from "@/app/ui/Table";
import TableSearch from "@/app/ui/TableSearch";
import { role } from "@/lib/data";
import Image from "next/image";
import { redirect } from "next/navigation";
import AppPagination from "@/app/ui/Pagination";
import ErrorPage from "@/app/ui/ErrorPage";
import { getClasses, getTeachers } from "@/app/lib/data";

export const dynamic = "force-dynamic";

type Class = {
  id: number;
  classId: string;
  documentId: string;
  name: string;
  capacity: number;
  grade: number;
  // teachers: { userName: string }[];
  classTeacher: { userName: string };
  studentsCount?: number;
};

const columns = [
  {
    header: "Class Name",
    accessor: "name",
    className: "pl-2",
  },
  {
    header: "ClassId",
    accessor: "classId",
    className: "hidden md:table-cell text-center",
  },
  {
    header: "Capacity",
    accessor: "capacity",
    className: "hidden md:table-cell text-center",
  },
  {
    header: "Grade",
    accessor: "grade",
    className: "hidden md:table-cell text-center",
  },
  {
    header: "Supervisor",
    accessor: "supervisor",
    className: "hidden md:table-cell text-center",
  },
  {
    header: "Actions",
    accessor: "action",
    className: "table-cell text-center",
  },
];

const ClassListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const apiResponse = await getClasses(page);
  if (!apiResponse.meta) {
    return <ErrorPage code={apiResponse.errorCode ?? 500} />;
  }
  const count = apiResponse.meta.pagination.total;
  const classesData = apiResponse.data;
  // console.log("these are data in classes page:", classesData);
  const teachersRes = await getTeachers();
  const teachers = teachersRes.data;
  if (classesData.length === 0 && page > 1) {
    const params = new URLSearchParams(searchParams as any);
    params.set("page", (page - 1).toString());
    redirect(`/list/classes?${params.toString()}`);
  }

  const renderRow = (item: Class) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="table-cell px-2 py-5">{item.name}</td>
      <td className="hidden md:table-cell px-2 text-center max-w-[50px] truncate">
        {item.classId}
      </td>
      <td className="hidden md:table-cell px-2 text-center max-w-[50px] truncate">
        {item.studentsCount ?? 0} / {item.capacity}
      </td>
      <td className="hidden md:table-cell px-2 text-center max-w-[50px] truncate">
        {item.grade}
      </td>
      <td className="hidden md:table-cell px-2 text-center max-w-[50px] truncate">
        {item.classTeacher ? item.classTeacher.userName : "There isn't a supervisor yet"}
      </td>
      <td className="table-cell text-center px-2">
        <div className="flex items-center justify-center gap-2">
          <FormModal
            table="class"
            type="update"
            data={item}
            teachers={teachers}
          />
          {role === "admin" && (
            <>
              <FormModal table="class" type="delete" id={item.documentId} />
            </>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 flex flex-col justify-between items-center">
      <div className={`w-full ${classesData.length > 0 ? "" : "h-full"}`}>
        {/* TOP */}
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold px-2">
            All Classe's
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
                <FormModal table="class" type="create" teachers={teachers} />
              )}
            </div>
          </div>
        </div>
        {/* LIST */}
        <Table columns={columns} renderRow={renderRow} data={classesData} />
      </div>
      {/* PAGINATION */}
      <div className="mt-5">
        <AppPagination count={count} />
      </div>
    </div>
  );
};

export default ClassListPage;
