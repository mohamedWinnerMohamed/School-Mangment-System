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
          const firstError = validationErrors[0];
          if (firstError.path && firstError.path.includes("teacherId")) {
            errorMessage = "the teacher id is already used";
            errorField = "teacherId";
          } else {
            errorMessage = validationErrors
              .map((err: any) => err.message || err.path?.join(".") + " error")
              .join(", ");
          }
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

  // Check if studentId already exists
  const checkUrl = `${STRAPI_URL}/api/students?filters[studentId][$eq]=${data.studentId}`;
  try {
    const checkRes = await fetch(checkUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${STRAPI_KEY}`,
      },
      cache: "no-store",
    });

    if (checkRes.ok) {
      const checkData = await checkRes.json();
      if (checkData.data && checkData.data.length > 0) {
        return {
          success: false,
          error: "the student id is already used",
          field: "studentId",
        };
      }
    }
  } catch (error) {
    console.error("Error checking student existence:", error);
  }

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
          const firstError = validationErrors[0];
          if (firstError.path && firstError.path.includes("studentId")) {
            errorMessage = "the student id is already used";
            errorField = "studentId";
          } else {
            errorMessage = validationErrors
              .map((err: any) => err.message || err.path?.join(".") + " error")
              .join(", ");
          }
        } else if (errorData.error.message) {
          errorMessage = errorData.error.message;
        }
      }
      return { success: false, error: errorMessage, field: errorField };
    }
    revalidatePath("/list/students");
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
          const firstError = validationErrors[0];
          if (firstError.path && firstError.path.includes("parentId")) {
            errorMessage = "the parent id is already used";
            errorField = "parentId";
          } else {
            errorMessage = validationErrors
              .map((err: any) => err.message || err.path?.join(".") + " error")
              .join(", ");
          }
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

export async function deleteStudentAction(id: string) {
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
    const data = text ? JSON.parse(text) : {};
    revalidatePath("/list/students");
    return { success: true, data: data };
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

export const updateStudentAction = async (id: number | string, data: any) => {
  try {
    const STRAPI_URL = process.env.STRAPI_API_URL;
    const token = process.env.STRAPI_API_KEY;
    if (!token) throw new Error("API Token not found");

    const bodyData = {
      data: data,
    };
    console.log(bodyData);
    const url = `${STRAPI_URL}/api/students/${id}`;
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
    console.error("Update Student Action Error:", error.message);
    return { success: false, error: error.message };
  }
};

export const updateTeacherAction = async (id: number | string, data: any) => {
  try {
    const STRAPI_URL = process.env.STRAPI_API_URL;
    const token = process.env.STRAPI_API_KEY;
    if (!token) throw new Error("API Token not found");

    // Step 2: Prepare body
    const bodyData = {
      data: data,
    };
    console.log(bodyData);
    // Step 3: Send update request
    const url = `${STRAPI_URL}/api/teachers/${id}`;
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
    console.error("Update Teacher Action Error:", error.message);
    return { success: false, error: error.message };
  }
};

export const updateParentAction = async (id: number | string, data: any) => {
  try {
    const STRAPI_URL = process.env.STRAPI_API_URL;
    const token = process.env.STRAPI_API_KEY;
    if (!token) throw new Error("API Token not found");

    // Step 2: Prepare body
    const bodyData = {
      data: data,
    };
    console.log(bodyData);
    // Step 3: Send update request
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

export const checkValidationAction = async (
  id: number | string,
  type: string,
  field: string,
  value: number | string
) => {
  try {
    const STRAPI_URL = process.env.STRAPI_API_URL;
    const token = process.env.STRAPI_API_KEY;
    const allowedFields = ["parentId", "teacherId", "studentId", "userName"];
    const allowedTypes = ["student", "teacher", "parent"];
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

    let checkUrl = `${STRAPI_URL}/api/${type}s?filters[${field}][$eq]=${encodedValue}`;
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
      throw new Error(`${field.endsWith("Id") ? "ID" : "User Name"} is already exists`);
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
