// import React, { useEffect, useMemo, useState } from "react";
// import { Form, Modal, Switch } from "antd";
// import AdminPageSection from "../../components/admin/AdminPageSection";
// import AdminViewDrawer from "../../components/admin/user/AdminViewDrawer";
// import BaseTable from "../../components/common/BaseTable";
// import TableActions from "../../components/common/TableActions";
// import AppPagination from "../../components/common/AppPagination";
// import FoodImage from "../../components/common/FoodImage";
// import AddFoodModal from "../../components/admin/food/AddFoodModal";
// import EditFoodModal from "../../components/admin/food/EditFoodModal";
// import {
//   loadSharedFoods,
//   loadSharedCategories,
//   saveSharedFoods,
//   SHARED_DATA_UPDATED_EVENT,
// } from "../../utils/sharedData";

// const pageSize = 4;
// const formatPriceVND = (priceValue) =>
//   `${Number(priceValue || 0).toLocaleString("vi-VN")} đ`;
// const parseAdditionalImages = (value) =>
//   String(value || "")
//     .split(/[\n,]/)
//     .map((s) => s.trim())
//     .filter(Boolean);

// const AdminFoods = () => {
//   const [items, setItems] = useState(() => loadSharedFoods());
//   const [categories, setCategories] = useState(() =>
//     loadSharedCategories().filter((c) => c.id !== 1),
//   );
//   const [page, setPage] = useState(0);
//   const [openAdd, setOpenAdd] = useState(false);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [openDelete, setOpenDelete] = useState(false);
//   const [openView, setOpenView] = useState(false);
//   const [editingRecord, setEditingRecord] = useState(null);
//   const [search, setSearch] = useState("");
//   const [categoryFilter, setCategoryFilter] = useState("all");
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [form] = Form.useForm();

//   useEffect(() => {
//     const syncSharedData = () => {
//       setItems(loadSharedFoods());
//       setCategories(loadSharedCategories().filter((c) => c.id !== 1));
//     };
//     syncSharedData();
//     window.addEventListener("focus", syncSharedData);
//     window.addEventListener("storage", syncSharedData);
//     window.addEventListener(SHARED_DATA_UPDATED_EVENT, syncSharedData);
//     return () => {
//       window.removeEventListener("focus", syncSharedData);
//       window.removeEventListener("storage", syncSharedData);
//       window.removeEventListener(SHARED_DATA_UPDATED_EVENT, syncSharedData);
//     };
//   }, []);

//   const filteredItems = useMemo(() => {
//     const keyword = search.trim().toLowerCase();
//     return items.filter((item) => {
//       const matchKeyword =
//         !keyword || String(item.name).toLowerCase().includes(keyword);
//       const matchCategory =
//         categoryFilter === "all" ||
//         String(item.category_id) === String(categoryFilter);
//       const matchStatus =
//         statusFilter === "all" || item.status === statusFilter;
//       return matchKeyword && matchCategory && matchStatus;
//     });
//   }, [categoryFilter, items, search, statusFilter]);

//   const pageData = useMemo(
//     () => filteredItems.slice(page * pageSize, page * pageSize + pageSize),
//     [filteredItems, page],
//   );
//   const handleToggleStatus = (id) => {
//     const nextItems = items.map((item) =>
//       item.id === id
//         ? {
//             ...item,
//             status: item.status === "active" ? "inactive" : "active",
//           }
//         : item,
//     );

//     setItems(nextItems);
//     saveSharedFoods(nextItems);
//   };
//   const columns = [
//     {
//       title: "Ảnh",
//       dataIndex: "image",
//       width: 80,
//       render: (image) => (
//         <FoodImage src={image} size={44} radius={10} textSize={22} />
//       ),
//     },
//     { title: "Món ăn", dataIndex: "name" },
//     {
//       title: "Danh mục",
//       dataIndex: "category_id",
//       render: (id) =>
//         categories.find((c) => c.id === id)?.name || "Chưa phân loại",
//     },
//     {
//       title: "Giá",
//       dataIndex: "price",
//       render: (v) => formatPriceVND(v),
//     },
//     {
//       title: "Trạng thái",
//       dataIndex: "status",
//       render: (_, record) => (
//         <Switch
//           checked={record.status === "active"}
//           checkedChildren="Đang bán"
//           unCheckedChildren="Tạm hết"
//           onChange={() => handleToggleStatus(record.id)}
//         />
//       ),
//     },
//     {
//       title: "Thao tác",
//       render: (_, record) => (
//         <TableActions
//           record={record}
//           showView={true}
//           onView={(r) => {
//             setEditingRecord(r);
//             setOpenView(true);
//           }}
//           onEdit={(r) => onOpenEdit(r)}
//           onDelete={(id) => {
//             const found = items.find((x) => x.id === id);
//             setEditingRecord(found || null);
//             setOpenDelete(true);
//           }}
//         />
//       ),
//     },
//   ];

