import { connectToDB } from "../../../../database/dbConfig";
import Joi from "joi";
import { NextResponse } from "next/server";
import User from "../../../../models/userModel";
import bcryptjs, { compare } from "bcryptjs";
import jwt from "jsonwebtoken";

// to validate schema we will use "joi" , a schema validator

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const dynamic = "force-dynamic";

export async function POST(request) {
  await connectToDB();

  const { email, password } = await request.json();

  //   validate the schema
  const { error } = schema.validate({ email, password });

  if (error) {
    return NextResponse.json({
      success: false,
      message: email.details[0],
    });
  }

  try {
    //find the user
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return NextResponse.json(
        { error: "Account not found with this email." },
        { status: 400 } //400 means bad request
      );
    }
    const checkPassword = await compare(password, checkUser.password);
    if (!checkPassword) {
      return NextResponse.json(
        { error: "Incorrect Password.Please try again!" },
        { status: 400 } //400 means bad request
      );
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        email: checkUser?.email,
        role: checkUser?.role,
      },
      "default_secret_key",
      { expiresIn: "1d" }
    );
    const finalResult = {
      token,
      user: {
        email: checkUser.email,
        _id: checkUser._id,
        name: checkUser.name,
        role: checkUser.role,
      },
    };

    return NextResponse.json({
      message: "Logged In Successfully!",
      success: true,
      finalResult,
    });
  } catch (error) {
    console.log("Error occured while logging user");
    return NextResponse.json({ error: error.message }, { status: 500 });
    //500 means internal server error
  }
}
