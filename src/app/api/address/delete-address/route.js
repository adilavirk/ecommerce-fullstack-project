import { NextResponse } from "next/server";
import { connectToDB } from "../../../../database/dbConfig";
import AuthUser from "../../../../middleware/AuthUser";
import Address from "../../../../models/addressModel";

export const dynamic = "force-dynamic";

export const DELETE = async (request) => {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");
    // if there is no id
    if (!id) {
      return NextResponse.json({
        success: false,
        message: "Address ID is required.",
      });
    }

    const isAuthUser = await AuthUser(request);
    if (isAuthUser) {
      const deleteAddress = await Address.findByIdAndDelete(id);
      if (deleteAddress) {
        return NextResponse.json({
          success: true,
          message: "Address deleted successfully.",
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to delete the address. Please try again!",
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
