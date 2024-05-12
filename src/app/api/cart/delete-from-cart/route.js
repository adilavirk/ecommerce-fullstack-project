import { connectToDB } from "../../../../database/dbConfig";
import AuthUser from "../../../../middleware/AuthUser";
import { NextResponse } from "next/server";
import Cart from "../../../../models/cart";

export const dynamic = "force-dynamic";

export const DELETE = async (request) => {
  try {
    await connectToDB();

    const isAuthUser = await AuthUser(request);

    if (isAuthUser) {
      const { searchParams } = new URL(request.url);

      const id = searchParams.get("id");
      // if there is no id
      if (!id) {
        return NextResponse.json({
          success: false,
          message: "Cart Item ID is required.",
        });
      }

      const deleteCartItem = await Cart.findByIdAndDelete(id);
      if (deleteCartItem) {
        return NextResponse.json({
          success: true,
          message: "Cart Item deleted successfully!",
          status: 200,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to delete Cart Item! Please try again.",
          status: 400,
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
