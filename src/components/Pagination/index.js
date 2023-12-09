import React from "react";
import PropTypes from "prop-types";

const Pagination = ({
  itemsPerPage,
  totalItems,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const maxPagesToShow = 5;

  const calculatePageNumbers = () => {
    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const pagesBeforeCurrent = Math.floor(maxPagesToShow / 2);
    const pagesAfterCurrent = maxPagesToShow - pagesBeforeCurrent - 1;

    let startPage = currentPage - pagesBeforeCurrent;
    let endPage = currentPage + pagesAfterCurrent;

    if (startPage <= 0) {
      startPage = 1;
      endPage = maxPagesToShow;
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = totalPages - maxPagesToShow + 1;
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );
  };

  return (
    <nav className="pagination">
      <ul className="flex max-sm:mt-[15px]  space-x-2">
        <li>
          <button
            className={`${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } max-sm:text-[3vw] max-sm:px-[3vw] max-sm:py-[2vw] px-3 py-2 rounded-md`}
            onClick={() => {
              if (currentPage > 1) {
                onPageChange(currentPage - 1);
              }
            }}
            disabled={currentPage === 1}
          >
            Previous
          </button>
        </li>

        {calculatePageNumbers().map((number) => (
          <li key={number}>
            <button
              className={`${
                number === currentPage
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }  max-sm:text-[3vw] max-sm:px-[3vw] max-sm:py-[2vw] px-3 py-2 rounded-md`}
              onClick={() => onPageChange(number)}
            >
              {number}
            </button>
          </li>
        ))}

        <li>
          <button
            className={`${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } px-3 py-2 max-sm:px-[2.5vw] max-sm:py-[2vw] max-sm:text-[3vw] rounded-md`}
            onClick={() => {
              if (currentPage < totalPages) {
                onPageChange(currentPage + 1);
              }
            }}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

Pagination.propTypes = {
  itemsPerPage: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
