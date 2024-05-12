import { NextResponse } from "next/server";
import { connectToDB } from "../../../../database/dbConfig";
import AuthUser from "../../../../middleware/AuthUser";
import Order from "../../../../models/orderModel";

export const dynamic = "force-dynamic";

export const GET = async (request) => {
  try {
    await connectToDB();
    const isAuthUser = await AuthUser(request);
    if (isAuthUser) {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get("id");

      if (!id) {
        return NextResponse.json({
          success: false,
          message: "Product id is required.",
        });
      }

      const extractOrderDetails = await Order.findById(id).populate(
        "orderItems.product"
      );

      if (extractOrderDetails) {
        return NextResponse.json({
          success: true,
          data: extractOrderDetails,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Order not found. Please try again! ",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "You are not authenticated.",
      });
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong! Please try again" },
      { status: 500 }
    );
  }
};