//   const onAdd = (values) => {
//     const nextItems = [
//       ...items,
//       {
//         id: Date.now(),
//         name: values.name,
//         category_id: Number(values.category),
//         price: (values.priceInThousand || 0) * 1000,
//         image: values.image || "",
//         images: [
//           values.image || "",
//           ...parseAdditionalImages(values.additionalImages),
//         ].filter(Boolean),
//         rating: 4.5,
//         sold: 0,
//         desc: "Món mới cập nhật từ admin.",
//         badge: null,
//         status: "active",
//       },
//     ];
//     setItems(nextItems);
//     saveSharedFoods(nextItems);
//     setOpenAdd(false);
//     form.resetFields();
//   };

//   const onOpenEdit = (record) => {
//     setEditingRecord(record);
//     setOpenEdit(true);
//   };

//   const onEdit = (values) => {
//     const nextItems = items.map((it) =>
//       it.id === editingRecord?.id
//         ? {
//             ...it,
//             name: values.name,
//             image: values.image || "",
//             images: [
//               values.image || "",
//               ...parseAdditionalImages(values.additionalImages),
//             ].filter(Boolean),
//             category_id: Number(values.category),
//             price: (values.priceInThousand || 0) * 1000,
//           }
//         : it,
//     );
//     setItems(nextItems);
//     saveSharedFoods(nextItems);
//     setOpenEdit(false);
//     setEditingRecord(null);
//     form.resetFields();
//   };

//   const onDelete = () => {
//     const nextItems = items.filter((it) => it.id !== editingRecord?.id);
//     setItems(nextItems);
//     saveSharedFoods(nextItems);
//     setOpenDelete(false);
//     setEditingRecord(null);
//   };

//   return (
//     <>
//       <AdminPageSection
//         title="Quản lý món ăn"
//         subtitle="Quản lý thực đơn, giá bán, trạng thái hiển thị và chất lượng món."
//         stats={[
//           { label: "Tổng món", value: "168" },
//           { label: "Đang bán", value: "142" },
//           { label: "Tạm ngưng", value: "19" },
//           { label: "Món nổi bật", value: "7" },
//         ]}
//         actionLabel="+ Thêm món ăn"
//         onAddClick={() => {
//           form.resetFields();
//           form.setFieldValue("image", "");
//           form.setFieldValue("additionalImages", "");
//           setOpenAdd(true);
//         }}
//         topControls={
//           <>
//             <input
//               className="admin-control search"
//               placeholder="Tìm món ăn..."
//               value={search}
//               onChange={(e) => {
//                 setSearch(e.target.value);
//                 setPage(0);
//               }}
//             />
//             <select
//               className="admin-control"
//               value={categoryFilter}
//               onChange={(e) => {
//                 setCategoryFilter(e.target.value);
//                 setPage(0);
//               }}
//             >
//               <option value="all">Tất cả danh mục</option>
//               {categories.map((c) => (
//                 <option key={c.id} value={c.id}>
//                   {c.name}
//                 </option>
//               ))}
//             </select>
//             <select
//               className="admin-control"
//               value={statusFilter}
//               onChange={(e) => {
//                 setStatusFilter(e.target.value);
//                 setPage(0);
//               }}
//             >
//               <option value="all">Tất cả trạng thái</option>
//               <option value="active">Đang bán</option>
//               <option value="inactive">Tạm hết</option>
//             </select>
//           </>
//         }
//         table={<BaseTable columns={columns} data={pageData} />}
//         pagination={
//           <AppPagination
//             page={page}
//             size={pageSize}
//             total={filteredItems.length}
//             onChange={(p) => setPage(p)}
//           />
//         }
//       />
//       <AddFoodModal
//         open={openAdd}
//         onCancel={() => setOpenAdd(false)}
//         onSubmit={onAdd}
//         categories={categories}
//         form={form}
//       />
//       <EditFoodModal
//         open={openEdit}
//         onCancel={() => {
//           setOpenEdit(false);
//           setEditingRecord(null);
//         }}
//         onSubmit={onEdit}
//         categories={categories}
//         form={form}
//         record={editingRecord}
//       />
//       <Modal
//         open={openDelete}
//         title="Xác nhận xóa món"
//         onCancel={() => setOpenDelete(false)}
//         onOk={onDelete}
//         okText="Xóa"
//         okButtonProps={{ danger: true }}
//       >
//         <p>Bạn chắc chắn muốn xóa món này?</p>
//       </Modal>

