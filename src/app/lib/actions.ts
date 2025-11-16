"use server";

import { error } from "console";
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
      console.error("Strapi Error:", errorData.error);
      throw new Error(
        `Failed to create teacher: ${
          errorData.error.message || "Unknown error"
        }`
      );
    }

    revalidatePath("/list/teachers");
    return { success: true, data: await response.json() };
  } catch (error) {
    console.error("Create Teacher Action Error:", error);
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteTeacherAction(id: number) {
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
