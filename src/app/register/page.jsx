"use client";
import InputComponent from "../../components/InputComponent";
import SelectComponent from "../../components/SelectComponent";
import { registrationFormControls } from "../../utils/index";
import React, { useContext, useEffect, useState } from "react";
import { registerNewUser } from "../../services/register/index";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { GlobalContext } from "../../context";
import ComponentLevelLoader from "../../components/ComponentLevelLoader";

// handle form data from frontend(integrate backend with frontend)
const initialFormData = {
  name: "",
  email: "",
  password: "",
  role: "customer",
};

const RegisterPage = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [isRegistered, setIsRegistered] = useState(false);
  const { componentLevelLoader, setComponentLevelLoader, isAuthUser } =
    useContext(GlobalContext);
  const router = useRouter();

  //   frontend form validation
  function isValidForm() {
    return formData &&
      formData.email &&
      formData.email.trim() !== "" &&
      formData.password &&
      formData.password.trim() !== ""
      ? true
      : false;
    //   if all of these fields are not empty this will be "true" alse this will be "false"
  }

  const handleRegisterOnSubmit = async () => {
    try {
      setComponentLevelLoader({ loading: true, id: "" });
      const data = await registerNewUser(formData);
      // if the user is registered user not be able to go to the able to go to the registered page.

      if (data.success) {
        toast.success(data.message);
        setIsRegistered(true);
        setComponentLevelLoader({ loading: false, id: "" });
        setFormData(initialFormData);
      }
    } catch (error) {
      setComponentLevelLoader({ loading: false, id: "" });
      toast.error(error.message);
      setFormData(initialFormData);
    }
  };

  useEffect(() => {
    if (isAuthUser) router.push("/");
  }, [isAuthUser]);

  return (
    <div className="bg-white relative">
      <div className="flex flex-col items-center justify-between pt-0 pb-0 pr-10 pl-10 mt-8 mr-auto  xl:px-5 lg:flex-row">
        <div className="flex flex-col justify-center items-center w-full pr-10 pl-10 lg:flex-row">
          <div className="w-full mt-20 mr-0 mb-0 ml-0 relative max-w-2xl lg:mt-0 lg:w-5/12">
            <div className="flex flex-col items-center justify-start p-10 bg-white shadow-2xl rounded-xl relative z-10">
              <p className="w-full text-4xl font-medium text-center font-serif">
                {isRegistered
                  ? "Registration Successfull !"
                  : "Sign up for an account"}
              </p>
              {isRegistered ? (
                <button
                  className="formButtonsStyle"
                  onClick={() => router.push("/login")}
                >
                  Login
                </button>
              ) : (
                <div className="w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8">
                  {registrationFormControls.map((controlItem) =>
                    controlItem.componentType === "input" ? (
                      <InputComponent
                        key={controlItem.id}
                        type={controlItem.type}
                        placeholder={controlItem.placeholder}
                        label={controlItem.label}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            [controlItem.id]: event.target.value,
                          })
                        }
                        value={formData[controlItem.id]}
                      />
                    ) : controlItem.componentType === "select" ? (
                      <SelectComponent
                        options={controlItem.options}
                        label={controlItem.label}
                        onChange={(event) => {
                          setFormData({
                            ...formData,
                            [controlItem.id]: event.target.value,
                          });
                        }}
                        value={formData[controlItem.id]}
                      />
                    ) : null
                  )}
                  <button
                    className="formButtonsStyle disabled:opacity-50"
                    disabled={!isValidForm()}
                    onClick={handleRegisterOnSubmit}
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
                      "Register"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
