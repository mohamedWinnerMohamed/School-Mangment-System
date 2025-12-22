"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Pagination from "@mui/material/Pagination"; 


const AppPagination = ({ count }: { count: number }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ITEM_PER_PAGE = 15;
  const currentPage = parseInt(searchParams.get("page") || "1");
  const totalPages = Math.ceil(count / ITEM_PER_PAGE);

  if (totalPages == 0) return null;

  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${params}`);
  };

  const handlePagination = (
    _: React.ChangeEvent<unknown>,
    pageNumber: number
  ) => {
    changePage(pageNumber);
  };

  return (
    <div className="p-4 flex items-center justify-center gap-3 text-gray-500">
      <Pagination
        color="standard"
        count={totalPages}
        page={currentPage}
        onChange={handlePagination}
        boundaryCount={1}
        siblingCount={1}
      />
    </div>
  );
};

export default AppPagination;
