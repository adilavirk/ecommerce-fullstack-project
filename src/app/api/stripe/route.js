import { NextResponse } from "next/server";
import AuthUser from "../../../middleware/AuthUser";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const dynamic = "force-dynamic";

export const POST = async (request) => {
  try {
    const isAuthUser = await AuthUser(request);

    if (!isAuthUser) {
      return NextResponse.json({
        success: false,
        status: 401,
        message: "You are not authenticated.",
      });
    }

    const response = await request.json();
    console.log(response);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: response, // Make sure response is correctly formatted for Stripe
      mode: "payment",
      success_url: "http://localhost:3000/checkout?status=success",
      cancel_url: "http://localhost:3000/checkout?status=cancel",
    });

    return NextResponse.json({
      success: true,
      id: session.id,
      status: 200,
      message: "Payment successful",
    });
  } catch (error) {
    console.error("Error:", error); // Log the error
    return NextResponse.json({
      success: false,
      status: 500,
      message: "Something went wrong! Please try again.",
    });
  }
};
