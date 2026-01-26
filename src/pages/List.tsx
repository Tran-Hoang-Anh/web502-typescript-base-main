import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
// type /interface
type Course = {
  id: number;
  name: string;
  credit: number;
  category: string;
  teacher: string;
};

function ListPage() {
  // 1. state
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  // 2. call api

  useEffect(() => {
    // axios async await + try catch
    const getAll = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/courses");
        console.log(data);
        setCourses(data);
      } catch (error) {
        console.log(error);
      }
    };
    getAll();
  }, []);

  const teachers = Array.from(new Set(courses.map((c) => c.teacher))).filter(
    Boolean
  );
  const filtered = courses.filter((c) => {
    const matchName = c.name.toLowerCase().includes(search.toLowerCase());
    const matchTeacher = teacherFilter ? c.teacher === teacherFilter : true;
    return matchName && matchTeacher;
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const paginated = filtered.slice(start, end);

  const goToPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    setPage(p);
  };

  const handleDelete = async (id: number) => {
    const ok = window.confirm("Bạn có chắc muốn xóa mục này?");
    if (!ok) return;
    try {
      await axios.delete(`http://localhost:3000/courses/${id}`);
      setCourses((prev) => {
        const next = prev.filter((c) => c.id !== id);
        const nextFiltered = next.filter((c) => {
          const matchName = c.name
            .toLowerCase()
            .includes(search.toLowerCase());
          const matchTeacher = teacherFilter ? c.teacher === teacherFilter : true;
          return matchName && matchTeacher;
        });
        const newTotalPages = Math.max(
          1,
          Math.ceil(nextFiltered.length / pageSize)
        );
        if (page > newTotalPages) setPage(newTotalPages);
        return next;
      });
      toast.success("Xóa thành công");
    } catch (error) {
      console.log(error);
    }
  };

  // 3. xoa 1 item
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Danh sách</h1>
      <div className="flex flex-col md:flex-row md:items-end md:space-x-4 gap-3 mb-4 text-left">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Tìm theo tên</label>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            type="text"
            placeholder="Nhập tên..."
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="w-full md:w-64">
          <label className="block text-sm font-medium mb-1">Lọc giảng viên</label>
          <select
            value={teacherFilter}
            onChange={(e) => {
              setTeacherFilter(e.target.value);
              setPage(1);
            }}
            className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Tất cả --</option>
            {teachers.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border border-gray-300 text-left">ID</th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Name
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Credit
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Category
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Teacher
              </th>
              <th className="px-4 py-2 border border-gray-300 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {paginated.map((item) => (
              <tr className="hover:bg-gray-50" key={item.id}>
                <td className="px-4 py-2 border border-gray-300">{item.id}</td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.name}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.credit}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.category}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {item.teacher}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <div className="flex items-center gap-3">
                    <Link to={`/edit/${item.id}`} className="text-blue-600 hover:underline">Edit</Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Hiển thị {filtered.length === 0 ? 0 : start + 1}-{Math.min(end, filtered.length)} trong tổng số {filtered.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Trước
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => goToPage(p)}
              className={`px-3 py-1 border rounded ${
                p === currentPage ? "bg-blue-600 text-white border-blue-600" : ""
              }`}
            >
              {p}
            </button>
          ))}
          <button
            className="px-3 py-1 border rounded disabled:opacity-50"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Sau
          </button>
        </div>
      </div>
    </div>
  );
}

export default ListPage;