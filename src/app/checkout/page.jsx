"use client";

import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/index";
import Image from "next/image";
import { fetchAllAdresses } from "../../services/address";
import { useRouter, useSearchParams } from "next/navigation";

import { PulseLoader } from "react-spinners";
import { loadStripe } from "@stripe/stripe-js";
import { callStripeSession } from "../../services/stripe/index";
import { createNewOrder } from "../../services/order/index";
import toast from "react-hot-toast";

const Checkout = () => {
  const {
    cartItems,
    user,
    addresses,
    setAddresses,
    checkoutFormData,
    setCheckOutFormData,
    pageLevelLoader,
    setPageLevelLoader,
  } = useContext(GlobalContext);
  const [selectedAddress, setSelectedAddress] = useState(null);
  // state to check the order is processing or not so that we can show loader if state is currently in processing
  const [isOrderProcessing, setIsOrderProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const router = useRouter();
  const params = useSearchParams();

  // stripe Publishable key
  const publishableKey =
    "pk_test_51PDIcyEGovJJ7bMzkyo6IrssG6VusbFUxlNUvqIztAnJb5GUWp7LtZItffKNnKHWN4lvgYTqgklVcETFQRAdJc2o00z68TPry3";
  // stripe promise
  const stripePromise = loadStripe(publishableKey);

  // method to fetch/get all addresses

  const getAllAddresses = async () => {
    setPageLevelLoader(true);
    const response = await fetchAllAdresses(user?._id);
    if (response.success) {
      setPageLevelLoader(false);
      setAddresses(response.data);
    }
  };

  useEffect(() => {
    if (user !== null) {
      getAllAddresses();
    }
  }, [user]);

  // when order processing is completed
  useEffect(() => {
    async function createFinalOrder() {
      const isStripe = JSON.parse(localStorage.getItem("stripe"));

      if (
        isStripe &&
        params.get("status") === "success" &&
        cartItems &&
        cartItems.length > 0
      ) {
        setIsOrderProcessing(true);
        const getCheckOutFormData = JSON.parse(
          localStorage.getItem("checkoutFormData")
        );

        const createFinalCheckOutFormData = {
          user: user?._id,
          shippingAddress: getCheckOutFormData.shippingAddress,
          orderItems: cartItems.map((item) => ({
            quantity: 1,
            product: item.productID,
          })),

          paymentMethod: "Stripe",
          totalPrice: cartItems.reduce(
            (total, item) => (item.productID.price + total, 0)
          ),

          isPaid: true,
          isProcessing: true,
          paidAt: new Date(),
        };
        const response = await createNewOrder(createFinalCheckOutFormData);

        if (response.success) {
          setIsOrderProcessing(false), setOrderSuccess(true);
          toast.success(response.message);
        } else {
          setIsOrderProcessing(false);
          toast.error(response.message);
        }
      }
    }

    createFinalOrder();
  }, [params.get("status"), cartItems]);

  // function to handle the selected address

  const handleSelectedAddress = (item) => {
    // if we double click or select two times the same address then we have to unselect that address

    if (item._id === selectedAddress) {
      setSelectedAddress(null);
      setCheckOutFormData({
        ...checkoutFormData,
        shippingAddress: {},
      });
      return;
    }
    setSelectedAddress(item?._id);
    setCheckOutFormData({
      ...checkoutFormData,
      shippingAddress: {
        ...checkoutFormData.shippingAddress,
        fullName: item?.fullName,
        city: item?.city,
        country: item?.country,
        postalCode: item?.postalCode,
        address: item?.address,
      },
    });
  };

  // stripe handleCheckout method

  const handleCheckOut = async () => {
    const stripe = await stripePromise;

    const createLineItems = cartItems.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          images: [item.productID.imageUrl],
          name: item.productID.name,
        },
        unit_amount: Math.round(item.productID.price * 100),
      },
      quantity: 1,
    }));

    const response = await callStripeSession(createLineItems);

    console.log(response);
    setIsOrderProcessing(true);

    localStorage.setItem("stripe", true);
    localStorage.setItem("checkoutFormData", JSON.stringify(checkoutFormData));

    // if there is any kind of error
    const { error } = await stripe.redirectToCheckout({
      sessionId: response.id,
    });
    console.log(error);
  };

  // redirect to orders page after successfully placing the order
  useEffect(() => {
    if (orderSuccess) {
      setTimeout(() => {
        // setOrderSuccess(false);
        router.push("/orders");
      }, [2000]);
    }
  }, [orderSuccess]);

  // if order is placed successfully

  if (orderSuccess) {
    return (
      <section className="h-screen bg-gray-200">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mt-8 max-w-screen-xl px-4 sm:px-6 lg:px-8">
            <div className="bg-white shadow">
              <div className="px-4 py-6 sm:px-8 sm:py-10 flex flex-col gap-5">
                <h1 className="font-bold text-lg">
                  Your payment is successful and you will be redirected to
                  orders page in 2 seconds !.
                </h1>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
  // if order is in processing state
  if (isOrderProcessing) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <PulseLoader
          color={"#000000"}
          loading={isOrderProcessing}
          size={30}
          data-testid="loader"
        />
      </div>
    );
  }

  return (
    <div>
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
        <div className="px-4 pt-8">
          <p className="font-medium text-xl">Cart Summary</p>
          <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-5">
            {cartItems && cartItems.length ? (
              cartItems?.map((item) => (
                <div
                  className="flex flex-col rounded-lg bg-white sm:flex-row"
                  key={item._id}
                >
                  {/* product image */}
                  <Image
                    src={item?.productID?.imageUrl}
                    alt="Cart Item"
                    width={120}
                    height={40}
                    className="m-2  rounded-md border object-cover object-center"
                  />

                  {/* product name */}
                  <div className="flex w-full flex-col px-4 py-4">
                    <span className="font-bold">{item?.productID?.name}</span>
                    <span className="font-semibold">
                      ${item?.productID?.price}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <>
                {/* Empty cart Icon */}
                {cartItems?.length < 1 && (
                  <>
                    <div className="flex-[2] flex flex-col items-center pb-[50px] md:-mt-2 ">
                      <Image
                        src="/assets/empty-cart.jpg"
                        height={300}
                        width={300}
                        className="w-[300px] md:w-[400px]"
                      />
                      <span className="text-xl font-bold">
                        Your cart is empty.
                      </span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* renser all the addresses here */}
        <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
          <p className="text-xl font-medium">Shipping address details</p>
          <p className="text-gray-400 font-bold">
            Complete your order by selecting address below
          </p>

          <div className="w-full mt-6 mb-0 mx-0 space-y-6 ">
            {addresses && addresses.length ? (
              addresses?.map((item) => (
                <div
                  onClick={() => handleSelectedAddress(item)}
                  key={item?._id}
                  className={`border p-6 ${
                    item._id === selectedAddress ? "border-red-900" : ""
                  } `}
                >
                  <p>Name: {item?.fullName}</p>
                  <p>Address: {item?.address}</p>
                  <p>City: {item?.city}</p>
                  <p>Country: {item?.country}</p>
                  <p>PostalCode: {item?.postalCode}</p>
                  <button className="buttonsStyle mt-5 mr-5">
                    {item._id === selectedAddress
                      ? "Selected Address"
                      : "Select Address"}
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xl font-bold">
                No addresses found ! Please add a new address below
              </p>
            )}
          </div>
          <button
            className="buttonsStyle my-5 mr-5 "
            onClick={() => router.push("/account")}
          >
            Add New Address
          </button>
          {/* Subtotal */}
          <div className="mt-6 border-t border-b py-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Subtotal</p>
              <p className="text-lg  font-bold text-gray-900">
                $
                {cartItems && cartItems.length
                  ? cartItems.reduce(
                      (total, item) => item?.productID?.price + total,
                      0
                    )
                  : "0"}
              </p>
            </div>

            {/*  */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Shipping</p>
              <p className="text-lg  font-bold text-gray-900">Free</p>
            </div>
            {/* total amount */}

            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Total</p>
              <p className="text-lg  font-bold text-gray-900">
                $
                {cartItems && cartItems.length
                  ? cartItems.reduce(
                      (total, item) => item?.productID?.price + total,
                      0
                    )
                  : "0"}
              </p>
            </div>

            {/* checkout button */}

            <div className="pb-10">
              <button
                disabled={
                  cartItems?.length === 0 ||
                  Object.keys(checkoutFormData.shippingAddress).length === 0
                }
                className="buttonsStyle mt-5 mr-5 w-full disabled:opacity-50"
                onClick={handleCheckOut}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
