"use client";

import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";

export const GlobalContext = createContext(null);
//initial checkout state
export const initialCheckoutFormData = {
  shippingAddress: {},
  paymentMethod: "",
  totalPrice: "",
  isPaid: false,
  paidAt: new Date(),
  isProcessing: true,
};

export const GlobalState = ({ children }) => {
  const pathName = usePathname();
  const router = useRouter();
  const [showNavModal, setShowNavModal] = useState(false);
  const [pageLevelLoader, setPageLevelLoader] = useState(true);
  const [componentLevelLoader, setComponentLevelLoader] = useState({
    loading: false,
    id: "",
  });
  const [isAuthUser, setIsAuthUser] = useState(null);
  const [user, setUser] = useState(null);
  // state to fetch all the products/store all the products
  const [data, setData] = useState([]);
  // state to update the product
  const [currentUpdatedProduct, setCurrentUpdatedProduct] = useState(null);
  // state for cart modal
  const [showCartModal, setShowCartModal] = useState(false);
  // state for cart Items
  const [cartItems, setCartItems] = useState([]);
  // state to store the list of addresses
  const [addresses, setAddresses] = useState([]);
  // state to store checkout data
  const [checkoutFormData, setCheckOutFormData] = useState(
    initialCheckoutFormData
  );
  const [addressFormData, setAddressFormData] = useState({
    fullName: "",
    city: "",
    country: "",
    postalCode: "",
    address: "",
  });

  // state to store all orders of user

  const [allOrdersForUser, setAllOrdersForUser] = useState([]);

  // state store to order details
  const [orderDetails, setOrderDetails] = useState(null);

  // state for admin to get all the orders of all users
  const [allOrdersOfAllUsers, setAllOrdersOfAllUsers] = useState(null);

  useEffect(() => {
    // ager cookies k andr token undefined nhi h yani token mil rha h hmen to it means user is authenticated user

    if (Cookies.get("token") !== undefined) {
      setIsAuthUser(true);
      const userData = JSON.parse(localStorage.getItem("user")) || {};
      setUser(userData);

      const getCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      setCartItems(getCartItems);
    } else {
      setIsAuthUser(false);
      setUser({});
    }
  }, [Cookies]);

  // check user access if user is customer not admin then user should not be able to view the admin pages.

  const protectedAdminRoutes = [
    "/admin-view",
    "/admin-view/add-product",
    "/admin-view/all-products",
  ];

  useEffect(() => {
    if (
      user !== null &&
      user &&
      Object.keys(user).length > 0 && //checking if user exists or not
      user?.role !== "admin" &&
      protectedAdminRoutes.indexOf(pathName) > -1
    ) {
      router.push("/unauthorized-page");
    }
  }, [user, pathName]);

  return (
    <GlobalContext.Provider
      value={{
        cartItems,
        setCartItems,
        showCartModal,
        setShowCartModal,
        showNavModal,
        setShowNavModal,
        componentLevelLoader,
        setComponentLevelLoader,
        pageLevelLoader,
        setPageLevelLoader,
        isAuthUser,
        setIsAuthUser,
        user,
        setUser,
        currentUpdatedProduct,
        setCurrentUpdatedProduct,
        addresses,
        setAddresses,
        addressFormData,
        setAddressFormData,
        checkoutFormData,
        setCheckOutFormData,
        allOrdersForUser,
        setAllOrdersForUser,
        orderDetails,
        setOrderDetails,
        allOrdersOfAllUsers,
        setAllOrdersOfAllUsers,
        data,
        setData,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
