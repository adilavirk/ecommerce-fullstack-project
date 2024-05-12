"use client";

import { useRouter } from "next/navigation";
import ProductButtons from "./ProductButtons";
import ProductCard from "./ProductCard";
import { useEffect } from "react";

const CommonProductsListing = ({ data }) => {
  // to get the updated data in the product card/to display updated product data on "all-products" page.

  const router = useRouter();
  useEffect(() => {
    // refresh the page.
    router.refresh();
  }, []);
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
                  <ProductButtons item={item} />
                </article>
              ))
            : "No Product Found"}
        </div>
      </div>
    </section>
  );
};

export default CommonProductsListing;
