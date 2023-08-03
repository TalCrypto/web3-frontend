/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-vars */
import React, { FC, PropsWithChildren, ReactNode } from 'react';

type TableRow = {
  [k: string]: string | number | undefined;
};

export type TableColumn<T = any> = {
  label: String | ReactNode;
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
      <div className="sticky top-12 z-[2] flex items-center bg-darkBlue py-4 text-b3 text-mediumEmphasis lg:static lg:text-b2">
        {columns.map(col => (
          <div className={col.className}>{col.label}</div>
        ))}
      </div>
      <div className="scrollable overflow-auto lg:h-[480px]">
        {fixedRow && (
          <div
            className="flex items-center border-b border-b-[#2E4371]
          bg-secondaryBlue py-3 text-b3 text-mediumEmphasis transition hover:bg-secondaryBlue lg:sticky lg:top-0 lg:z-[2] lg:text-b2">
            {columns.map((col, i) => (
              <div key={`fix-${i}`} className={col.className}>
                {col.render ? col.render(fixedRow) : col.field ? fixedRow[col.field] : null}
              </div>
            ))}
          </div>
        )}
        {data.map((row, rowIdx) => (
          <div
            key={`row-${rowIdx}`}
            className="flex items-center border-b border-b-[#2E4371] py-3 text-b3 text-mediumEmphasis 
            transition hover:bg-secondaryBlue lg:text-b2">
            {columns.map((col, i) => (
              <div key={`row-${rowIdx}-${i}`} className={col.className}>
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
