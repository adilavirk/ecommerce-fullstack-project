import { NextResponse } from "next/server";
import { connectToDB } from "../../../../../database/dbConfig";
import AuthUser from "../../../../../middleware/AuthUser";
import Order from "../../../../../models/orderModel";

export const dynamic = "force-dynamic";

export const GET = async (request) => {
  try {
    await connectToDB();
    const isAuthUser = await AuthUser(request);
    if (isAuthUser?.role === "admin") {
      const getAllOrders = await Order.find({})
        .populate("orderItems.product")
        .populate("user");

      if (getAllOrders) {
        return NextResponse.json({
          success: true,
          message: "Orders fetched successfully",
          data: getAllOrders,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "No orders found",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "You are not authenticated.",
      });
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { message: "Something went wrong! Please try again" },
      { status: 500 }
    );
  }
};
