import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import AuthApi from "@/api/authApi";
import { useNavigate } from "react-router-dom";
import User, { UserRole } from "@/models/user/user";
import UsersApi from "@/api/usersApi";

export default function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const loginMutation = useMutation<{ user: object; token: string }>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (values: any) =>
      AuthApi.login({ email: values.email, password: values.password }),
    mutationKey: ["login"],
  });

  const updateMutation = useMutation({
    mutationKey: ["userUpdate", user?.id],
    mutationFn: UsersApi.update,
  });

  const masterMutation = useMutation({
    mutationKey: ["masterCreation"],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: AuthApi.createMaster,
  })

  async function login(email: string, password: string) {
    const emailParsed = email.trim();
    const passwordParsed = password.trim();
    if (emailParsed === "" || passwordParsed === "") {
      return;
    }
    try {
      //@ts-expect-error 23as
      const res = await loginMutation.mutateAsync({ email, password });
      const user = User.fromJson(res.user);
      if (user.role === UserRole.operator || user.role === UserRole.partner) {
        navigate("/status/app", { replace: true });
        return;
      }

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(user);
      navigate("/admin/dashboard", { replace: true });
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((e as any).message === "CREATE_MASTER") {
          navigate("/create-master", { replace: true });
          return;
        }
    }
  }

  async function createMaster(data: {name: string; lastName: string; rut: string; address: string; email: string; password: string}) {
    if (masterMutation.isPending) {
      return;
    }
    const res = await masterMutation.mutateAsync(data);
    const user = User.fromJson(res.user);
      if (user.role === UserRole.operator || user.role === UserRole.partner) {
        navigate("/status/app", { replace: true });
        return;
      }

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));
      setUser(user);
      navigate("/admin/dashboard", { replace: true });
  }

  async function logout() {
    localStorage.clear();
    setUser(null);
    navigate("/", { replace: true });
  }

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsed = User.fromJson(JSON.parse(user));
      setUser(parsed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function update(user: User) {
    if (!user) {
      return;
    }
    if (updateMutation.isPending) {
      return;
    }
    const userActual = JSON.parse(localStorage.getItem("user")!);
    const data = user.toJson();
    for (const key in data) {
      //@ts-expect-error 23as
      if (data[key] === null) {
        //@ts-expect-error 23as
        delete data[key];
        continue;
      }
      //@ts-expect-error 23as
      if (userActual[key] === data[key]) {
        //@ts-expect-error 23as
        delete data[key];
      }
    }
    await updateMutation.mutateAsync(data);
    const userRes = await UsersApi.getUser(user.id);
    localStorage.setItem("user", JSON.stringify(userRes.user));
    setUser(userRes.user);
  }

  return {
    logged: Boolean(localStorage.getItem("token")),
    user,
    login,
    logout,
    loginMutation: {
      loading: loginMutation.isPending,
      error: loginMutation.error,
    },
    update,
    createMaster: {
      loading: masterMutation.isPending,
      error: masterMutation.error,
      mutate: createMaster,
    },
    updateMutation: {
      loading: updateMutation.isPending,
      error: updateMutation.error,
    },
  };
}
