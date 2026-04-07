import { Pagination } from "antd";

export default function AppPagination({ page, size, total, onChange }) {
  return (
    <div className="pagination">
      <Pagination
        current={page + 1}
        pageSize={size}
        total={total}
        onChange={(p, s) => {
          onChange(p - 1, s);
        }}
      />
    </div>
  );
}
