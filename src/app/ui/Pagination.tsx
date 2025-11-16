function Pagination() {
  return (
    <div className="p-4 flex items-center justify-center gap-3 text-gray-500">
      <button
        disabled
        className="p-2 py-1 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {"<"}
      </button>
      <div className="flex items-center gap-1 text-sm">
        <button className="px-2 rounded-md bg-lamaSky">1</button>
        <button className="px-2 rounded-md ">2</button>
        <button className="px-2 rounded-md ">3</button>
        ...
        <button className="px-2 rounded-md ">10</button>
      </div>
      <button className="p-2 py-1 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
        {">"}
      </button>
    </div>
  );
}

export default Pagination;
