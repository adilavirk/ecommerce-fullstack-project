import { NextResponse } from "next/server";
import { connectToDB } from "../../../../database/dbConfig";
import AuthUser from "../../../../middleware/AuthUser";
import Order from "../../../../models/orderModel";
import Cart from "../../../../models/cart";

export const dynamic = "force-dynamic";

export const POST = async (request) => {
  try {
    await connectToDB();
    const isAuthUser = await AuthUser(request);
    if (isAuthUser) {
      const data = await request.json();
      const { user, orderItems } = data;

      // Calculate total price
      const totalPrice = orderItems.reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0);

      // Add total price to the data
      data.totalPrice = totalPrice;

      const saveNewOrder = await Order.create(data);

      // if order is saved
      if (saveNewOrder) {
        // Delete all the cart items for that particular user after payment is successful.
        await Cart.deleteMany({ userID: user });

        return NextResponse.json({
          success: true,
          message: "Products are on the way!",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to create an order. Please try again!",
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "You are not authenticated.",
      });
    }
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { message: "Something went wrong! Please try again" },
      { status: 500 }
    );
  }
};
