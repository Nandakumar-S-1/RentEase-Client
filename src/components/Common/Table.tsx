import { EmptyState } from "./EmptyState";
import { TableSkeleton } from "./TableSkeleton";

interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (row: T) => React.ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function Table<T extends { id: string }>({
  columns,
  data,
  isLoading,
  emptyMessage = "No data found",
  onRowClick,
}: TableProps<T>) {
  if (isLoading) return <TableSkeleton columns={columns.length} />;
  if (data.length === 0) return <EmptyState message={emptyMessage} />;
  return (
    <div className="overflow-x-auto rounded-xl border border-[color:var(--color-border)]">
      <table className="w-full text-sm">
        <thead className="bg-[color:var(--color-background)]">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-3 text-left font-medium"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick?.(row)}
              className="border-t border-[color:var(--color-border)] hover:bg-[color:var(--color-background)] cursor-pointer transition-colors"
            >
              {columns.map((col) => (
                <td key={String(col.key)} className="px-4 py-3">
                  {col.render
                    ? col.render(row)
                    : String(row[col.key as keyof T] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
