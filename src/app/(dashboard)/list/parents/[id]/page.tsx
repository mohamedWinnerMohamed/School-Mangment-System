import Announcements from "@/app/ui/Announcements";
import Image from "next/image";
import Link from "next/link";
import { getStudents, getParent, getParents } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { role } from "@/lib/data";
import FormModal from "@/app/ui/FormModal";

const SingleParentPage = async ({ params }: { params: { id: string } }) => {
  const parent = await getParent(params.id);
  // const classesData = await getClasses();
  const studentsRes = await getStudents();
  const studentsData = studentsRes.data;
  console.log(parent);
  if (!parent) {
    return notFound();
  }

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4 ">
            <div className="w-1/3">
              <Image
                src={"/profile.png"}
                alt=""
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-start gap-6">
                <div className="flex flex-col ">
                  <h1 className="text-xl font-semibold">
                    {parent.firstName + " " + parent.lastName}
                  </h1>
                  <h3 className="text-gray-500 text-xs">
                    {parent.userName}{" "}
                    <span className="bg-slate-300 px-[0.20rem] rounded">
                      #{parent.parentId}
                    </span>
                  </h3>
                </div>
                {role === "admin" && (
                  <div className="">
                    <FormModal
                      table="parent"
                      type="update"
                      data={parent}
                      students={studentsData}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-start justify-start flex-col md:flex-row  2xl:flex-row gap-7 2xl:gap-8  text-xs font-medium">
                <div className="flex flex-col gap-7 w-full md:w-1/2 lg:w-full 2xl:w-1/2 ">
                  <div className="w-full flex items-center gap-2">
                    <Image src="/phone.png" alt="" width={14} height={14} />
                    <span>{parent.phoneNumber}</span>
                  </div>
                  <div className="w-full flex items-center gap-2">
                    <Image src="/mail.png" alt="" width={14} height={14} />
                    <span>
                      {parent.email && parent.email.length > 18
                        ? parent.email.slice(0, 18) + ".."
                        : parent.email}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-7 w-full md:w-1/2 lg:w-full 2xl:w-1/2">
                  <div className="w-full flex items-center gap-2">
                    {parent.gender === "male" ? (
                      <>
                        <img
                          width="17"
                          height="17"
                          src="https://img.icons8.com/material-rounded/24/person-male.png"
                          alt="person-male"
                        />
                        <span>Father</span>
                      </>
                    ) : (
                      <>
                        <img
                          width="17"
                          height="17"
                          src="https://img.icons8.com/ios-filled/50/person-female--v2.png"
                          alt="person-female--v2"
                        />
                        <span>Mother</span>
                      </>
                    )}
                  </div>
                  <div className="w-full flex items-center gap-2 ">
                    <Image src="/blood.png" alt="" width={16} height={16} />
                    <span >{parent.bloodType}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          {/* <div className="flex-1 flex gap-4 justify-between flex-wrap"> */}
          {/* CARD */}
          {/* <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleAttendance.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">90%</h1>
                <span className="text-sm text-gray-400">Attendance</span>
              </div>
            </div> */}
          {/* CARD */}
          {/* <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleBranch.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">6th</h1>
                <span className="text-sm text-gray-400">Grade</span>
              </div>
            </div> */}
          {/* CARD */}
          {/* <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleLesson.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">18</h1>
                <span className="text-sm text-gray-400">Lessons</span>
              </div>
            </div> */}
          {/* CARD */}
          {/* <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
              <Image
                src="/singleClass.png"
                alt=""
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <div className="">
                <h1 className="text-xl font-semibold">6A</h1>
                <span className="text-sm text-gray-400">Class</span>
              </div>
            </div> */}
          {/* </div> */}
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-fit">
          <h1 className="ml-1">{parent.students.length > 1 ?"Students Names" : "Student Name"}</h1>
          {/* <BigCalendar /> */}

          {parent.students?.length > 0 ? (
            <div className="">
              {parent.students?.map(
                (s: {
                  userName: string;
                  studentId: string;
                  email: string;
                  grade: string;
                  phoneNumber: string;
                }) => (
                  <div className="bg-slate-100 mt-4 rounded p-1 min-w-full overflow-auto">
                    <div className="flex items-center py-3 px-2">
                      <div className="text-left min-w-[150px]  ">
                        <p className="w-[90%] truncate">
                          U/N:
                          <span className="text-gray-600"> {s.userName}</span>
                        </p>
                      </div>
                      <div className="text-left min-w-[80px] ">
                        <p className="">
                          {" "}
                          ID:
                          <span className="text-gray-600"> {s.studentId}</span>
                        </p>
                      </div>
                      <div className="text-left min-w-[250px] ">
                        <p className="w-[90%] truncate">
                          {" "}
                          E-mail:
                          <span className="text-gray-600"> {s.email}</span>
                        </p>
                      </div>
                      <div className="text-left min-w-[100px] ">
                        <p className="">
                          Grade:{" "}
                          <span className="text-gray-600"> {s.grade}</span>
                        </p>
                      </div>
                      <div className="text-left min-w-[150px]">
                        <p>
                          P/N:
                          <span className="text-gray-600">
                            {" "}
                            {s.phoneNumber}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            "There isn't a student yet"
          )}
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="bg-white p-4 rounded-md">
          <h1 className="text-xl font-semibold">Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            <Link className="p-3 rounded-md bg-lamaSkyLight" href="/">
              Student&apos;s Lessons
            </Link>
            <Link className="p-3 rounded-md bg-lamaPurpleLight" href="/">
              Student&apos;s Teachers
            </Link>
            <Link className="p-3 rounded-md bg-pink-50" href="/">
              Student&apos;s Exams
            </Link>
            <Link className="p-3 rounded-md bg-lamaSkyLight" href="/">
              Student&apos;s Assignments
            </Link>
            <Link className="p-3 rounded-md bg-lamaYellowLight" href="/">
              Student&apos;s Results
            </Link>
          </div>
        </div>
        {/* <Performance /> */}
        <Announcements />
      </div>
    </div>
  );
};

export default SingleParentPage;
