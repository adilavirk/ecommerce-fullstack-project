"use client";

import { usePathname } from "next/navigation";
import React, { useContext } from "react";
import { GlobalContext } from "../context";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { deleteAProduct } from "../services/product";
import { addToCart } from "../services/cart/index";
import ComponentLevelLoader from "./ComponentLevelLoader";

const ProductButtons = ({ item, refreshProducts }) => {
  // to check wether it is admin view or not.
  const pathname = usePathname();
  const isAdminView = pathname.includes("admin-view"); //returns true or false.

  const {
    setCurrentUpdatedProduct,
    setComponentLevelLoader,
    componentLevelLoader,
    user,
    showCartModal,
    setShowCartModal,
  } = useContext(GlobalContext);
  const router = useRouter();

  // delete product method

  const handleDeleteProduct = async (item) => {
    try {
      const response = await deleteAProduct(item._id);
      if (response.success) {
        setComponentLevelLoader({ loading: false, id: "" });
        toast.success(response.message);
        // router.refresh();
        refreshProducts();
      } else {
        setComponentLevelLoader({ loading: false, id: "" });
        toast.error("Failed to delete the product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.message);
      setComponentLevelLoader({ loading: false, id: "" });
    }
  };

  // handleAddToCart method

  async function handleAddToCart(getItem) {
    setComponentLevelLoader({ loading: true, id: getItem._id });

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

  return isAdminView ? (
    <>
      {/* Update button */}
      <button
        onClick={() => {
          setCurrentUpdatedProduct(item);
          router.push("/admin-view/add-product");
        }}
        className="buttonsStyle w-full"
      >
        Update
      </button>
      {/* DELETE button */}
      <button
        onClick={() => handleDeleteProduct(item)}
        className="buttonsStyle w-full"
      >
        {componentLevelLoader &&
        componentLevelLoader.loading &&
        item._id === componentLevelLoader.id ? (
          <ComponentLevelLoader
            text={"Deleting Product"}
            color={"#ffffff"}
            loading={componentLevelLoader && componentLevelLoader.loading}
          />
        ) : (
          "DELETE"
        )}
      </button>
    </>
  ) : (
    <>
      {/* add to cart buuton */}
      <button
        onClick={() => handleAddToCart(item)}
        className="buttonsStyle w-full"
      >
        {componentLevelLoader &&
        componentLevelLoader.loading &&
        componentLevelLoader.id === item._id ? (
          <ComponentLevelLoader
            text={"Adding to cart"}
            color={"#ffffff"}
            loading={componentLevelLoader && componentLevelLoader.loading}
          />
        ) : (
          "Add To Cart"
        )}
      </button>
    </>
  );
};

export default ProductButtons;
