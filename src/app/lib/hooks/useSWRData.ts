"use client";

import useSWR from "swr";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.statusText}`);
  }
  return res.json();
};


export function useClasses() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/classes",
    fetcher,
    {
      revalidateOnFocus: false, 
      revalidateOnReconnect: true, 
      dedupingInterval: 10000,
    }
  );
  return {
    classes: data?.data || [], 
    isLoading, 
    error,
    mutate, 
  };
}

export function useTeachers() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/teachers",
    fetcher,
    {
      revalidateOnFocus: false, 
      revalidateOnReconnect: true, 
      dedupingInterval: 10000,
    }
  );
  return {
    classes: data?.data || [], 
    isLoading, 
    error,
    mutate, 
  };
}


export function useSubjects(active: "active" | "all" = "all") {
  const { data, error, isLoading, mutate } = useSWR(
    `/api/subjects?active=${active}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 10000,
    }
  );
  return {
    subjects: data?.data || [],
    isLoading,
    error,
    mutate,
  };
}

export function useParents() {
  const { data, error, isLoading, mutate } = useSWR("/api/parents", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 10000,
  });
  return {
    parents: data?.data || [],
    isLoading,
    error,
    mutate,
  };
}
