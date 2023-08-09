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
  headerClassName?: string;
  bodyClassName?: string;
  rowClassName?: string;
};

const emptyList = Array.from({ length: 5 });

const Table: FC<TableProps> = ({ className, headerClassName, bodyClassName, rowClassName, columns, data, fixedRow }) => {
  const defaultClassName = 'text-mediumEmphasis';
  const defaultHeaderClassName = 'flex items-center bg-darkBlue py-3';
  const defaultRowClassName = 'flex items-center border-b border-b-[#2E4371] py-3 text-b3 transition lg:text-b2';
  return (
    <div className={`${defaultClassName} ${className}`}>
      <div className={`${defaultHeaderClassName} ${headerClassName}`}>
        {columns.map(col => (
          <div className={col.className}>{col.label}</div>
        ))}
      </div>
      <div className={`scrollable overflow-auto ${bodyClassName}`}>
        {fixedRow && (
          <div className={`${defaultRowClassName} bg-secondaryBlue lg:sticky lg:top-0 lg:z-[2] ${rowClassName}`}>
            {columns.map((col, i) => (
              <div key={`fix-${i}`} className={col.className || 'flex-1'}>
                {col.render ? col.render(fixedRow) : col.field ? fixedRow[col.field] : null}
              </div>
            ))}
          </div>
        )}
        {data.length > 0 ? (
          <>
            {data.map((row, rowIdx) => (
              <div key={`row-${rowIdx}`} className={`${defaultRowClassName} ${rowClassName}`}>
                {columns.map((col, i) => (
                  <div key={`row-${rowIdx}-${i}`} className={col.className || 'flex-1'}>
                    {col.render ? col.render(row) : col.field ? row[col.field] : null}
                  </div>
                ))}
              </div>
            ))}
          </>
        ) : (
          <>
            {emptyList.map((row, rowIdx) => (
              <div key={`row-${rowIdx}`} className={`${defaultRowClassName} min-h-[50px] ${rowClassName}`}>
                {columns.map((col, i) => (
                  <div key={`row-${rowIdx}-${i}`} className={col.className || 'flex-1'}>
                    {' '}
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

Table.defaultProps = {
  className: undefined,
  headerClassName: undefined,
  bodyClassName: undefined,
  rowClassName: undefined,
  fixedRow: undefined
};

export default Table;
