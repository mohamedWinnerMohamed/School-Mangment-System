"use server";
import { revalidatePath } from "next/cache";
const STRAPI_URL = process.env.STRAPI_API_URL || "http://localhost:1337";
const STRAPI_KEY = process.env.STRAPI_API_KEY;

export async function createTeacherAction(data: any) {
  const url = `${STRAPI_URL}/api/teachers`;
  const bodyData = {
    data: data,
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_KEY}`,
      },
      body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Strapi Error:", errorData);
      let errorMessage = "Unknown error";
      let errorField = null;
      if (errorData.error) {
        if (errorData.error.details?.errors) {
          const validationErrors = errorData.error.details.errors;
          errorMessage = validationErrors
            .map((err: any) => err.message || err.path?.join(".") + " error")
            .join(", ");
        } else if (errorData.error.message) {
          errorMessage = errorData.error.message;
        }
      }
      return { success: false, error: errorMessage, field: errorField };
    }
    revalidatePath("/list/teachers");
    return { success: true, data: await response.json() };
  } catch (error) {
    console.error("Create Teacher Action Error:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function createStudentAction(data: any) {
  const url = `${STRAPI_URL}/api/students`;

  const bodyData = {
    data: data,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_KEY}`,
      },
      body: JSON.stringify(bodyData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Strapi Error:", errorData);
      let errorMessage = "Unknown error";
      let errorField = null;
      if (errorData.error) {
        if (errorData.error.details?.errors) {
          const validationErrors = errorData.error.details.errors;
          errorMessage = validationErrors
            .map((err: any) => err.message || err.path?.join(".") + " error")
            .join(", ");
        } else if (errorData.error.message) {
          errorMessage = errorData.error.message;
        }
      }
      return { success: false, error: errorMessage, field: errorField };
    }

    if (data.class) {
      await updateClassAction(data.class, {});
    }

    revalidatePath("/list/students");
    revalidatePath("/list/classes");
    return { success: true, data: await response.json() };
  } catch (error) {
    console.error("Create Student Action Error:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function createParentAction(data: any) {
  const url = `${STRAPI_URL}/api/parents`;
  const bodyData = {
    data: data,
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_KEY}`,
      },
      body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Strapi Error:", errorData);
      let errorMessage = "Unknown error";
      let errorField = null;
      if (errorData.error) {
        if (errorData.error.details?.errors) {
          const validationErrors = errorData.error.details.errors;
          errorMessage = validationErrors
            .map((err: any) => err.message || err.path?.join(".") + " error")
            .join(", ");
        } else if (errorData.error.message) {
          errorMessage = errorData.error.message;
        }
      }
      return { success: false, error: errorMessage, field: errorField };
    }
    revalidatePath("/list/parents");
    return { success: true, data: await response.json() };
  } catch (error) {
    console.error("Create Parent Action Error:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function createSubjectAction(data: any) {
  const url = `${STRAPI_URL}/api/subjects`;
  const bodyData = {
    data: data,
  };
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_KEY}`,
      },
      body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Strapi Error:", errorData);
      let errorMessage = "Unknown error";
      let errorField = null;
      if (errorData.error) {
        if (errorData.error.details?.errors) {
          const validationErrors = errorData.error.details.errors;
          errorMessage = validationErrors
            .map((err: any) => err.message || err.path?.join(".") + " error")
            .join(", ");
        } else if (errorData.error.message) {
          errorMessage = errorData.error.message;
        }
      }
      return { success: false, error: errorMessage, field: errorField };
    }
    revalidatePath("/list/subjects");
    return { success: true, data: await response.json() };
  } catch (error) {
    console.error("Create Subject Action Error:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function createClassAction(data: any) {
  const url = `${STRAPI_URL}/api/classes`;
  const { supervisorId, ...restData } = data;
  const bodyData = {
    data: restData,
    classTeacher: supervisorId,
  };
  console.log("these are data from create class action", data);
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_KEY}`,
      },
      body: JSON.stringify(bodyData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      console.error("Strapi Error:", errorData);
      let errorMessage = "Unknown error";
      let errorField = null;
      if (errorData.error) {
        if (errorData.error.details?.errors) {
          const validationErrors = errorData.error.details.errors;
          errorMessage = validationErrors
            .map((err: any) => err.message || err.path?.join(".") + " error")
            .join(", ");
        } else if (errorData.error.message) {
          errorMessage = errorData.error.message;
        }
      }
      return { success: false, error: errorMessage, field: errorField };
    }
    revalidatePath("/list/classes");
    // ربط الكلاس بالمعلم باستخدام العلاقة الجديدة
    if (supervisorId) {
      const newClassData = await response.json();
      await updateTeacherAction(supervisorId, {
        supervisingClass: newClassData.data.documentId,
      });
      return { success: true, data: newClassData };
    }
    return { success: true, data: await response.json() };
  } catch (error) {
    console.error("Create Class Action Error:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteTeacherAction(id: string) {
  const url = `${STRAPI_URL}/api/teachers/${id}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${STRAPI_KEY}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = response.statusText;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error.message;
      } catch {
        if (errorText) errorMessage = errorText;
      }
      console.log("Strapi Delete Error:", errorMessage);
      throw new Error(`Failed to delete teacher: ${errorMessage}`);
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    revalidatePath("/list/teachers");
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteStudentAction(payload: any) {
  // Determine ID: check if payload is string (ID) or object (data)
  const id =
    typeof payload === "object" ? payload.documentId : payload;
  const classId =
    typeof payload === "object"
      ? payload.class?.documentId || payload.class?.id
      : null;

  const url = `${STRAPI_URL}/api/students/${id}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${STRAPI_KEY}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = response.statusText;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error.message;
      } catch {
        if (errorText) errorMessage = errorText;
      }
      console.log("Strapi Delete Error:", errorMessage);
      throw new Error(`Failed to delete student: ${errorMessage}`);
    }

    const text = await response.text();
    const resultData = text ? JSON.parse(text) : {};

    // Update class capacity if classId is available
    if (classId) {
      console.log(`Updating class ${classId} capacity after student deletion`);
      await updateClassAction(classId, {});
    }

    revalidatePath("/list/students");
    revalidatePath("/list/classes");
    return { success: true, data: resultData };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteParentAction(id: string) {
  const url = `${STRAPI_URL}/api/parents/${id}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${STRAPI_KEY}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = response.statusText;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error.message;
      } catch {
        if (errorText) errorMessage = errorText;
      }
      console.log("Strapi Delete Error:", errorMessage);
      throw new Error(`Failed to delete parent: ${errorMessage}`);
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    revalidatePath("/list/parents");
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteSubjectAction(id: string) {
  const url = `${STRAPI_URL}/api/subjects/${id}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${STRAPI_KEY}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = response.statusText;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error.message;
      } catch {
        if (errorText) errorMessage = errorText;
      }
      console.log("Strapi Delete Error:", errorMessage);
      throw new Error(`Failed to delete parent: ${errorMessage}`);
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    revalidatePath("/list/subjects");
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteClassAction(id: string) {
  const url = `${STRAPI_URL}/api/classes/${id}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${STRAPI_KEY}`,
      },
    });
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = response.statusText;
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error.message;
      } catch {
        if (errorText) errorMessage = errorText;
      }
      console.log("Strapi Delete Error:", errorMessage);
      throw new Error(`Failed to delete parent: ${errorMessage}`);
    }

    const text = await response.text();
    const data = text ? JSON.parse(text) : {};
    revalidatePath("/list/classes");
    return { success: true, data: data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export const updateStudentAction = async (id: number | string, data: any) => {
  try {
    if (!STRAPI_KEY) throw new Error("API Token not found");

    const { oldClassId, ...restData } = data;
    const bodyData = {
      data: {
        ...restData,
      },
    };

    const url = `${STRAPI_URL}/api/students/${id}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${STRAPI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Strapi Update Error:", errorText);
      throw new Error(errorText);
    }

    console.log("Updating class capacity for:", data);
    if (data.class) {
      await updateClassAction(data.class, {});
      if (oldClassId && oldClassId !== data.class) {
        await updateClassAction(oldClassId, {});
      }
    }

    revalidatePath("/list/students");
    revalidatePath("/list/classes");
    return { success: true };
  } catch (error: any) {
    console.error("Update Student Action Error:", error.message);
    return { success: false, error: error.message };
  }
};

