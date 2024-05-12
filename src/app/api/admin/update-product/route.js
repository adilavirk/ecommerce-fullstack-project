import { NextResponse } from "next/server";
import { connectToDB } from "../../../../database/dbConfig";
import Product from "../../../../models/productModel";
import AuthUser from "../../../../middleware/AuthUser";

export const dynamic = "force-dynamic";

export const PUT = async (request) => {
  try {
    await connectToDB();
    const isAuthUser = await AuthUser(request);
    if (isAuthUser?.role === "admin") {
      const extractData = await request.json();
      const {
        _id,
        name,
        description,
        price,
        sizes,
        imageUrl,
        category,
        deliveryInfo,
        onSale,
        priceDrop,
      } = extractData;
      const updatedProducted = await Product.findOneAndUpdate(
        {
          _id: _id,
        },
        {
          _id,
          name,
          description,
          price,
          sizes,
          imageUrl,
          category,
          deliveryInfo,
          onSale,
          priceDrop,
        },
        { new: true }
      );

      // if product is updated
      if (updatedProducted) {
        return NextResponse.json(
          { success: true, message: "Product updated successfully." },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          {
            success: false,
            message: "Failed to update the product.Please try again!",
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
