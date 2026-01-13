const STRAPI_URL = process.env.STRAPI_API_URL || "http://localhost:1337";
const STRAPI_KEY = process.env.STRAPI_API_KEY;

export async function getTeachers(page?: number) {
  const ITEM_PER_PAGE = 15;
  let url;
  {
    page && page > 0
      ? (url = `${STRAPI_URL}/api/teachers?populate=*&pagination[page]=${page}&pagination[pageSize]=${ITEM_PER_PAGE}`)
      : (url = `${STRAPI_URL}/api/teachers?populate=*`);
  }
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_KEY}`,
    },
    cache: "no-store",
  };

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch teachers: ${res.status} ${res.statusText}`
      );
    }
    const data = await res.json();

    if (data.data && Array.isArray(data.data)) {
      await Promise.all(
        data.data.map(async (teacherItem: any) => {
          try {
            const teachersRes = await fetch(
              `${STRAPI_URL}/api/classes?filters[classTeacher][id][$eq]=${teacherItem.id}&pagination[pageSize]=1`,
              {
                headers: { Authorization: `Bearer ${STRAPI_KEY}` },
                cache: "no-store",
              }
            );

            if (teachersRes.ok) {
              const teacherData = await teachersRes.json();
              // console.log("teacherData", teacherData);
              teacherItem.supervisingClass = teacherData.data[0].name;
              
            } else {
              teacherItem.supervisingClass = "not supervising any class"
            }
          } catch (error) {
            console.log(error)
          }
        })
      );
    }

    return data;
  } catch (error) {
    console.error("Error fetching teachers from Strapi:", error);
    return [];
  }
}

export async function getTeacher(id: string) {
  const url = `${STRAPI_URL}/api/teachers/${id}?populate=*`;
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_KEY}`,
    },
    cache: "no-store",
  };

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch teacher: ${res.status} ${res.statusText}`
      );
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching teacher from Strapi:", error);
    return null;
  }
}

export async function getStudents(page?: number) {
  const ITEM_PER_PAGE = 15;
  let url;
  {
    page && page > 0
      ? (url = `${STRAPI_URL}/api/students?populate=*&pagination[page]=${page}&pagination[pageSize]=${ITEM_PER_PAGE}`)
      : (url = `${STRAPI_URL}/api/students`);
  }
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_KEY}`,
    },
    cache: "no-store",
  };

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch students: ${res.status} ${res.statusText}`
      );
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching students from Strapi:", error);
    return [];
  }
}

export async function getStudent(id: string) {
  const url = `${STRAPI_URL}/api/students/${id}?populate=*`;
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_KEY}`,
    },
    cache: "no-store",
  };

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch student: ${res.status} ${res.statusText}`
      );
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching student from Strapi:", error);
    return null;
  }
}

export async function getParents(page?: number) {
  const ITEM_PER_PAGE = 15;
  let url;

  if (page && page > 0) {
    url = `${STRAPI_URL}/api/parents?populate=*&pagination[page]=${page}&pagination[pageSize]=${ITEM_PER_PAGE}`;
  } else {
    url = `${STRAPI_URL}/api/parents`;
  }

  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_KEY}`,
    },
    cache: "no-store",
  };

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch parents: ${res.status} ${res.statusText}`
      );
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching parents from Strapi:", error);
    return { data: [], meta: {} };
  }
}

export async function getParent(id: string) {
  const url = `${STRAPI_URL}/api/parents/${id}?populate=*`;
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_KEY}`,
    },
    cache: "no-store",
  };

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch parent: ${res.status} ${res.statusText}`
      );
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching parent from Strapi:", error);
    return null;
  }
}

// export async function getClasses(page?: number) {
//   const ITEM_PER_PAGE = 15;
//   let url;

//   if (page && page > 0) {
//     url = `${STRAPI_URL}/api/classes?populate=*&pagination[page]=${page}&pagination[pageSize]=${ITEM_PER_PAGE}`;
//   } else {
//     url = `${STRAPI_URL}/api/classes`;
//   }

//   const options: RequestInit = {
//     method: "GET",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${STRAPI_KEY}`,
//     },
//     cache: "no-store",
//   };

//   try {
//     const res = await fetch(url, options);
//     if (!res.ok) {
//       throw new Error(
//         `Failed to fetch classes: ${res.status} ${res.statusText}`
//       );
//     }
//     const data = await res.json();

//     // إضافة عدد الطلاب لكل class
//     if (data.data && Array.isArray(data.data)) {
//       for (const classItem of data.data) {
//         try {
//           // جلب عدد الطلاب المسجلين في هذا الـ class
//           const studentsCountUrl = `${STRAPI_URL}/api/students?filters[class][id][$eq]=${classItem.id}&pagination[pageSize]=1`;
//           const studentsRes = await fetch(studentsCountUrl, {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${STRAPI_KEY}`,
//             },
//             cache: "no-store",
//           });

//           if (studentsRes.ok) {
//             const studentsData = await studentsRes.json();
//             classItem.studentsCount = studentsData.meta?.pagination?.total || 0;
//           } else {
//             classItem.studentsCount = 0;
//           }
//         } catch (error) {
//           console.error(
//             `Error fetching student count for class ${classItem.id}:`,
//             error
//           );
//           classItem.studentsCount = 0;
//         }
//       }
//     }

//     return data;
//   } catch (error) {
//     console.error("Error fetching classes from Strapi:", error);
//     return [];
//   }
// }

export async function getClasses(page?: number) {
  const ITEM_PER_PAGE = 15;
  let url;
  if (page && page > 0) {
    url = `${STRAPI_URL}/api/classes?populate=*&pagination[page]=${page}&pagination[pageSize]=${ITEM_PER_PAGE}`;
  } else {
    url = `${STRAPI_URL}/api/classes?populate=*`;
  }

  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_KEY}`,
    },
    cache: "no-store",
  };

  try {
    const res = await fetch(url, options);
    if (!res.ok)
      throw new Error(
        `Failed to fetch classes: ${res.status} ${res.statusText}`
      );
    const data = await res.json();

    if (data.data && Array.isArray(data.data)) {
      await Promise.all(
        data.data.map(async (classItem: any) => {
          try {
            const studentsCountUrl = `${STRAPI_URL}/api/students?filters[class][id][$eq]=${classItem.id}&pagination[pageSize]=1`;
            const studentsRes = await fetch(studentsCountUrl, {
              headers: { Authorization: `Bearer ${STRAPI_KEY}` },
              cache: "no-store",
            });

            if (studentsRes.ok) {
              const studentsData = await studentsRes.json();
              classItem.studentsCount =
                studentsData.meta?.pagination?.total || 0;
            } else {
              classItem.studentsCount = 0;
            }
          } catch (error) {
            classItem.studentsCount = 0;
          }
        })
      );
    }

    return data;
  } catch (error) {
    console.error("Error fetching classes:", error);
    return [];
  }
}

export async function getSubjects(active?: "active" | "all", page?: number) {
  const ITEM_PER_PAGE = 15;
  let url = `${STRAPI_URL}/api/subjects?populate=*`;
  if (page && page > 0) {
    url += `&pagination[page]=${page}&pagination[pageSize]=${ITEM_PER_PAGE}`;
  }
  // فقط إذا طلب المواد النشطة
  if (active === "active") {
    url += `&filters[isActive][$eq]=true`;
  }
  const options: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${STRAPI_KEY}`,
    },
    cache: "no-store",
  };

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      throw new Error(
        `Failed to fetch subjects: ${res.status} ${res.statusText}`
      );
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching subjects from Strapi:", error);
    return [];
  }
}