//       <AdminViewDrawer
//         title="Thông tin món ăn"
//         open={openView}
//         onClose={() => {
//           setOpenView(false);
//           setEditingRecord(null);
//         }}
//         fields={[
//           {
//             label: "Ảnh",
//             value: editingRecord?.image ? (
//               <FoodImage
//                 src={editingRecord.image}
//                 size={72}
//                 radius={10}
//                 textSize={30}
//               />
//             ) : (
//               "—"
//             ),
//           },
//           {
//             label: "Ảnh phụ",
//             value:
//               editingRecord?.images && editingRecord.images.length > 1 ? (
//                 <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
//                   {editingRecord.images
//                     .filter((img) => img && img !== editingRecord.image)
//                     .map((img, idx) => (
//                       <FoodImage
//                         key={`${editingRecord.id}-extra-${idx}`}
//                         src={img}
//                         size={56}
//                         radius={8}
//                         textSize={22}
//                       />
//                     ))}
//                 </div>
//               ) : (
//                 "—"
//               ),
//           },
//           { label: "Tên món", value: editingRecord?.name },
//           {
//             label: "Danh mục",
//             value: categories.find((c) => c.id === editingRecord?.category_id)
//               ?.name,
//           },
//           { label: "Giá", value: formatPriceVND(editingRecord?.price) },
//           {
//             label: "Trạng thái",
//             value: editingRecord?.status === "active" ? "Đang bán" : "Tạm hết",
//           },
//           { label: "Mô tả", value: editingRecord?.desc },
//         ]}
//       />
//     </>
//   );
// };
// export default AdminFoods;
import React, { useEffect, useMemo, useState } from "react";
import { Form, Modal, Switch, Input, message } from "antd";

import UserHeader from "../../components/user/UserHeader";
import StatsCards from "../../components/common/StatsCards";
import BaseTable from "../../components/common/BaseTable";
import TableActions from "../../components/common/TableActions";
import AppPagination from "../../components/common/AppPagination";
import FoodImage from "../../components/common/FoodImage";

import FoodCreateModal from "../../components/modal/admin/FoodCreateModal";
import FoodUpdateModal from "../../components/modal/admin/FoodUpdateModal";

import {
  loadSharedFoods,
  loadSharedCategories,
  saveSharedFoods,
} from "../../utils/sharedData";

const pageSize = 5;

const formatPrice = (v) => `${Number(v || 0).toLocaleString("vi-VN")}đ`;

const parseImages = (value) =>
  String(value || "")
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);

