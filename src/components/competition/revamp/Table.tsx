/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
import React, { FC, PropsWithChildren, ReactNode } from 'react';

type TableRow = {
  [k: string]: string | number | undefined;
};

export type TableColumn<T = any> = {
  label: string;
  field?: string;
  render?: (row: T) => ReactNode;
  className?: string;
};

type TableProps = PropsWithChildren & {
  columns: TableColumn<any>[];
  data: TableRow[];
  fixedRow?: TableRow;
  className?: string;
};

const Table: FC<TableProps> = ({ className, columns, data, fixedRow }) => {
  const foo = 'bar';
  return (
    <div className={className}>
      <div className="flex items-center py-4 text-b2 text-mediumEmphasis">
        {columns.map(col => (
          <div className={col.className}>{col.label}</div>
        ))}
      </div>
      <div className="scrollable h-[480px] overflow-auto">
        {fixedRow && (
          <div
            className="sticky top-0 z-[2] flex
          items-center border-b border-b-[#2E4371] bg-secondaryBlue py-3 text-b2 text-mediumEmphasis transition hover:bg-secondaryBlue">
            {columns.map(col => (
              <div key={col.label} className={col.className}>
                {col.render ? col.render(fixedRow) : col.field ? fixedRow[col.field] : null}
              </div>
            ))}
          </div>
        )}
        {data.map((row, rowIdx) => (
          <div
            key={`row-${rowIdx}`}
            className="flex items-center border-b border-b-[#2E4371] py-3 text-b2 text-mediumEmphasis transition hover:bg-secondaryBlue">
            {columns.map(col => (
              <div key={col.label} className={col.className}>
                {col.render ? col.render(row) : col.field ? row[col.field] : null}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

Table.defaultProps = {
  className: undefined,
  fixedRow: undefined
};

export default Table;