export const updateTeacherAction = async (id: number | string, data: any) => {
  try {
    if (!STRAPI_KEY) throw new Error("API Token not found");

    // 1. جلب البيانات الحالية مع كل العلاقات
    const response = await fetch(
      `${STRAPI_URL}/api/teachers/${id}?populate=*`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${STRAPI_KEY}`,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.warn(
        "Could not fetch current teacher data, proceeding with update"
      );
    }

    let mergedData = { ...data };

    // 2. دمج البيانات إذا تم جلب البيانات الحالية بنجاح
    if (response.ok) {
      const currentTeacherData = await response.json();
      const currentTeacher = currentTeacherData.data;

      // الحفاظ على العلاقات الموجودة إذا لم يتم تحديثها
      mergedData = {
        ...data,
        // الحفاظ على classes إذا لم يتم تحديثها
        classes:
          currentTeacher.classes?.map((c: any) => c.id) || [],
        // الحفاظ على subjects إذا لم يتم تحديثها
        subjects:
          data.subjects !== undefined
            ? data.subjects
            : currentTeacher.subjects?.map((s: any) => s.id) || [],
        // الحفاظ على supervisingClass إذا لم يتم تحديثه
        supervisingClass:
          data.supervisingClass !== undefined
            ? data.supervisingClass
            : currentTeacher.supervisingClass?.documentId || null,
      };
    }

    const bodyData = {
      data: mergedData,
    };

    console.log("Updating teacher with data:", bodyData);

    const url = `${STRAPI_URL}/api/teachers/${id}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${STRAPI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Strapi Update Error:", errorText);
      throw new Error(errorText);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Update Teacher Action Error:", error.message);
    return { success: false, error: error.message };
  }
};

export const updateParentAction = async (id: number | string, data: any) => {
  try {
    const STRAPI_URL = process.env.STRAPI_API_URL;
    const token = process.env.STRAPI_API_KEY;
    if (!token) throw new Error("API Token not found");

    // 1. جلب البيانات الحالية مع كل العلاقات
    const currentParentUrl = `${STRAPI_URL}/api/parents/${id}?populate=*`;
    const currentParentRes = await fetch(currentParentUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    let mergedData = { ...data };

    // 2. دمج البيانات إذا تم جلب البيانات الحالية بنجاح
    if (currentParentRes.ok) {
      const currentParentData = await currentParentRes.json();
      const currentParent = currentParentData.data;

      // الحفاظ على العلاقات الموجودة إذا لم يتم تحديثها
      mergedData = {
        ...data,
        // الحفاظ على students إذا لم يتم تحديثهم
        students:
          data.students !== undefined
            ? data.students
            : currentParent.students?.map((s: any) => s.id) || [],
      };
    }

    const bodyData = {
      data: mergedData,
    };

    console.log("Updating parent with data:", bodyData);

    const url = `${STRAPI_URL}/api/parents/${id}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Strapi Update Error:", errorText);
      throw new Error(errorText);
    }
    return { success: true };
  } catch (error: any) {
    console.error("Update Parent Action Error:", error.message);
    return { success: false, error: error.message };
  }
};

export const updateSubjectAction = async (id: number | string, data: any) => {
  try {
    const STRAPI_URL = process.env.STRAPI_API_URL;
    const token = process.env.STRAPI_API_KEY;
    if (!token) throw new Error("API Token not found");

    // 1. جلب البيانات الحالية مع كل العلاقات
    const currentSubjectUrl = `${STRAPI_URL}/api/subjects/${id}?populate=*`;
    const currentSubjectRes = await fetch(currentSubjectUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    let mergedData = { ...data };

    // 2. دمج البيانات إذا تم جلب البيانات الحالية بنجاح
    if (currentSubjectRes.ok) {
      const currentSubjectData = await currentSubjectRes.json();
      const currentSubject = currentSubjectData.data;

      // الحفاظ على العلاقات الموجودة إذا لم يتم تحديثها
      mergedData = {
        ...data,
        // الحفاظ على teachers إذا لم يتم تحديثهم
        teachers:
          data.teachers !== undefined
            ? data.teachers
            : currentSubject.teachers?.map((t: any) => t.id) || [],
      };
    }

    const bodyData = {
      data: mergedData,
    };

    console.log("Updating subject with data:", bodyData);

    const url = `${STRAPI_URL}/api/subjects/${id}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Strapi Update Error:", errorText);
      throw new Error(errorText);
    }

    return { success: true };
  } catch (error: any) {
    console.error("Update Subject Action Error:", error.message);
    return { success: false, error: error.message };
  }
};

export const updateClassAction = async (id: number | string, data: any) => {
  try {
    if (!STRAPI_URL || !STRAPI_KEY)
      throw new Error("Strapi configuration missing");
    const filterField = typeof id === "string" ? "documentId" : "id";
    const classResponse = await fetch(
      `${STRAPI_URL}/api/classes?filters[${filterField}][$eq]=${id}&populate=*`,
      {
        headers: { Authorization: `Bearer ${STRAPI_KEY}` },
        cache: "no-store",
      }
    );
    const classPayload = await classResponse.json();
    const classItem = classPayload.data[0];
    if (!classItem) {
      throw new Error("Class not found while updating ");
    }
    const studentIds = classItem.students?.map((s: any) => s.id) || [];
    const teacherIds = classItem.teachers?.map((t: any) => t.id) || [];
    const supervisorIdFromClass = classItem.classTeacher?.id || null;
    const capacity =
      data.capacity !== undefined
        ? parseInt(data.capacity)
        : parseInt(classItem.capacity) || 0;

    const studentsCountUrl = `${STRAPI_URL}/api/students?filters[class][id][$eq]=${classItem.id}&pagination[pageSize]=1`;
    const studentsResponse = await fetch(studentsCountUrl, {
      headers: { Authorization: `Bearer ${STRAPI_KEY}` },
      cache: "no-store",
    });
    if (!studentsResponse.ok) {
      throw new Error("Failed to fetch students count");
    }
    const studentsData = await studentsResponse.json();
    const currentCount = studentsData.meta?.pagination?.total || 0;

    const isFull = currentCount >= capacity;

    if (currentCount > capacity) {
      throw new Error(
        "can't update the class (capacity must be greater than current students count)"
      );
    }
    console.log("capacity:", capacity);
    console.log("currentCount:", currentCount);
    console.log("isFull:", isFull);
    // // Fetch students related to class
    // const classStudentsResponse = await fetch(
    //   `${STRAPI_URL}/api/classes?filters[documentId][$eq]=${id}&populate=students`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //     cache: "no-store",
    //   }
    // );
    // const classStudentsPayload = await classStudentsResponse.json();
    // console.log("this test for suloation from antigravity:", classStudentsPayload)
    // const classWithStudents = classStudentsPayload.data[0];
    // if (!classWithStudents) {
    //   throw new Error("Class not found while updating (students)");
    // }
    // const studentIds = classWithStudents.students?.map((s: any) => s.id) || [];
    // //  Fetch class supervisor
    // const classSuperVisorResponse = await fetch(
    //   `${STRAPI_URL}/api/classes?filters[documentId][$eq]=${id}&populate=classTeacher`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //     cache: "no-store",
    //   }
    // );
    // const classSuperVisorPayload = await classSuperVisorResponse.json();
    // const classWithSuperVisor = classSuperVisorPayload.data[0];
    // if (!classWithSuperVisor) {
    //   throw new Error("Class not found while updating (supervisor)");
    // }
    // const supervisorIdFromClass = classWithSuperVisor.classTeacher?.id || null;
    // // Fetch teachers related to class
    // const classTeachersResponse = await fetch(
    //   `${STRAPI_URL}/api/classes?filters[documentId][$eq]=${id}&populate=teachers`,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //     cache: "no-store",
    //   }
    // );
    // const classTeacherPayload = await classTeachersResponse.json();
    // const classWithTeachers = classTeacherPayload.data[0];
    // if (!classWithTeachers) {
    //   throw new Error("Class not found while updating (teachers)");
    // }
    // const teacherIds =
    //   classWithTeachers.teachers?.map((s: any) => s.id) || [];

    // this is put req to update class
    const {
      supervisorId,
      supervisor,
      updatedAt,
      createdAt,
      publishedAt,
      id: _id,
      ...restData
    } = data;
    const bodyData = {
      data: {
        ...restData,
        full: isFull,
        students: studentIds,
        teachers: teacherIds,
        classTeacher: supervisorId ?? supervisorIdFromClass,
      },
    };
    const url = `${STRAPI_URL}/api/classes/${classItem.documentId}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${STRAPI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyData),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Strapi Update Error:", errorText);
      throw new Error(errorText);
    }

    if (supervisorId) {
      await updateTeacherAction(supervisorId, { supervisingClass: id });
    }

    revalidatePath("/list/classes");
    revalidatePath("/list/teachers");
    revalidatePath("/list/students");

    return { success: true };
  } catch (error: any) {
    console.error("Update Class Action Error:", error.message);
    return { success: false, error: error.message };
  }
};

export const checkValidationAction = async (
  id: number | string,
  type: string,
  field: string,
  value: number | string
) => {
  try {
    const STRAPI_URL = process.env.STRAPI_API_URL;
    const token = process.env.STRAPI_API_KEY;
    const allowedFields = [
      "parentId",
      "teacherId",
      "studentId",
      "subjectId",
      "classId",
      "lessonId",
      "userName",
      "name",
    ];
    const allowedTypes = ["student", "teacher", "parent", "subject", "classe", "lesson"];
    if (!type || !field || value === undefined || value === null) {
      return { success: true };
    }
    if (!STRAPI_URL || !token) {
      throw new Error("Strapi configuration missing");
    }
    if (!allowedFields.includes(field)) {
      throw new Error("Invalid field");
    }
    if (!allowedTypes.includes(type)) {
      throw new Error("Invalid type");
    }
    const encodedValue = encodeURIComponent(value);
    const operator = field === "name" ? "$eqi" : "$eq";
    const finalValue =
      field === "name" ? encodedValue.toLowerCase() : encodedValue;
    let checkUrl = `${STRAPI_URL}/api/${type}s?filters[${field}][${operator}]=${finalValue}`;
    const checkResponse = await fetch(checkUrl, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!checkResponse.ok) {
      throw new Error("Failed to validate uniqueness");
    }
    const checkData = await checkResponse.json();
    if (checkData.data && checkData.data.length > 0) {
      const existingId = checkData.data[0].documentId;
      if (id && existingId === id) {
        return { success: true };
      }
      throw new Error(
        `${
          field.endsWith("Id")
            ? "ID"
            : type === "classe"
            ? "Class Name"
            : "User Name"
        } is already exists`
      );
    }

    return { success: true };
  } catch (error: any) {
    console.error("Update ID Action Error:", error.message);
    return {
      success: false,
      error: error.message || "Validation failed",
      field,
    };
  }
};

// export const checkClassCapacityAction = async (classId: string | number) => {
//   try {
//     console.log("Checking classId:", classId);
//     if (!STRAPI_URL || !STRAPI_KEY) {
//       throw new Error("Strapi configuration missing");
//     }

//     let classUrl = `${STRAPI_URL}/api/classes?filters[id][$eq]=${classId}&populate=*`;
//     let classResponse = await fetch(classUrl, {
//       headers: { Authorization: `Bearer ${STRAPI_KEY}` },
//       cache: "no-store",
//     });
//     const classData = await classResponse.json();
// const classItem = classData.data?.[0];
//     if (!classItem) throw new Error("Class not found");
// const capacity = parseInt(classItem.capacity) || 0;

//     const studentsCountUrl = `${STRAPI_URL}/api/students?filters[class][id][$eq]=${classItem.id}&pagination[pageSize]=1`;
//     const studentsResponse = await fetch(studentsCountUrl, {
//       headers: { Authorization: `Bearer ${STRAPI_KEY}` },
//       cache: "no-store",
//     });
//     if (!studentsResponse.ok) {
//       throw new Error("Failed to fetch students count");
//     }
//     const studentsData = await studentsResponse.json();
// const currentCount = studentsData.meta?.pagination?.total || 0;

// const isFull = currentCount >= capacity;

//     if (currentCount > capacity) {
//       throw new Error(
//         "can't update the class (capacity must be greater than current students count)"
//       );
//     }
//     console.log("currentCount:", currentCount);
//     console.log("capacity:", capacity);
//     console.log("isFull:", isFull);
// if (classItem.full !== isFull) {
// console.log(`Updating Class ${classId} full status to: ${isFull}`);
// // تحديث مباشر بدون استدعاء updateClassAction لتجنب recursive call
// const updateUrl = `${STRAPI_URL}/api/classes/${classItem.documentId}`;
// const updateResponse = await fetch(updateUrl, {
//   method: "PUT",
//   headers: {
//     "Content-Type": "application/json",
//     Authorization: `Bearer ${STRAPI_KEY}`,
//   },
//   body: JSON.stringify({
//     data: {
//       full: isFull,
//     },
//   }),
// });

//       if (!updateResponse.ok) {
//         console.error("Failed to update full status");
//       }

//       revalidatePath("/list/classes");
//       revalidatePath("/list/students");
//     }

//     return {
//       success: true,
//       isFull,
//       currentCount,
//       capacity,
//       message: isFull
//         ? `This class is full (${currentCount}/${capacity})`
//         : `Available spots: ${capacity - currentCount}/${capacity}`,
//     };
//   } catch (error: any) {
//     console.error("Check Capacity Error:", error.message);
//     return { success: false, error: error.message };
//   }
// };

async function updateClassFullStatus(classId: string | number) {
  try {
    const STRAPI_URL = process.env.STRAPI_API_URL;
    const token = process.env.STRAPI_API_KEY;
    if (!STRAPI_URL || !token) return;

    // 1. Get numeric ID if documentId provided
    let numericId = classId;
    console.log("numericId from class function:", numericId);
    if (typeof classId === "string" && !classId.match(/^\d+$/)) {
      const classUrl = `${STRAPI_URL}/api/classes?filters[documentId][$eq]=${classId}`;
      const classRes = await fetch(classUrl, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (classRes.ok) {
        const classData = await classRes.json();
        if (classData.data && classData.data.length > 0) {
          numericId = classData.data[0].id;
        }
      }
    }

    console.log("numericId after edit from class function:", numericId);
    // 2. Get class capacity
    const classUrl = `${STRAPI_URL}/api/classes/${numericId}`;
    const classRes = await fetch(classUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!classRes.ok) return;
    const classData = await classRes.json();
    const capacity = parseInt(classData.data?.capacity || "0");

    // 3. Count students in this class
    const studentsUrl = `${STRAPI_URL}/api/students?filters[class][id][$eq]=${numericId}&pagination[pageSize]=1`;
    const studentsRes = await fetch(studentsUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!studentsRes.ok) return;
    const studentsData = await studentsRes.json();
    const studentCount = studentsData.meta?.pagination?.total || 0;

    // 4. Update 'full' status
    const isFull = studentCount >= capacity;
    const updateUrl = `${STRAPI_URL}/api/classes/${numericId}`;
    await fetch(updateUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        data: {
          full: true,
        },
      }),
    });

    console.log(
      `✅ Updated class ${numericId}: ${studentCount}/${capacity} students, full=${isFull}`
    );
  } catch (error) {
    console.error("Error updating class full status:", error);
  }
}
