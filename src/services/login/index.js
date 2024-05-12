export const loginUser = async (formData) => {
  try {
    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const finalData = await response.json();

    return finalData;
  } catch (error) {
    console.log("error occured while logging in api file new user", error);
  }
};
