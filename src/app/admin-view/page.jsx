"use client";

import { useContext, useEffect } from "react";
import { GlobalContext } from "../../context";
import {
  getAllOrdersOfAllUsers,
  updateUserOrder,
} from "../../services/admin/order/index";
import { PulseLoader } from "react-spinners";
import Image from "next/image";
import ComponentLevelLoader from "../../components/ComponentLevelLoader";

const AdminView = () => {
  const {
    allOrdersOfAllUsers,
    setAllOrdersOfAllUsers,
    user,
    pageLevelLoader,
    setPageLevelLoader,
    componentLevelLoader,
    setComponentLevelLoader,
  } = useContext(GlobalContext);
  // to get all orders of all users

  const extractAllOrdersForAllUsers = async () => {
    setPageLevelLoader(true);
    const response = await getAllOrdersOfAllUsers();

    console.log(response);

    if (response.success) {
      setPageLevelLoader(false);
      setAllOrdersOfAllUsers(
        response?.data && response?.data.length
          ? response.data.filter((item) => item.user._id !== user._id)
          : []
      );
    } else {
      setPageLevelLoader(false);
    }
  };

  useEffect(() => {
    if (user !== null) extractAllOrdersForAllUsers();
  }, [user]);

  // to update the order
  const handleUpdateOrderStatus = async (item) => {
    setComponentLevelLoader({ loading: true, id: item?._id });

    const response = await updateUserOrder({
      ...item,
      isProcessing: false,
    });
    if (response.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      extractAllOrdersForAllUsers();
    } else {
      setComponentLevelLoader({ loading: true, id: "" });
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
    <section>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div>
          <div className="px-4 py-6 sm:px-8 sm:py-10">
            <div className="flow-root">
              {allOrdersOfAllUsers && allOrdersOfAllUsers.length ? (
                <ul className="flex flex-col gap-4">
                  {allOrdersOfAllUsers?.map((item) => (
                    <li
                      key={item?._id}
                      className="bg-gray-200 shadow p-5 flex flex-col space-y-3 py-6 text-left"
                    >
                      <div className="flex">
                        <h1 className="font-bold text-lg mb-3 flex-1">
                          #order: {item?._id}
                        </h1>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center">
                            <p className="mr-3 text-sm font-medium text-gray-900">
                              User Name :
                            </p>
                            <p className="text-sm  font-semibold text-gray-900">
                              {item?.user?.name}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <p className="mr-3 text-sm font-medium text-gray-900">
                              User Email :
                            </p>
                            <p className="text-sm  font-semibold text-gray-900">
                              {item?.user?.email}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <p className="mr-3 text-sm font-medium text-gray-900">
                              Total Paid Amount :
                            </p>
                            <p className="text-sm  font-semibold text-gray-900">
                              ${item?.totalPrice}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {item?.orderItems?.map((orderItem, index) => (
                          <div key={index} className="shrink-0">
                            <Image
                              alt="Order Item"
                              className="h-24 w-24 max-w-full rounded-lg object-cover"
                              height={100}
                              width={100}
                              src={orderItem?.product?.imageUrl}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-5">
                        <button className="disabled:opacity-50 mt-5 mr-5  inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide">
                          {item?.isProcessing
                            ? "Order is Processing"
                            : "Order is delivered"}
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(item)}
                          disabled={!item?.isProcessing}
                          className="disabled:opacity-50 mt-5 mr-5  inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide"
                        >
                          {componentLevelLoader &&
                          componentLevelLoader.loading &&
                          componentLevelLoader.id === item._id ? (
                            <ComponentLevelLoader
                              text={"Updating Order Status"}
                              color={"#ffffff"}
                              loading={
                                componentLevelLoader &&
                                componentLevelLoader.loading
                              }
                            />
                          ) : (
                            "Update Order Status"
                          )}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminView;
