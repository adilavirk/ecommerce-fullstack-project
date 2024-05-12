import Cookies from "js-cookie";

//1.add new product
export const addNewProduct = async (formData) => {
  try {
    const response = await fetch("/api/admin/add-product", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });
    const finalData = await response.json();

    return finalData;
  } catch (error) {
    console.log("error occured while adding the product", error);
  }
};

//2. get all products from database

export const getAllProducts = async () => {
  try {
    //here we will give absolute url.
    const response = await fetch(
      "http://localhost:3000/api/admin/all-products",
      {
        method: "GET",
        cache: "no-store",
      }
    );

    const finalData = await response.json();

    return finalData;
  } catch (error) {
    console.log("error occured while adding the product", error);
  }
};
// 3.update product
export const updateAProduct = async (formData) => {
  try {
    const response = await fetch("/api/admin/update-product", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });

    const finalData = await response.json();

    return finalData;
  } catch (error) {
    throw new Error("Failed to update the product. Please try again.");
  }
};

//4.delete product

export const deleteAProduct = async (id) => {
  try {
    const response = await fetch(`/api/admin/delete-product?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    const finalData = await response.json();
    console.log("deleted data is", finalData);
    return finalData;
  } catch (error) {
    throw new Error("Failed to delete the product. Please try again.");
  }
};

// 5. filter products by category

export const productsByCategory = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/client/filter-products-by-category?id=${id}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    const finalData = await response.json();
    return finalData;
  } catch (error) {
    throw new Error("Failed to fetch the product. Please try again.");
  }
};

// 6.single product detail service

export const ProductById = async (id) => {
  try {
    const response = await fetch(
      `http://localhost:3000/api/client/product-by-id?id=${id}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
    const finalData = await response.json();
    return finalData;
  } catch (error) {
    throw new Error("Failed to fetch the product. Please try again.");
  }
};
