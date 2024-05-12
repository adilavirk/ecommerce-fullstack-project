"use client";
import InputComponent from "../../../components/InputComponent";
import SelectComponent from "../../../components/SelectComponent";
import TileComponent from "../../../components/TileComponent";
import { AvailableSizes, adminAddProductformControls } from "../../../utils";
import { helperForUploadingImageToFirebase } from "../../../firebase/helperForUploadImageToFirebase";
import { addNewProduct, updateAProduct } from "../../../services/product/index";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../../../context";
import toast from "react-hot-toast";
import ComponentLevelLoader from "../../../components/ComponentLevelLoader";
import { useRouter } from "next/navigation";

const initialFormData = {
  name: "",
  price: 0,
  description: "",
  category: "men",
  sizes: [],
  deliveryInfo: "",
  onSale: "no",
  imageUrl: "",
  priceDrop: 0,
};

const AdminAddNewProduct = () => {
  // all the data we will store on adding new product
  const [formData, setFormData] = useState(initialFormData);
  const router = useRouter();
  // loader from global context
  const {
    componentLevelLoader,
    setComponentLevelLoader,
    currentUpdatedProduct,
    setCurrentUpdatedProduct,
  } = useContext(GlobalContext);

  const handleImage = async (event) => {
    // extract the image url
    const extractImageUrl = await helperForUploadingImageToFirebase(
      event.target.files[0]
    );

    if (extractImageUrl !== "") {
      setFormData({
        ...formData,
        imageUrl: extractImageUrl,
      });
    }
  };

  // function to pass TileComponent as a prop

  const handleTileClick = (getCurrentItem) => {
    let copySizes = [...formData.sizes]; //initial sizes present in initialState of formData

    let index = copySizes.findIndex((item) => item.id === getCurrentItem.id); //check if item is already clicked or not

    if (index === -1) {
      // item is not clicked
      copySizes.push(getCurrentItem);
    } else {
      // if same item is clicked twice then remove it from the array
      copySizes = copySizes.filter((item) => item.id !== getCurrentItem.id);
    }

    setFormData({
      ...formData,
      sizes: copySizes,
    });
  };

  // api call

  const handleAddProduct = async () => {
    try {
      setComponentLevelLoader({ loading: true, id: "" });
      // if the currentUpdatedproduct state which we have defined in the useContext to store the value of the product we want to update is not null/empty it means we weant to update the product so we wil call the "updateProduct" api else "addnewProduct" will be called
      const response =
        currentUpdatedProduct !== null
          ? await updateAProduct(formData)
          : await addNewProduct(formData);

      if (response.success) {
        setComponentLevelLoader({ loading: false, id: "" });
        toast.success(response.message);
        setFormData(initialFormData);
        setCurrentUpdatedProduct(null);

        setTimeout(() => {
          router.push("/admin-view/all-products");
        }, 1000);
      } else {
        toast.error(response.message);
        setComponentLevelLoader({ loading: false, id: "" });
        setFormData(initialFormData);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // to populate fields on the click of update product button

  useEffect(() => {
    if (currentUpdatedProduct !== null) {
      setFormData(currentUpdatedProduct);
    }
  }, [currentUpdatedProduct]);

  return (
    <div className="w-full mt-5 mx-0 mb-0 relative">
      <div className="flex flex-col items-start justify-start p-10 bg-white shadow-2xl rounded-xl relative">
        <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-8">
          {/* Image upload */}
          <input
            accept="image/*"
            max="1000000"
            type="file"
            onChange={handleImage}
          />
          {/* Availabe sizes  */}
          <div className="flex gap-2 flex-col">
            <label>Available sizes</label>
            <TileComponent
              data={AvailableSizes}
              onClick={handleTileClick}
              selected={formData.sizes}
            />
          </div>
          {/* render all other input fileds/form controls */}
          {adminAddProductformControls?.map((controlItem) =>
            controlItem.componentType === "input" ? (
              <InputComponent
                key={controlItem.id}
                type={controlItem.type}
                placeholder={controlItem.placeholder}
                label={controlItem.label}
                value={formData[controlItem.id]}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    [controlItem.id]: event.target.value,
                  })
                }
              />
            ) : controlItem.componentType === "select" ? (
              <SelectComponent
                key={controlItem?.id}
                label={controlItem.label}
                options={controlItem.options}
                value={formData[controlItem.id]}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    [controlItem.id]: event.target.value,
                  })
                }
              />
            ) : null
          )}
          <button onClick={handleAddProduct} className="formButtonsStyle">
            {componentLevelLoader && componentLevelLoader.loading ? (
              <ComponentLevelLoader
                text={
                  currentUpdatedProduct !== null
                    ? "Updating Product"
                    : "Adding Product"
                }
                color={"#ffffff"}
                loading={componentLevelLoader && componentLevelLoader.loading}
              />
            ) : currentUpdatedProduct !== null ? (
              "Update Product"
            ) : (
              "Add Product"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAddNewProduct;
