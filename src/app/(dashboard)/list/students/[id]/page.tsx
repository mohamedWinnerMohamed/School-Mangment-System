import Announcements from "@/app/ui/Announcements";
import BigCalendar from "@/app/ui/BigCalender";
import Performance from "@/app/ui/Performance";
import Image from "next/image";
import Link from "next/link";
import { getClasses, getStudent, getParents } from "@/app/lib/data";
import { notFound } from "next/navigation";
import { role } from "@/lib/data";
import FormModal from "@/app/ui/FormModal";

const SingleStudentPage = async ({ params }: { params: { id: string } }) => {
  const student = await getStudent(params.id);
  const classesData = await getClasses();
  const parentsRes = await getParents();
  const parentsData = parentsRes.data;
  console.log(student);
  if (!student) {
    return notFound();
  }

  return (
    <div className="flex-1 p-4 flex flex-col gap-4 xl:flex-row">
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <div className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4">
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
                  <h1 className="text-xl font-semibold">{student.firstName}</h1>
                  <h3 className="text-gray-500 text-xs">
                    {student.userName} <span className="bg-slate-300 px-[0.20rem] rounded">
                      #{student.studentId}
                    </span>
                    
                  </h3>
                </div>
                {role === "admin" && (
                  <div className="">
                    <FormModal
                      table="student"
                      type="update"
                      data={student}
                      classes={classesData}
                      parent={parentsData}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-start flex-col md:flex-row lg:flex-col 2xl:flex-row gap-7 2xl:gap-8  text-xs font-medium">
                <div className="flex flex-col gap-7 w-full md:w-1/2 lg:w-full 2xl:w-1/2 ">
                  <div className="w-full flex items-center gap-2">
                    <Image src="/phone.png" alt="" width={14} height={14} />
                    <span>{student.phoneNumber}</span>
                  </div>
                  <div className="w-full flex items-center gap-2">
                    <Image src="/mail.png" alt="" width={14} height={14} />
                    <span>
                      {student.email && student.email.length > 18
                        ? student.email.slice(0, 18) + ".."
                        : student.email}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-7 w-full md:w-1/2 lg:w-full 2xl:w-1/2">
                  <div className="w-full flex items-center gap-2">
                    <Image src="/date.png" alt="" width={14} height={14} />
                    <span>
                      {new Intl.DateTimeFormat("en-GB").format(
                        new Date(student.birthday)
                      )}
                    </span>
                  </div>

                  <div className="w-full flex items-center gap-2">
                    <Image src="/blood.png" alt="" width={14} height={14} />
                    <span>{student.bloodType}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
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
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
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
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
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
            </div>
            {/* CARD */}
            <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%]">
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
            </div>
          </div>
        </div>
        {/* BOTTOM */}
        <div className="mt-4 bg-white rounded-md p-4 h-[800px]">
          <h1>Student&apos;s Schedule</h1>
          <BigCalendar />
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
        <Performance />
        <Announcements />
      </div>
    </div>
  );
};

export default SingleStudentPage;
