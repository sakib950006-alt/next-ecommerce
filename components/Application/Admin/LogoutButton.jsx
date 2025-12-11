import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { WEBSITE_LOGIN } from "@/routes/websiteRoute";
import { logout } from "@/store/reducer/authReducer";
import axios from "axios";
import { useRouter } from "next/navigation"; // ✅ use this for Next.js App Router
import React from "react";
import toast from "react-hot-toast";
import { AiOutlineLogout } from "react-icons/ai";
import { useDispatch } from "react-redux";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { data: logoutResponse } = await axios.post("/api/auth/logout");

      if (!logoutResponse?.success) {
        throw new Error("Logout failed");
      }

      dispatch(logout());
      toast.success("Logout successful");
      router.push(WEBSITE_LOGIN);
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
      <AiOutlineLogout className="text-red-500 mr-2" />
      Logout
    </DropdownMenuItem>
  );
};

export default LogoutButton;
