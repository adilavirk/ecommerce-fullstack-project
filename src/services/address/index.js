import Cookies from "js-cookie";
//1. add new address

export const addNewAdress = async (formData) => {
  try {
    const response = await fetch("/api/address/add-new-address", {
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
    console.log(error);
  }
};

// 2.fetchAllAdresses
export const fetchAllAdresses = async (id) => {
  try {
    const response = await fetch(`/api/address/get-all-address?id=${id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch addresses");
    }

    const finalData = await response.json();
    return finalData;
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return { success: false, message: "Failed to fetch addresses" };
  }
};
// 3. update the Adress
export const updateAddress = async (formData) => {
  try {
    const response = await fetch("/api/address/update-address", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });

    const finalData = await response.json();

    return finalData;
  } catch (error) {
    console.log(error);
  }
};
// 4.
export const deleteAddress = async (id) => {
  try {
    const response = await fetch(`/api/address/delete-address?id=${id}`, {
      method: "DELETE",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    const finalData = await response.json();
    return finalData;
  } catch (error) {
    console.log(error);
  }
};
