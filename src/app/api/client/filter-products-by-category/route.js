import { connectToDB } from "../../../../database/dbConfig";
import Product from "../../../../models/productModel";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const GET = async (request) => {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const getData = await Product.find({ category: id });

    if (getData) {
      return NextResponse.json(
        {
          success: true,
          message: "Products fetched successfully!",
          data: getData,
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
