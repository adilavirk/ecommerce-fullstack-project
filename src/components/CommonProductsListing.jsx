"use client";

import { useRouter } from "next/navigation";
import ProductButtons from "./ProductButtons";
import ProductCard from "./ProductCard";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context";
import { PulseLoader } from "react-spinners";

const CommonProductsListing = () => {
  const [data, setData] = useState([]);
  const { pageLevelLoader, setPageLevelLoader } = useContext(GlobalContext);
  const getAllProducts = async () => {
    try {
      setPageLevelLoader(true);
      const response = await fetch("/api/admin/all-products", {
        method: "GET",
        cache: "no-store",
      });

      const finalData = await response.json();
      setData(finalData.data);
      setPageLevelLoader(false);
    } catch (error) {
      console.log("error occured while adding the product", error);
    }
  };
  // to get the updated data in the product card/to display updated product data on "all-products" page.

  const router = useRouter();
  useEffect(() => {
    getAllProducts();
    // refresh the page.
    router.refresh();
  }, []);
  // pulse page loader
  if (pageLevelLoader) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <PulseLoader
          color={"#000000"}
          loading={pageLevelLoader}
          size={30}
          data-testid="loader"
        />
      </div>
    );
  }
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="mt-10 grid  grid-cols-2 gap-6  md:grid-cols-3  md:gap-4 lg:grid-cols-4  lg:gap-4 lg:mt-16">
          {data && data.length
            ? data.map((item) => (
                <article
                  className="relative flex flex-col overflow-hidden border cursor-pointer"
                  key={item._id}
                >
                  <ProductCard item={item} />
                  <ProductButtons
                    item={item}
                    refreshProducts={getAllProducts}
                  />
                </article>
              ))
            : null}
        </div>
      </div>
    </section>
  );
};

export default CommonProductsListing;
