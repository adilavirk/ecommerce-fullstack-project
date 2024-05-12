export const registerNewUser = async (formData) => {
  try {
    const response = await fetch("/api/users/register", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const finalData = await response.json();
    return finalData;
  } catch (error) {
    console.log("error occured while registering new user", error);
  }
};
