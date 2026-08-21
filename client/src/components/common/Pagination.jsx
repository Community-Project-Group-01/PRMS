import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Button from "./Button";

const Pagination = ({ page, pages, total, onPageChange }) => {
  if (!pages || pages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-4 border-t border-gray-200 bg-white px-6 py-4">
      <p className="text-sm text-gray-600">
        Page {page} of {pages} ({total} records)
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="small"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="flex items-center gap-1">
          <FiChevronLeft /> Previous
        </Button>
        <Button
          variant="outline"
          size="small"
          disabled={page >= pages}
          onClick={() => onPageChange(page + 1)}
          className="flex items-center gap-1">
          Next <FiChevronRight />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
