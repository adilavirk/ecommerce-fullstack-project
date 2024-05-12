"use client";
import { useRouter } from "next/navigation";
import InputComponent from "../../components/InputComponent";
import SelectComponent from "../../components/SelectComponent";
import { loginFormControls } from "../../utils/index";
import React, { useContext, useEffect, useState } from "react";
import { loginUser } from "../../services/login/index";
import { GlobalContext } from "../../context";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import ComponentLevelLoader from "../../components/ComponentLevelLoader";

//Integrate backend with frontend

const initialFormData = {
  email: "",
  password: "",
};

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState(initialFormData);
  const {
    isAuthUser,
    setIsAuthUser,
    user,
    setUser,
    componentLevelLoader,
    setComponentLevelLoader,
  } = useContext(GlobalContext);

  // to validate form
  const isValidForm = () => {
    return formData &&
      formData.email &&
      formData.email.trim() !== "" &&
      formData.password &&
      formData.password.trim() !== ""
      ? true
      : false;
  };

  //frontend api integration
  async function handleLoginOnSubmit() {
    try {
      setComponentLevelLoader({ loading: true, id: "" });
      const response = await loginUser(formData);

      if (response.success) {
        toast.success(response.message);
        setIsAuthUser(true);
        setUser(response?.finalResult?.user);

        setFormData(initialFormData);
        Cookies.set("token", response?.finalResult?.token);
        localStorage.setItem(
          "user",
          JSON.stringify(response?.finalResult?.user)
        );
        setComponentLevelLoader({ loading: false, id: "" });
      } else {
        toast.error(error.message);
        setIsAuthUser(false);
        setComponentLevelLoader({ loading: false, id: "" });
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  // if the user is logged in user not be able to go to the able to go to the login page.

  useEffect(() => {
    if (isAuthUser) {
      router.push("/");
    }
  }, [isAuthUser]);

  return (
    <div className="bg-white relative">
      <div className="flex flex-col items-center justify-between pt-0 pb-0 pr-10 pl-10 mt-8 mr-auto  xl:px-5 lg:flex-row">
        <div className="flex flex-col justify-center items-center w-full pr-10 pl-10 lg:flex-row">
          <div className="w-full mt-20 mr-0 mb-0 ml-0 relative max-w-2xl lg:mt-0 lg:w-5/12">
            <div className="flex flex-col items-center justify-start p-10 bg-white shadow-2xl rounded-xl relative z-10">
              <p className="w-full text-4xl font-medium text-center font-serif">
                Login
              </p>

              <div className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
                {loginFormControls.map((controlItem) =>
                  controlItem.componentType === "input" ? (
                    <InputComponent
                      key={controlItem.id}
                      type={controlItem.type}
                      placeholder={controlItem.placeholder}
                      label={controlItem.label}
                      value={formData[controlItem.id]}
                      onChange={(event) => {
                        setFormData({
                          ...formData,
                          [controlItem.id]: event.target.value,
                        });
                      }}
                    />
                  ) : controlItem.componentType === "select" ? (
                    <SelectComponent
                      options={controlItem.options}
                      label={controlItem.label}
                    />
                  ) : null
                )}
                <button
                  className="formButtonsStyle disabled:opacity-50"
                  disabled={!isValidForm()}
                  onClick={handleLoginOnSubmit}
                >
                  {componentLevelLoader && componentLevelLoader.loading ? (
                    <ComponentLevelLoader
                      text={"Logging In"}
                      color={"#ffffff"}
                      loading={
                        componentLevelLoader && componentLevelLoader.loading
                      }
                    />
                  ) : (
                    "Login"
                  )}
                </button>
                <div className="flex flex-col gap-2">
                  <p>New to website ?</p>
                  <button
                    className="formButtonsStyle"
                    onClick={() => router.push("/register")}
                  >
                    Register
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
