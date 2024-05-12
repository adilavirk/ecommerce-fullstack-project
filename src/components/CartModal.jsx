import Link from "next/link";
import { GlobalContext } from "../context";
import { deleteFromCart, getAllCartItems } from "../services/cart";
import CommonModal from "./CommonModal";
import { Fragment, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ComponentLevelLoader from "./ComponentLevelLoader";
import Image from "next/image";
import { PulseLoader } from "react-spinners";

const CartModal = () => {
  const {
    showCartModal,
    setShowCartModal,
    user,
    cartItems,
    setCartItems,
    setComponentLevelLoader,
    componentLevelLoader,
    pageLevelLoader,
    setPageLevelLoader,
  } = useContext(GlobalContext);

  const router = useRouter();

  //   get all cart items

  const extractAllCartItems = async () => {
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
      localStorage.setItem("cartItems", JSON.stringify(updatedData));
    }
  };

  useEffect(() => {
    if (user !== null) extractAllCartItems();
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

  return (
    <CommonModal
      showButtons={true}
      show={showCartModal}
      setShow={setShowCartModal}
      mainContent={
        cartItems && cartItems.length ? (
          <ul role="list" className="-my-2 md:-my-6 divide-y divide-gray-300">
            {cartItems?.map((item) => (
              <li key={item?.id} className="flex py-6">
                {/* product image */}
                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                  <img
                    src={item?.productID?.imageUrl}
                    alt="cart item"
                    className="h-full w-full object-cover object-center"
                  />
                </div>
                {/* product name */}
                <div className="ml-4 flex flex-1 flex-col">
                  <div>
                    <div className="flex justify-between text-base font-medium text-gray-900">
                      <h3>
                        <Link href={"#"}>{item?.productID?.name}</Link>
                      </h3>
                    </div>
                    {/*  price*/}
                    <p className="mt-1 text-sm text-gray-600">
                      ${item?.productID?.price}
                    </p>
                  </div>
                  {/*Remove Button  */}
                  <div className="flex flex-1 items-end justify-between text-sm">
                    <button
                      type="button"
                      className="font-medium text-yellow-600 sm:order-2"
                      onClick={() => handleDeleteCartItem(item)}
                    >
                      {componentLevelLoader &&
                      componentLevelLoader.loading &&
                      componentLevelLoader.id === item._id ? (
                        <ComponentLevelLoader
                          text={"Removing"}
                          textColor={"black"}
                          color={"#D69E2E"}
                          loading={
                            componentLevelLoader && componentLevelLoader.loading
                          }
                        />
                      ) : (
                        "Remove"
                      )}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <>
            {/* Empty cart Icon */}
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
                </div>
              </>
            )}
          </>
        )
      }
      buttonComponent={
        <Fragment>
          <button
            className="buttonsStyle w-full"
            type="button"
            onClick={() => {
              router.push("/cart");
              setShowCartModal(false);
            }}
          >
            Go to Cart
          </button>
          <button
            className="buttonsStyle disabled:opacity-50 w-full"
            type="button"
            disabled={cartItems && cartItems.length === 0}
            onClick={() => {
              router.push("/checkout"), setShowCartModal(false);
            }}
          >
            Checkout
          </button>
          <div className="mt-6 flex justify-center text-center text-sm text-gray-600">
            <button
              type="button"
              className="font-medium text-gray"
              onClick={() => {
                router.push("/product/listing/all-products");
                setShowCartModal(false);
              }}
            >
              Continue Shopping
              <span aria-hidden="true"> &rarr;</span>
            </button>
          </div>
        </Fragment>
      }
    />
  );
};

export default CartModal;