const AdminFoods = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const [editingRecord, setEditingRecord] = useState(null);

  const [form] = Form.useForm();

  // ================= LOAD =================
  useEffect(() => {
    setItems(loadSharedFoods());
    setCategories(loadSharedCategories());
  }, []);

  // ================= FILTER =================
  const filteredItems = useMemo(() => {
    const keyword = search.toLowerCase();
    return items.filter((it) =>
      String(it.name).toLowerCase().includes(keyword),
    );
  }, [items, search]);

  const pageData = useMemo(
    () => filteredItems.slice(page * pageSize, page * pageSize + pageSize),
    [filteredItems, page],
  );

  // ================= STATUS =================
  const toggleStatus = (id) => {
    const newList = items.map((it) =>
      it.id === id
        ? { ...it, status: it.status === "active" ? "inactive" : "active" }
        : it,
    );
    setItems(newList);
    saveSharedFoods(newList);
  };

  // ================= CRUD =================
  const handleAdd = (values) => {
    const newItem = {
      id: Date.now(),
      name: values.name,
      category_id: Number(values.category),
      price: (values.priceInThousand || 0) * 1000,
      image: values.image || "",
      images: [values.image, ...parseImages(values.additionalImages)],
      status: "active",
    };

    const newList = [newItem, ...items];
    setItems(newList);
    saveSharedFoods(newList);

    message.success("Thêm món thành công");
    setOpenAdd(false);
    form.resetFields();
  };

  const handleEdit = (values) => {
    const newList = items.map((it) =>
      it.id === editingRecord.id
        ? {
            ...it,
            name: values.name,
            category_id: Number(values.category),
            price: (values.priceInThousand || 0) * 1000,
            image: values.image || "",
            images: [values.image, ...parseImages(values.additionalImages)],
          }
        : it,
    );

    setItems(newList);
    saveSharedFoods(newList);

    message.success("Cập nhật thành công");
    setOpenEdit(false);
    setEditingRecord(null);
  };

  const handleDelete = () => {
    const newList = items.filter((it) => it.id !== editingRecord.id);

    setItems(newList);
    saveSharedFoods(newList);

    message.success("Xóa thành công");
    setOpenDelete(false);
    setEditingRecord(null);
  };

  // ================= TABLE =================
  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      render: (img) => <FoodImage src={img} size={40} />,
    },
    {
      title: "Tên món",
      dataIndex: "name",
    },
    {
      title: "Danh mục",
      dataIndex: "category_id",
      render: (id) => categories.find((c) => c.id === id)?.name || "—",
    },
    {
      title: "Giá",
      dataIndex: "price",
      render: (v) => formatPrice(v),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (_, record) => (
        <Switch
          checked={record.status === "active"}
          onChange={() => toggleStatus(record.id)}
        />
      ),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <TableActions
          record={record}
          onEdit={(r) => {
            setEditingRecord(r);
            form.setFieldsValue({
              ...r,
              category: r.category_id,
              priceInThousand: r.price / 1000,
            });
            setOpenEdit(true);
          }}
          onDelete={() => {
            setEditingRecord(record);
            setOpenDelete(true);
          }}
        />
      ),
    },
  ];

  return (
    <>
      {/* HEADER */}
      <UserHeader
        title="Quản lý món ăn"
        description="Quản lý thực đơn"
        buttonText="Thêm món"
        handleAdd={() => {
          form.resetFields();
          setOpenAdd(true);
        }}
      />

      {/* STATS */}
      <StatsCards
        items={[
          { title: "Tổng món", value: items.length },
          {
            title: "Đang bán",
            value: items.filter((i) => i.status === "active").length,
          },
          {
            title: "Tạm hết",
            value: items.filter((i) => i.status === "inactive").length,
          },
        ]}
      />

      {/* SEARCH */}
      <div className="filter-bar">
        <Input
          placeholder="Tìm món..."
          allowClear
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
      </div>

      {/* TABLE */}
      <div className="admin-table-wrapper">
        <BaseTable columns={columns} data={pageData} />
      </div>

      {/* PAGINATION */}
      <AppPagination
        page={page}
        size={pageSize}
        total={filteredItems.length}
        onChange={(p) => setPage(p)}
      />

      <FoodCreateModal
        open={openAdd}
        onCancel={() => setOpenAdd(false)}
        onSubmit={handleAdd}
        categories={categories}
        form={form}
      />

      <FoodUpdateModal
        open={openEdit}
        onCancel={() => setOpenEdit(false)}
        onSubmit={handleEdit}
        categories={categories}
        form={form}
        record={editingRecord}
      />

      {/* DELETE */}
      <Modal
        title="Xác nhận xóa"
        open={openDelete}
        onCancel={() => setOpenDelete(false)}
        onOk={handleDelete}
        okButtonProps={{ danger: true }}
      >
        <p>Bạn chắc chắn muốn xóa món này?</p>
      </Modal>
    </>
  );
};

export default AdminFoods;
