import { NextResponse } from "next/server";
import { connectToDB } from "../../../../../database/dbConfig";
import AuthUser from "../../../../../middleware/AuthUser";
import Order from "../../../../../models/orderModel";

export const dynamic = "force-dynamic";

export const PUT = async (request) => {
  try {
    await connectToDB();
    const isAuthUser = await AuthUser(request);
    const data = await request.json();

    if (isAuthUser?.role === "admin") {
      const {
        _id,
        shippingAddress,
        orderItems,
        paymentMethod,
        isPaid,
        paidAt,
        isProcessing,
      } = data;

      const updateOrder = await Order.findOneAndUpdate(
        { _id: _id },
        {
          shippingAddress,
          orderItems,
          paymentMethod,
          isPaid,
          paidAt,
          isProcessing,
        },
        { new: true }
      );

      if (updateOrder) {
        return NextResponse.json({
          success: true,
          message: "Order updated successfully",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to update the product",
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
