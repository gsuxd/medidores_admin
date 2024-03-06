import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import AuthApi from "@/api/authApi";
import { useNavigate } from "react-router-dom";
import User, { UserRole } from "@/models/user/user";

export default function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();
  const loginMutation = useMutation<{user: object, token: string}>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    mutationFn: (values: any) =>
      AuthApi.login({ email: values.email, password: values.password }),
      mutationKey: ['login']
  });

  async function login(email: string, password: string) {
    const emailParsed = email.trim();
    const passwordParsed = password.trim();
    if (emailParsed === "" || passwordParsed === "") {
      return;
    }
    //@ts-expect-error 23as
    const res = await loginMutation.mutateAsync({email, password});
    if (loginMutation.error) {
      return;
    }
    const user = User.fromJson(res.user);
    if (user.role === UserRole.operator || user.role === UserRole.partner) {
      navigate("/app", {replace: true});
      return;
    }
    localStorage.setItem("token", res.token)
    localStorage.setItem("user", JSON.stringify(res.user))
    setUser(user);
    navigate("/admin/dashboard", {replace: true})
  }

  async function logout() {
    localStorage.clear();
    navigate("/", {replace: true});
  }

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setUser(User.fromJson(JSON.parse(user)));
    }
  }, []);

  return {
    logged: true,
    user,
    login,
    logout,
    loginMutation: {
      loading: loginMutation.isPending,
      error: loginMutation.error,
    },
  };
}
