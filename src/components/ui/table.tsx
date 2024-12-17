import { cn } from "@/utils/helpers";
import {
	cloneElement,
	HTMLAttributes,
	JSX,
	PropsWithChildren,
	ReactElement,
	ReactNode,
	useCallback,
} from "react";

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
	row?: (props: {
		data: T;
		defaultProps: { key: string };
		children: ReactNode;
	}) => JSX.Element;
}

export default function Table<T extends Record<string, ReactNode>>({
	row: tableRow,
	identifier,
	headers,
	data,
	emptyText,
}: TableProps<T>) {
	const constructTableRow = useCallback(
		(row: T) => {
			return (
				<>
					{headers.map((h) => (
						<td key={h.key + h.title} className="border-b border-foreground/10">
							<span className="flex items-center gap-2 justify-start py-3 px-3">
								{h.cell?.(row?.[h.key] || row) || row[h.key]}
							</span>
						</td>
					))}
				</>
			);
		},
		[headers]
	);

	return (
		<div className="w-full">
			<table className="w-full border-collapse">
				<thead className="border-t border-foreground/10 border-b">
					<tr>
						{headers.map((h, hIdx) => (
							<th key={h.key + h.title + hIdx}>
								<span className="flex items-center gap-2 justify-start py-2 px-3">
									{h.title}
								</span>
							</th>
						))}
					</tr>
				</thead>
				<tbody className="bg-foreground/10">
					{!!data.length &&
						data.map((row, rowIdx) =>
							tableRow ? (
								tableRow?.({
									defaultProps: {
										key:
											(row?.[identifier] || rowIdx) + "Table" + Math.random(),
									},
									children: constructTableRow(row),
									data: row,
								})
							) : (
								<tr
									key={(row?.[identifier] || rowIdx) + "Table" + Math.random()}
								>
									{constructTableRow(row)}
								</tr>
							)
						)}
					{!data.length && (
						<tr>
							<td
								colSpan={headers.length + 1}
								className="border-b border-foreground/10"
							>
								<span className="flex items-center gap-2 justify-start py-3 px-3">
									{emptyText}
								</span>
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	);
}
