import FormModal from "@/app/ui/FormModal";
import Table from "@/app/ui/Table";
import TableSearch from "@/app/ui/TableSearch";
import { role } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { getClasses, getTeachers, getSubjects } from "@/app/lib/data";
import { redirect } from "next/navigation";
import AppPagination from "@/app/ui/Pagination";
import ErrorPage from "@/app/ui/ErrorPage";

export const dynamic = "force-dynamic";

type Teacher = {
  id: number;
  documentId: string;
  teacherId: string;
  userName: string;
  email: string;
  phoneNumber: string;
  supervisingClass: string;
  subjects: { name: string }[];
  classes: { name: string }[];
  address: string;
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
    className: "hidden md:table-cell text-center",
  },
  {
    header: "Supervisor",
    accessor: "supervisor",
    className: "hidden md:table-cell text-center",
  },
  {
    header: "Subjects",
    accessor: "subjects",
    className: "hidden md:table-cell text-center",
  },
  {
    header: "Classes",
    accessor: "classes",
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

const TeacherListPage = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const apiResponse = await getTeachers(page);
  console.log("apiResponse:", apiResponse);
  if (!apiResponse.meta) {
    return <ErrorPage code={apiResponse.errorCode ?? 500} />;
  }

  const teachersData = apiResponse.data;
  console.log("teachersData from teachers page:", teachersData);
  const count = apiResponse.meta.pagination.total;
  const classesRes = await getClasses();
  const classes = classesRes.data;
  console.log("classes from teachers page:", classes);

  const subjectsResponse = await getSubjects("active");
  const subjects = subjectsResponse?.data || [];
  if (teachersData.length === 0 && page > 1) {
    const params = new URLSearchParams(searchParams as any);
    params.set("page", (page - 1).toString());
    redirect(`/list/teachers?${params.toString()}`);
  }

  const renderRow = (item: Teacher) => (
    <tr
      key={item.id}
      className="border-b border-gray-200 even:bg-slate-50 text-sm 
      hover:bg-lamaPurpleLight"
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
        {item.teacherId}
      </td>
      <td className="hidden md:table-cell px-2 text-center max-w-[50px] truncate">
        {item.supervisingClass || "ـ"}
      </td>
      <td className="hidden md:table-cell text-center px-2 max-w-[100px] truncate">
        {item.subjects?.map((sub) => sub.name).join(", ")}
      </td>
      <td className="hidden md:table-cell text-center px-2 max-w-[50px] truncate">
        {item.classes.map((cls) => cls.name).join(", ")}
      </td>
      <td className="hidden md:table-cell px-2 text-center max-w-[50px] truncate">
        {item.phoneNumber}
      </td>
      <td className="hidden md:table-cell px-2 text-center max-w-[100px] truncate">
        {item.address}
      </td>

      <td className="table-cell text-center px-2">
        <div className="flex items-center justify-center gap-2">
          <Link href={`/list/teachers/${item.documentId}`}>
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
            <FormModal table="teacher" type="delete" id={item.documentId} />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0 flex flex-col justify-between items-center">
      <div className={`w-full ${teachersData.length > 0 ? "" : "h-full"}`}>
        {/* TOP */}
        <div className="flex items-center justify-between w-full">
          <h1 className="hidden md:block text-lg font-semibold px-2">
            All Teacher&apos;s
          </h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />
            <div className="flex items-center gap-4 self-end ">
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
        <Table columns={columns} renderRow={renderRow} data={teachersData} />
      </div>

      {/* PAGINATION */}
      <div className="mt-5">
        <AppPagination count={count} />
      </div>
    </div>
  );
};

export default TeacherListPage;
