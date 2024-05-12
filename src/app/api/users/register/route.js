import { connectToDB } from "../../../../database/dbConfig";
import Joi from "joi";
import { NextResponse } from "next/server";
import User from "../../../../models/userModel";
import bcryptjs from "bcryptjs";

// to validate schema we will use "joi" , a schema validator

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().required(),
});

export const dynamic = "force-dynamic";

export async function POST(request) {
  await connectToDB();

  const { name, email, password, role } = await request.json();

  //   validate the schema
  const { error } = schema.validate({ name, email, password, role });

  if (error) {
    return NextResponse.json({
      success: false,
      message: email.details[0],
    });
  }

  //   save user in database
  try {
    //check if user already exists or not
    const isUserAlreadyExists = await User.findOne({ email });
    if (isUserAlreadyExists) {
      return NextResponse.json(
        { error: "User already exists.Please try with different email." },
        { status: 400 } //400 means bad request
      );
    } else {
      //encrypt user password to register user
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);
      // create new user
      const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
        role,
      });
      if (newUser) {
        return NextResponse.json({
          message: "User registered successfully",
          success: true,
          newUser,
        });
      }
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong! Please try again" },
      { status: 500 }
    );
    //500 means internal server error
  }
}
