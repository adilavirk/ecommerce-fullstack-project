import Cookies from "js-cookie";

//1.get the orders of all users

export const getAllOrdersOfAllUsers = async () => {
  try {
    const response = await fetch(`/api/admin/orders/get-all-orders`, {
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

// 2.update the order of user

export const updateUserOrder = async (formData) => {
  try {
    const response = await fetch(`/api/admin/orders/update-order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("token")}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    console.log(data);

    return data;
  } catch (e) {
    console.log(e);
  }
};
