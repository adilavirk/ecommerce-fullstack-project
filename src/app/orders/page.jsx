"use client";

import { useContext } from "react";
import { useEffect } from "react";
import { GlobalContext } from "../../context/index";
import toast from "react-hot-toast";
import { getAllOrdersForUser } from "../../services/order/index";
import { PulseLoader } from "react-spinners";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Orders = () => {
  const {
    user,
    pageLevelLoader,
    setPageLevelLoader,
    allOrdersForUser,
    setAllOrdersForUser,
  } = useContext(GlobalContext);

  const router = useRouter();
  const extractAllOrders = async () => {
    setPageLevelLoader(true);
    const response = await getAllOrdersForUser(user?._id);

    if (response.success) {
      setPageLevelLoader(false);
      setAllOrdersForUser(response.data);
    } else {
      setPageLevelLoader(false);
      toast.error(response.message);
    }
  };

  useEffect(() => {
    if (user !== null) {
      extractAllOrders();
    }
  }, [user]);

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
        <div className="mt-8 max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div>
            <div className="px-4 py-6 sm:px-8 sm:py-10">
              <div className="flow-root">
                {allOrdersForUser && allOrdersForUser.length ? (
                  <ul className="flex flex-col gap-4">
                    {allOrdersForUser.map((item) => (
                      <li
                        key={item?._id}
                        className="bg-gray-100 shadow p-5 flex flex-col space-y-3 py-6 text-left"
                      >
                        <div className="flex">
                          <h1 className="font-bold text-lg mb-3 flex-1">
                            #order: {item?._id}
                          </h1>
                          <div className="flex items-center">
                            <p className="mr-3 text-sm font-medium text-gray-900">
                              Total paid amount
                            </p>
                            <p className="mr-3 text-2xl font-semibold text-gray-900">
                              ${item?.totalPrice}
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {item?.orderItems?.map((orderItem, index) => (
                            <div key={index} classname="shrink-0">
                              <Image
                                src={orderItem?.product?.imageUrl}
                                className="max-w-full rounded-lg object-cover"
                                width={150}
                                height={100}
                                alt="Order Item"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-5">
                          <button className="buttonsStyle">
                            {item?.isProcessing
                              ? "Order is Processing"
                              : "Order is delivered"}
                          </button>
                          <button
                            onClick={() => router.push(`/orders/${item?._id}`)}
                            className="buttonsStyle"
                          >
                            View Order Details
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
      </div>
    </section>
  );
};

export default Orders;
