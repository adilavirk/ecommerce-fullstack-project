import { NextResponse } from "next/server";
import { connectToDB } from "../../../../database/dbConfig";
import AuthUser from "../../../../middleware/AuthUser";
import Address from "../../../../models/addressModel";

export const dynamic = "force-dynamic";

export const GET = async (request) => {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({
        success: false,
        message: "You are not logged In.",
      });
    }

    const isAuthUser = await AuthUser(request);
    if (isAuthUser) {
      const getAllAdresses = await Address.find({ userID: id });

      if (getAllAdresses) {
        return NextResponse.json({
          success: true,
          message: "All addresses fetched successfully.",
          data: getAllAdresses,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to fetch all addresses. Please try again!",
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
