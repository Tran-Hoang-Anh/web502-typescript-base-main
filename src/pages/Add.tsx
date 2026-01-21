import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import toast from "react-hot-toast";

type FormValues = {
  name: string;
  credit: number;
  category: string;
  teacher: string;
};

const validate = z.object({
  name: z.string().min(4, "Tên phải dài hơn 3 ký tự").max(100),
  credit: z.number().positive("Số tín chỉ phải > 0"),
  category: z.string().min(1, "Vui lòng chọn chuyên mục"),
  teacher: z.string().min(4, "Tên giảng viên phải dài hơn 3 ký tự").max(100),
});

function AddPage() {
  const { id } = useParams(); // params: {id: '1'}
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(validate),
  });

  // get data theo id
  useEffect(() => {
    const getDetail = async () => {
      try {
        const { data } = await axios.get(`http://localhost:3000/courses/${id}`);
        reset(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (id) {
      getDetail();
    }
  }, [id]);

  const onSubmit = async (values: FormValues) => {
    try {
      if (id) {
        // edit
        await axios.put(`http://localhost:3000/courses/${id}`, values);
      } else {
        // add
        await axios.post("http://localhost:3000/courses", values);
      }
      toast.success("Thành công");
      nav("/list");
    } catch (error) {
      console.log(error);
      toast.error("Thất bại: " + (error as AxiosError).message);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Thêm mới</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Text input */}
        <div>
          <label htmlFor="text" className="block font-medium mb-1">
            Text
          </label>
          <input
            {...register("name")}
            type="text"
            id="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span>{errors?.name?.message}</span>
        </div>

        <div>
          <label htmlFor="credit" className="block font-medium mb-1">
            Số tín chỉ
          </label>
          <input
            {...register("credit", { valueAsNumber: true })}
            type="number"
            id="credit"
            min={1}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span>{errors?.credit?.message}</span>
        </div>

        {/* Select */}
        <div>
          <label htmlFor="selectOption" className="block font-medium mb-1">
            Chuyên mục
          </label>
          <select
            {...register("category")}
            id="selectOption"
            className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Chọn --</option>
            <option value="Đại cương">Đại cương</option>
          </select>
          <span>{errors?.category?.message}</span>
        </div>

        <div>
          <label htmlFor="teacher" className="block font-medium mb-1">
            Giảng viên
          </label>
          <input
            {...register("teacher")}
            type="text"
            id="teacher"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span>{errors?.teacher?.message}</span>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
}

export default AddPage;