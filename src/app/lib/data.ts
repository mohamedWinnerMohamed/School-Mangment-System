
const STRAPI_URL = process.env.STRAPI_API_URL || "http://localhost:1337";
const STRAPI_KEY = process.env.STRAPI_API_KEY;

export async function getTeachers() {
  const url = `${STRAPI_URL}/api/teachers?populate=*`;
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
    return data.data;
  } catch (error) {
    console.error("Error fetching teachers from Strapi:", error);
    return [];
  }
}

export async function getClasses() {
  const url = `${STRAPI_URL}/api/classes`;

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
        `Failed to fetch classes: ${res.status} ${res.statusText}`
      );
    }
    const data = await res.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching classes from Strapi:", error);
    return [];
  }
}

export async function getSubjects() {
  const url = `${STRAPI_URL}/api/subjects`;

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
    return data.data;
  } catch (error) {
    console.error("Error fetching subjects from Strapi:", error);
    return [];
  }
}
