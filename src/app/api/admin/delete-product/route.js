import { NextResponse } from "next/server";
import { connectToDB } from "../../../../database/dbConfig";
import Product from "../../../../models/productModel";
import AuthUser from "../../../../middleware/AuthUser";

export const dynamic = "force-dynamic";

export const DELETE = async (request) => {
  try {
    await connectToDB();
    const isAuthUser = await AuthUser(request);

    if (isAuthUser?.role === "admin") {
      const { searchParams } = new URL(request.url);
      const id = searchParams.get("id");
      // if there is no id found
      if (!id) {
        return NextResponse.json({
          success: false,
          message: "Product ID is required.",
        });
      }

      const deletedProduct = await Product.findByIdAndDelete(id);
      if (deletedProduct) {
        return NextResponse.json({
          success: true,
          message: "Product deleted successfully.",
        });
      } else {
        return NextResponse.json(
          {
            success: false,
            message: "Failed to delete the product.Please try again!",
          },
          { status: 400 }
        );
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
