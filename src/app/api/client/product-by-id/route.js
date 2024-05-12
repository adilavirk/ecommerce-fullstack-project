import { NextResponse } from "next/server";
import { connectToDB } from "../../../../database/dbConfig";
import Product from "../../../../models/productModel";

export const dynamic = "force-dynamic";

export const GET = async (request) => {
  try {
    await connectToDB();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("id");

    if (!productId) {
      return NextResponse.json(
        {
          success: false,
          message: "Product ID is required.",
        },
        { status: 400 }
      );
    }

    const getData = await Product.find({ _id: productId });

    if (getData && getData.length) {
      return NextResponse.json(
        {
          success: true,
          message: "Product details fetched successfully!",
          data: getData[0],
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "No Products found.",
        },
        { status: 204 } //the server has successfully fulfilled the request, there is no available content for this request.
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong! Please try again" },
      { status: 500 }
    );
  }
};
