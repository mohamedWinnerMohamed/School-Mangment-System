
const Table = ({
  columns,
  renderRow,
  data,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
  }) => {
  return (
    // <table className="w-full mt-4">
    <table className={`w-full mt-4 ${data.length > 0 ? "" : "h-full"}`}>
      <thead>
        <tr className="text-left text-gray-500 text-sm">
          {columns.map((col) => (
            <th key={col.accessor} className={col.className}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody className="">
        {data.length > 0 ? (
          data.map((item) => renderRow(item))
        ) : (
          <tr className="">
            <td colSpan={columns.length} className="text-center py-4 text-gray-500">
              No Data Found
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default Table;
