import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const registerSchema = z
  .object({
    username: z.string().min(5, "Username phải dài hơn 4 ký tự"),
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(7, "Mật khẩu phải dài hơn 6 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type RegisterValues = z.infer<typeof registerSchema>;

function AuthPage() {
  const nav = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterValues) => {
    // TODO: call signup API
    toast.success("Đăng ký thành công");
    reset({ username: "", email: "", password: "", confirmPassword: "" });
    nav("/list");
    console.log("register:", values);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-semibold mb-6 text-center">Đăng ký</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        <div>
          <label className="block text-sm font-medium mb-1">Username</label>
          <input
            type="text"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập username"
            {...register("username")}
          />
          {errors.username && (
            <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="you@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mật khẩu</label>
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="•••••••"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Xác nhận mật khẩu</label>
          <input
            type="password"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="•••••••"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Đang đăng ký..." : "Đăng ký"}
        </button>
      </form>
    </div>
  );
}

export default AuthPage;
