import { Pagination } from "antd";
import "../../assets/styles/AppPagination.css";

export default function AppPagination({ page, size, total, onChange }) {
  return (
    <div className="app-pagination">
      <Pagination
        current={page + 1}
        pageSize={size}
        total={total}
        showSizeChanger={false}
        onChange={(p, s) => onChange(p - 1, s)}
      />
    </div>
  );
}
