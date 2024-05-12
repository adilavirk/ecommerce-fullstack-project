import { NextResponse } from "next/server";
import { connectToDB } from "../../../../database/dbConfig";
import AuthUser from "../../../../middleware/AuthUser";
import Joi from "joi";
import Address from "../../../../models/addressModel";

export const dynamic = "force-dynamic";

// schema validation

const AddNewAdress = Joi.object({
  fullName: Joi.string().required(),
  address: Joi.string().required(),
  city: Joi.string().required(),
  country: Joi.string().required(),
  postalCode: Joi.string().required(),
  userID: Joi.string().required(),
});

export const POST = async (request) => {
  try {
    await connectToDB();
    const isAuthUser = await AuthUser(request);

    if (isAuthUser) {
      const extractData = await request.json();
      const { fullName, address, city, country, postalCode, userID } =
        extractData;

      const { error } = AddNewAdress.validate({
        fullName,
        address,
        city,
        country,
        postalCode,
        userID,
      });

      if (error) {
        return NextResponse.json({
          success: false,
          message: error.details[0].message,
        });
      }

      //   if there is no error then create the address.

      const newlyAddedAddress = await Address.create(extractData);

      if (newlyAddedAddress) {
        return NextResponse.json({
          success: true,
          message: "Address added successfully!",
          data: newlyAddedAddress,
        });
      } else {
        return NextResponse.json({
          success: false,
          message: "Failed to add address.Please try again!",
          status: 400,
        });
      }
    } else {
      return NextResponse.json({
        success: false,
        message: "You are not authenticated user!",
        status: 400,
      });
    }
  } catch (error) {
    return NextResponse.json({
      message: "Something went wrong! Please try again",
      status: 500,
    });
  }
};
