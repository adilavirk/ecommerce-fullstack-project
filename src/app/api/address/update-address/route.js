import { NextResponse } from "next/server";
import { connectToDB } from "../../../../database/dbConfig";
import AuthUser from "../../../../middleware/AuthUser";
import Address from "../../../../models/addressModel";

export const dynamic = "force-dynamic";

export const PUT = async (request) => {
  try {
    await connectToDB();

    const isAuthUser = await AuthUser(request);
    if (isAuthUser) {
      const extractData = await request.json();
      const { fullName, address, city, country, postalCode, _id } = extractData;

      const updateAddress = await Address.findOneAndUpdate(
        {
          _id: _id,
        },
        { fullName, address, city, country, postalCode },
        { new: true }
      );

      if (updateAddress) {
        return NextResponse.json({
          success: true,
          message: "Address updated successfully",
          data: updateAddress,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to update the address.Please try again!",
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
    return NextResponse.json({
      message: "Something went wrong! Please try again",
      status: 500,
    });
  }
};
