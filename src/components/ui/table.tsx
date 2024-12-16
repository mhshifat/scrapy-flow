import { JSX, PropsWithChildren, ReactNode } from "react";

export interface ITableHeader {
  title: string;
  key: string;
  cell?: (value: unknown) => ReactNode;
}

interface TableProps<T> {
  identifier: keyof T;
  headers: ITableHeader[];
  data: T[];
  emptyText: ReactNode;
}

export default function Table<T extends Record<string, ReactNode>>({ identifier, headers, data, emptyText }: TableProps<T>) {
  return (
    <div className="w-full">
      <table className="w-full border-collapse">
        <thead className="border-t border-foreground/10 border-b">
          <tr>
            {headers.map(h => (
              <th key={h.key}>
                <span className="flex items-center gap-2 justify-start py-2 px-3">{h.title}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-foreground/10">
          {!!data.length && data.map((row, rowIdx) => (
            <tr key={(row?.[identifier] || rowIdx) as string}>
              {headers.map(h => (
                <td key={h.key} className="border-b border-foreground/10">
                  <span className="flex items-center gap-2 justify-start py-3 px-3">{h.cell?.(row[h.key]) || row[h.key]}</span>
                </td>
              ))}
            </tr>
          ))}
          {!data.length && (
            <tr>
              <td colSpan={headers.length + 1} className="border-b border-foreground/10">
                <span className="flex items-center gap-2 justify-start py-3 px-3">{emptyText}</span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}