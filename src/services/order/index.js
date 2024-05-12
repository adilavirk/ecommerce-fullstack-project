import Cookies from "js-cookie";

export const createNewOrder = async (formData) => {
  try {
    const response = await fetch("/api/order/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

//2.getAllOrdersForUser
export const getAllOrdersForUser = async (id) => {
  try {
    const response = await fetch(`/api/order/get-all-orders?id=${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });

    const data = await response.json();
    console.log(data);

    return data;
  } catch (e) {
    console.log(e);
  }
};

// 3.getOrderDetails
export const getOrderDetails = async (id) => {
  try {
    const response = await fetch(`/api/order/order-details?id=${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
    });
    const finalData = await response.json();
    return finalData;
  } catch (error) {
    console.log(error);
  }
};
