"use client";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../context/index";
import { useRouter } from "next/navigation";
import InputComponent from "../../components/InputComponent";
import { addNewAddressFormControls } from "../../utils";
import {
  addNewAdress,
  deleteAddress,
  fetchAllAdresses,
  updateAddress,
} from "../../services/address/index";
import toast from "react-hot-toast";
import ComponentLevelLoader from "../../components/ComponentLevelLoader";
import { PulseLoader } from "react-spinners";

const Account = () => {
  const {
    user,
    addresses,
    setAddresses,
    addressFormData,
    setAddressFormData,
    componentLevelLoader,
    setComponentLevelLoader,
    pageLevelLoader,
    setPageLevelLoader,
  } = useContext(GlobalContext);
  const router = useRouter();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [currentEditedAddressId, setCurrentEditedAddressId] = useState(null);

  //   function to handle how to add and update address
  const handleAddOrUpdateAddress = async () => {
    setComponentLevelLoader({ loading: true, id: "" });
    const response =
      currentEditedAddressId !== null
        ? await updateAddress({
            ...addressFormData,
            _id: currentEditedAddressId,
          })
        : await addNewAdress({
            ...addressFormData,
            userID: user?._id,
          });

    if (response.success) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.success(response.message);
      setAddressFormData({
        fullName: "",
        city: "",
        country: "",
        postalCode: "",
        address: "",
      });

      // when we will add new address we will fetch all the addresses to get the updated address that we have just added.
      extractAllAddresses();
      setCurrentEditedAddressId(null);
      setShowAddressForm(false);
    } else {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.error(response.message);
      setAddressFormData({
        fullName: "",
        city: "",
        country: "",
        postalCode: "",
        address: "",
      });
    }
  };

  //   method to extract/fetch all the addresses

  const extractAllAddresses = async () => {
    setPageLevelLoader(true);
    const response = await fetchAllAdresses(user?._id);

    if (response.success) {
      setPageLevelLoader(false);
      setAddresses(response.data);
    }
  };
  //  method to update the addresses
  const handleUpdateAddress = (item) => {
    setShowAddressForm(true);
    setAddressFormData({
      fullName: item.fullName,
      city: item.city,
      country: item.country,
      postalCode: item.postalCode,
      address: item.address,
    });
    setCurrentEditedAddressId(item._id);
    // Call extractAllAddresses() here to ensure that addressFormData and currentEditedAddressId are set synchronously
    extractAllAddresses();
  };
  // function to delete address

  const handleDeleteAddress = async (item) => {
    setComponentLevelLoader({ loading: true, id: item._id });
    const response = await deleteAddress(item._id);
    if (response.success) {
      setComponentLevelLoader({ loading: true, id: "" });
      toast.success("Address deleted successfully");
      extractAllAddresses();
    } else {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.error(response.message);
    }
  };

  useEffect(() => {
    if (user !== null) {
      extractAllAddresses();
    }
  }, [user]);
  return (
    <div>
      <div className="mx-auto bg-gray-100 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow">
          <div className="p-6 sm:p-12">
            <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-6 md:flex-row">
              {/* we will render random user image here */}
            </div>

            {/* render user */}
            <div className="flex flex-col flex-1">
              <h4 className="text-lg font-semibold text-center md:text-left">
                {user?.name}
              </h4>
              {/* email and role */}
              <p>{user?.email}</p>
              <p>{user?.role}</p>
            </div>

            {/* list of orders of the particular user */}

            <button
              className="buttonsStyle mt-5"
              onClick={() => router.push("/orders")}
            >
              View Your Orders
            </button>

            {/*List of Addresses */}
            <div className="mt-6">
              <h1 className="font-bold text-lg">Your Addresses : </h1>
              {pageLevelLoader ? (
                <PulseLoader
                  color={"#000000"}
                  loading={pageLevelLoader}
                  size={15}
                  data-testid="loader"
                />
              ) : (
                <div className="mt-4 flex flex-col gap-4">
                  {addresses && addresses.length ? (
                    addresses?.map((item) => (
                      <div key={item?._id} className="border p-6">
                        <p>Name: {item?.fullName}</p>
                        <p>Address: {item?.address}</p>
                        <p>City: {item?.city}</p>
                        <p>Country: {item?.country}</p>
                        <p>PostalCode: {item?.postalCode}</p>
                        <button
                          onClick={() => handleUpdateAddress(item)}
                          className="buttonsStyle mt-5 mr-5"
                        >
                          UPDATE
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(item)}
                          className="buttonsStyle mt-5"
                        >
                          {componentLevelLoader &&
                          componentLevelLoader.loading &&
                          componentLevelLoader.id === item._id ? (
                            <ComponentLevelLoader
                              text={"Deleting"}
                              color={"#ffffff"}
                              loading={
                                componentLevelLoader &&
                                componentLevelLoader.loading
                              }
                            />
                          ) : (
                            "Delete"
                          )}
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>No addresses found ! Please add a new address below</p>
                  )}
                </div>
              )}
            </div>
            <div className="mt-4">
              <button
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="buttonsStyle mt-5"
              >
                {showAddressForm ? "Hide Address Form" : "Add New Address"}
              </button>
            </div>

            {/* render form on the click of add new address button */}

            {showAddressForm ? (
              <div className="flex flex-col mt-5 pt-4 justify-center items-center">
                <div className="w-full mt-6 mb-0 mx-0 space-y-8 ">
                  {/* creating form controls here */}

                  {addNewAddressFormControls?.map((controlItem) => (
                    <InputComponent
                      key={controlItem?.id}
                      type={controlItem?.type}
                      placeholder={controlItem?.placeholder}
                      label={controlItem?.label}
                      value={addressFormData[controlItem.id]}
                      onChange={(event) =>
                        setAddressFormData({
                          ...addressFormData,
                          [controlItem.id]: event.target.value,
                        })
                      }
                    />
                  ))}
                </div>
                {/* form save button */}

                <button
                  onClick={handleAddOrUpdateAddress}
                  className="buttonsStyle mt-5"
                >
                  {componentLevelLoader && componentLevelLoader.loading ? (
                    <ComponentLevelLoader
                      text={"Saving"}
                      color={"#ffffff"}
                      loading={
                        componentLevelLoader && componentLevelLoader.loading
                      }
                    />
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
