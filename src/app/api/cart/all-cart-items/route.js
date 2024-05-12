import { NextResponse } from "next/server";
import { connectToDB } from "../../../../database/dbConfig";
import AuthUser from "../../../../middleware/AuthUser";
import Cart from "../../../../models/cart";

export const dynamic = "force-dynamic";

export const GET = async (request) => {
  try {
    await connectToDB();
    // if user is logged In only then he will be able to see cart items.
    const isAuthUser = await AuthUser(request);

    if (isAuthUser) {
      const { searchParams } = new URL(request.url);

      const id = searchParams.get("id");
      // if there is no id
      if (!id) {
        return NextResponse.json({
          success: false,
          message: "Please Login.",
        });
      }
      // find all cartItems based on the userID and populate userID and productID
      const extractAllCartItems = await Cart.find({
        userID: id,
      }).populate("productID");

      if (extractAllCartItems) {
        return NextResponse.json({
          success: true,
          data: extractAllCartItems,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "No Cart items are found!",
          status: 204,
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
