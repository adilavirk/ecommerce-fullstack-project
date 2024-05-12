import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.url.pathname;

  const token = request.cookies.get("token")?.value || "";
  const isPublicPath = path === "/login" || path === "/signup";

  // Redirect to homepage if trying to access public paths while logged in
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect to login page if trying to access private paths without being logged in
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // // Additional check for order details page
  // if (path.startsWith("/orders/") && !token) {
  //   console.log("Redirecting to login page:", path, token);
  //   return NextResponse.redirect(new URL("/login", request.url));
  // }

  // // Allow access to other pages
  // return NextResponse.next();
}

// Middleware configuration for pages
export const config = {
  matcher: [
    "/cart",
    "/checkout",
    "/account",
    "/orders",
    "/admin-view",
    "/admin-view/add-product",
    "/admin-view/all-products",
  ],
};
