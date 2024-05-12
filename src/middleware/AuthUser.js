import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

const AuthUser = async (request) => {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  console.log(token);
  //   if token is not present

  if (!token) {
    return false;
  }

  try {
    const extractAuthUserInfo = jwt.verify(token, "default_secret_key");
    if (extractAuthUserInfo) {
      return extractAuthUserInfo;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default AuthUser;
