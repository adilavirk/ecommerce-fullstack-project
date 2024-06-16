"use client";

import Link from "next/link";
import ComponentLevelLoader from "./ComponentLevelLoader";
import { GlobalContext } from "../context";
import { useContext } from "react";
import ProductDetailsCrousel from "../components/ProductDetailsCrousel";
import toast from "react-hot-toast";
import { addToCart } from "../services/cart/index";

const CommonDetailsPage = ({ item }) => {
  const {
    setComponentLevelLoader,
    componentLevelLoader,
    user,
    setShowCartModal,
  } = useContext(GlobalContext);

  // handleAddToCart method

  async function handleAddToCart(getItem) {
    setComponentLevelLoader({ loading: true, id: "" });

    const response = await addToCart({
      productID: getItem._id,
      userID: user._id,
    });

    if (response.success) {
      toast.success(response.message);
      setComponentLevelLoader({ loading: false, id: "" });
      setShowCartModal(true);
    } else {
      toast.error(response.message);
      setComponentLevelLoader({ loading: false, id: "" });
      setShowCartModal(true);
    }

    console.log(response);
  }
  return (
    <section className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto px-4">
        <div className="lg:col-gap-12 xl:col-gap-16 mt-8 grid grid-cols-1 gap-12 lg:mt-12 lg:grid-cols-5 lg:gap-16">
          {/* left part */}
          <div className="lg:col-span-3 lg:row-end-1">
            <div className="lg:flex lg:items-start">
              <div className="lg:order-2 lg:ml-5">
                <div className="max-w-xl overflow-hidden rounded-lg">
                  <ProductDetailsCrousel data={item} />
                </div>
              </div>
            </div>
          </div>
          {/* right part */}
          <div className="lg:col-span-2 lg:row-span-2 lg:row-end-2">
            <h1 className="text-2xl font-bold text-gray-900">{item?.name}</h1>
            <div className="mt-10 flex flex-col items-center justify-between space-y-4 border-t border-b py-4 sm:flex-row sm:space-y-0">
              <div className="flex items-end">
                <h1
                  className={`text-3xl font-bold mr-2 ${
                    item?.onSale === "yes" ? "line-through" : ""
                  }`}
                >
                  ${item?.price}
                </h1>
                {item?.onSale === "yes" ? (
                  <h1 className="text-3xl font-bold text-red-700">{`$${(
                    item.price -
                    item.price * (item.priceDrop / 100)
                  ).toFixed(2)}`}</h1>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => handleAddToCart(item)}
                className="buttonsStyle"
              >
                {componentLevelLoader && componentLevelLoader.loading ? (
                  <ComponentLevelLoader
                    text={"Adding to Cart"}
                    color={"#ffffff"}
                    loading={
                      componentLevelLoader && componentLevelLoader.loading
                    }
                  />
                ) : (
                  "Add to Cart"
                )}
              </button>
            </div>
            <ul className="mt-8 space-y-2">
              <li className="flex items-center text-left text-sm font-medium text-gray-600">
                {item && item.deliveryInfo}
              </li>
              <li className="flex items-center text-left text-sm font-medium text-gray-600">
                {"Cancel anytime"}
              </li>
            </ul>

            {/* display sizes */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Available Sizes:</h2>
              <div className="flex space-x-2 mt-2">
                {item?.sizes?.map((size) => (
                  <span
                    key={size.id}
                    className="px-4 py-2 border rounded-lg text-center"
                  >
                    {size.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3 mt-8">
              <div className="border-b border-gray-400">
                <nav className="flex gap-4">
                  <Link
                    href="#"
                    className="border-b-2 border-gray-900 py-4 text-sm font-medium text-gray-900"
                  >
                    Description
                  </Link>
                </nav>
              </div>
              <div className="mt-8 flow-root sm:mt-12">{item?.description}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommonDetailsPage;
