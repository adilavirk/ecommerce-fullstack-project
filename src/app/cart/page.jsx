"use client";

import { useContext, useEffect } from "react";
import CommonCart from "../../components/CommonCart";
import { deleteFromCart, getAllCartItems } from "../../services/cart";
import { GlobalContext } from "../../context";
import { PulseLoader } from "react-spinners";
import toast from "react-hot-toast";

const Cart = () => {
  const {
    user,
    setCartItems,
    cartItems,
    pageLevelLoader,
    setPageLevelLoader,
    setComponentLevelLoader,
    componentLevelLoader,
  } = useContext(GlobalContext);
  //   get all cart items

  const extractAllCartItems = async () => {
    setPageLevelLoader(true);
    const response = await getAllCartItems(user?._id);

    if (response.success) {
      const updatedData =
        response.data && response.data.length
          ? response.data.map((item) => ({
              ...item,
              productID: {
                ...item.productID,
                price:
                  item.productID.onSale === "yes"
                    ? parseInt(
                        (
                          item.productID.price -
                          item.productID.price *
                            (item.productID.priceDrop / 100)
                        ).toFixed(2)
                      )
                    : item.productID.price,
              },
            }))
          : [];
      setCartItems(updatedData);
      setPageLevelLoader(false);
      localStorage.setItem("cartItems", JSON.stringify(updatedData));
    }
  };

  useEffect(() => {
    if (user !== null) {
      extractAllCartItems();
    }
  }, [user]);

  //   handleDeleteCartItem
  const handleDeleteCartItem = async (item) => {
    setComponentLevelLoader({ loading: true, id: item?._id });
    const response = await deleteFromCart(item?._id);

    if (response.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(response.message);

      //   this will call the api data again
      extractAllCartItems();
    } else {
      toast.error(response.message);
      setComponentLevelLoader({ loading: false, id: item?._id });
    }
  };

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
    <CommonCart
      cartItems={cartItems}
      handleDeleteCartItem={handleDeleteCartItem}
      componentLevelLoader={componentLevelLoader}
    />
  );
};

export default Cart;
