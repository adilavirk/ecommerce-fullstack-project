import { NextResponse } from "next/server";
import { connectToDB } from "../../../../database/dbConfig";
import Joi from "joi";
import Product from "../../../../models/productModel";
import AuthUser from "../../../../middleware/AuthUser";

export const dynamic = "force-dynamic";

// schema validation using Joi
const AddNewProductSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  category: Joi.string().required(),
  sizes: Joi.array().required(),
  deliveryInfo: Joi.string().required(),
  onSale: Joi.string().required(),
  priceDrop: Joi.number().required(),
  imageUrl: Joi.string().required(),
});

export const POST = async (request) => {
  try {
    await connectToDB();
    //before adding a product we will check 2 things
    //1.user is authenticated or not
    //2.user is admin user or not

    const isAuthUser = await AuthUser(request);

    if (isAuthUser?.role === "admin") {
      const extractData = await request.json();

      const {
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

      const { error } = AddNewProductSchema.validate({
        name,
        description,
        price,
        sizes,
        imageUrl,
        category,
        deliveryInfo,
        onSale,
        priceDrop,
      });
      if (error) {
        return NextResponse.json({
          success: false,
          message: error.details[0].message,
        });
      }
      //   if there is no error in schema we will create new product.

      const newlyCreatedProduct = await Product.create(extractData);
      //if new product is created successfully add/save  product in database.
      if (newlyCreatedProduct) {
        return NextResponse.json(
          { success: true, message: "Product added successfully." },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          {
            success: false,
            message: "Failed to add the product.Please try again!",
          },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, message: "You are not authenticated user!" },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong! Please try again" },
      { status: 500 }
    );
    //500 means internal server error
  }
};
