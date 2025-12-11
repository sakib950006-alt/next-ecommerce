import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export const isAuthenticated = async (role) => {
  try {
    const cookieStore = await cookies();

    if (!cookieStore.has("access_token")) {
      return { isAuth: false, user: null, message: "Not logged in" };
    }

    const token = cookieStore.get("access_token").value;

    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.SECRET_KEY)
    );

    // ROLE MATCH
    if (payload.role !== role) {
      return { isAuth: false, user: null, message: "Unauthorized" };
    }

   return {
  isAuth: true,
  userId: payload.id,
user: {
  _id: payload._id,
  role: payload.role,
  email: payload.email,
  name: payload.name,
  avatar: payload.avatar
},
  message: "Authenticated"
};



  } catch (error) {
    return { isAuth: false, user: null, message: "Invalid token" };
  }
};
