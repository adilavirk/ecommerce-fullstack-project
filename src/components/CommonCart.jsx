"use client";

import Image from "next/image";
import ComponentLevelLoader from "./ComponentLevelLoader";
import { useRouter } from "next/navigation";

const CommonCart = ({
  cartItems = [],
  handleDeleteCartItem,
  componentLevelLoader,
}) => {
  const router = useRouter();
  return (
    <section className="h-screen bg-gray-100">
      <div className="max-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mt-8 max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="bg-white shadow">
            {cartItems.length > 0 && (
              <>
                <div className="px-4 py-6 sm:px-8 sm:py-10">
                  <div className="flow-root">
                    {cartItems && cartItems.length ? (
                      <ul className="-my-8">
                        {cartItems?.map((cartItem) => (
                          <li
                            className="flex-col flex space-y-3 py-6 text-left sm:flex-row sm:space-x-5 sm:space-y-0"
                            key={cartItem?.id}
                          >
                            {/* product image */}
                            <div className="shrink-0">
                              <img
                                src={cartItem?.productID?.imageUrl}
                                alt="Product Image"
                                className="h-24 w-25 max-w-full rounded-lg object-cover"
                              />
                            </div>

                            {/*product  name */}
                            <div className="flex flex-1 flex-col justify-between">
                              <div className="sm:col-gap-5 sm:grid sm:grid-cols-2">
                                <div className="pr-8 sm:pr-4">
                                  <p className="text-base font-semibold text-gray-900">
                                    {cartItem?.productID?.name}
                                  </p>
                                </div>

                                {/* product price */}

                                <div className="mt-4 flex gap-3 items-end justify-between sm:mt-0 sm:items-start sm:justify-end">
                                  <p className="shrink-0 w-20 text-base font-semibold text-gray-950 sm:order-1 sm:ml-8 sm:text-right">
                                    ${cartItem?.productID?.price}
                                  </p>

                                  <button
                                    type="button"
                                    className="font-medium text-yellow-600 sm:order-2"
                                    onClick={() =>
                                      handleDeleteCartItem(cartItem)
                                    }
                                  >
                                    {componentLevelLoader &&
                                    componentLevelLoader.loading &&
                                    componentLevelLoader.id === cartItem._id ? (
                                      <ComponentLevelLoader
                                        text={"Removing"}
                                        color={"#D69E2E"}
                                        loading={
                                          componentLevelLoader &&
                                          componentLevelLoader.loading
                                        }
                                      />
                                    ) : (
                                      "Remove"
                                    )}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <h1 className="font-bold text-lg">
                        Your cart is Empty !
                      </h1>
                    )}
                  </div>

                  <div className="mt-6 border-t border-b py-2 ">
                    <div className="flex items-center justify-between">
                      {/* Subtotal */}
                      <p className="text-sm text-gray-400">Subtotal</p>
                      <p className="text-lg text-black font-semibold">
                        $
                        {cartItems && cartItems.length
                          ? cartItems
                              .reduce(
                                (total, item) => item?.productID.price + total,
                                0
                              )
                              .toFixed(2)
                          : "0"}
                      </p>
                    </div>

                    {/* shipping */}
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400">Shipping</p>
                      <p className="text-lg text-black font-semibold">$0</p>
                    </div>

                    {/* total price */}
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400">Total</p>
                      <p className="text-lg text-black font-semibold">
                        ${" "}
                        {cartItems && cartItems.length
                          ? cartItems
                              .reduce(
                                (total, item) => item?.productID.price + total,
                                0
                              )
                              .toFixed(2)
                          : "0"}
                      </p>
                    </div>
                  </div>
                </div>
                {/*  checkout button*/}
                <div className="mt-5 text-center">
                  <button
                    onClick={() => router.push("/checkout")}
                    disabled={cartItems.length === 0}
                    className="formButtonsStyle disabled:opacity-50"
                  >
                    Checkout
                  </button>
                </div>
              </>
            )}

            {cartItems?.length < 1 && (
              <>
                <div className="flex-[2] flex flex-col items-center pb-[50px] md:-mt-12 ">
                  <Image
                    src="/assets/empty-cart.jpg"
                    height={300}
                    width={300}
                    className="w-[300px] md:w-[400px]"
                  />
                  <span className="text-xl font-bold">Your cart is empty.</span>
                  <span className="text-center mt-4 ">
                    Look like you have not added anything in your cart.
                    <br />
                    Go ahead and explore top categories.
                  </span>

                  <div className="mt-6 flex justify-center text-center text-sm text-gray-600">
                    <button
                      type="button"
                      className="font-medium text-gray"
                      onClick={() => {
                        router.push("/product/listing/all-products");
                      }}
                    >
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommonCart;
