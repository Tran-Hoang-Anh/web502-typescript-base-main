import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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

  // 3. xoa 1 item
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Danh sách</h1>

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
            {courses.map((item) => (
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
                  <Link to={`/edit/${item.id}`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListPage;