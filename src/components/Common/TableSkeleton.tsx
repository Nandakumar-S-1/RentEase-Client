type TableSkeletonProps = {
  columns: number;
  rows?: number;
};

export const TableSkeleton = ({ columns, rows = 5 }: TableSkeletonProps) => {
  return (
    <div className="p-4 animate-pulse">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="p-2">
                <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx}>
              {Array.from({ length: columns }).map((_, colIdx) => (
                <td key={colIdx} className="p-2">
                  <div className="h-4 bg-gray-300 rounded w-full" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};