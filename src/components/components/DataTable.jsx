import { useEffect, useMemo, useState } from "react";
import Pagination from "./Pagination";

const DataTable = ({
  columns = [],
  data = [],
  title = "Data",
  subtitle = "",
  emptyMessage = "No data found",
  recordsPerPage = 5,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Total pages
  const totalPages = Math.max(
    1,
    Math.ceil(data.length / recordsPerPage)
  );

  // Agar data change ho jaye aur current page exist na kare
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  // Current page ka data
  const currentData = useMemo(() => {
    const startIndex =
      (currentPage - 1) * recordsPerPage;

    const endIndex =
      startIndex + recordsPerPage;

    return data.slice(startIndex, endIndex);
  }, [
    data,
    currentPage,
    recordsPerPage,
  ]);

  // Record numbers
  const startRecord =
    data.length === 0
      ? 0
      : (currentPage - 1) *
          recordsPerPage +
        1;

  const endRecord = Math.min(
    currentPage * recordsPerPage,
    data.length
  );

  return (
    <div className="data-table-card">

      {/* HEADER */}
      <div className="data-table-header">

        <div>
          <h2>{title}</h2>

          {subtitle && (
            <p>{subtitle}</p>
          )}
        </div>

        <span className="data-count">
          {data.length} Records
        </span>

      </div>

      {/* TABLE */}
      <div className="data-table-wrapper">

        <table className="data-table">

          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>

            {currentData.length > 0 ? (

              currentData.map(
                (row, index) => (

                  <tr
                    key={
                      row.id ||
                      startRecord + index
                    }
                  >

                    {columns.map(
                      (column) => (

                        <td
                          key={column.key}
                        >
                          {column.render
                            ? column.render(row)
                            : row[column.key]}
                        </td>

                      )
                    )}

                  </tr>

                )
              )

            ) : (

              <tr>

                <td
                  colSpan={
                    columns.length || 1
                  }
                  className="data-table-empty"
                >
                  {emptyMessage}
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

      {/* FOOTER */}
      <div className="data-table-footer">

        <div className="data-table-showing">

          Showing{" "}

          <strong>
            {startRecord}
          </strong>

          {" "}to{" "}

          <strong>
            {endRecord}
          </strong>

          {" "}of{" "}

          <strong>
            {data.length}
          </strong>

          {" "}records

        </div>

        {/* PAGINATION */}
        {data.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

      </div>

    </div>
  );
};

export default DataTable;