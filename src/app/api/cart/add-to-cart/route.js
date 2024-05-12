import { NextResponse } from "next/server";
import { connectToDB } from "../../../../database/dbConfig";
import AuthUser from "../../../../middleware/AuthUser";
import Joi from "joi";
import Cart from "../../../../models/cart";

// addToCart schema validation
const addToCart = Joi.object({
  userID: Joi.string().required(),
  productID: Joi.string().required(),
});

export const dynamic = "force-dynamic";

export const POST = async (request) => {
  try {
    await connectToDB();
    // Middleware
    const isAuthUser = await AuthUser(request);

    if (isAuthUser) {
      const data = await request.json();

      const { productID, userID } = data; // Extract quantity from data

      // Check if schema is valid
      const { error } = addToCart.validate({ userID, productID });
      if (error) {
        return NextResponse.json({
          success: false,
          message: error.details[0].message,
        });
      }

      // Check if the product already exists in the cart
      const existingCartItem = await Cart.find({
        productID: productID,
        userID: userID,
      });

      if (existingCartItem?.length > 0) {
        return NextResponse.json({
          success: false,
          message:
            "Product is already added in cart! Please add different product",
        });
      }

      // If the product does not exist in the cart and quantity is provided, save it
      const saveProductToCart = await Cart.create(data);

      if (saveProductToCart) {
        return NextResponse.json({
          success: true,
          message: "Product is added to the cart.",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to add the product to the cart! Please try again.",
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
