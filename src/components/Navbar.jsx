"use client";
import React, { Fragment, useContext, useEffect } from "react";
import NavItems from "./NavItems";
import OpenMenuButton from "./OpenMenuButton";
import { GlobalContext } from "../context/index";
import CommonModal from "./CommonModal";
import Cookies from "js-cookie";
import { usePathname, useRouter } from "next/navigation";
import CartModal from "./CartModal";

const Navbar = () => {
  const router = useRouter();
  const {
    showNavModal,
    setShowNavModal,
    isAuthUser,
    setIsAuthUser,
    user,
    setUser,
    currentUpdatedProduct,
    setCurrentUpdatedProduct,
    showCartModal,
    setShowCartModal,
  } = useContext(GlobalContext);

  // to get the path/url of current page.
  const pathname = usePathname();

  // to clear the input fields of add-product page once we leave the page and again go to add-product page all the input fields must be clear hte data stored in the " currentUpdatedProduct" state should not be saved in the inprrentUpdut fields.

  useEffect(() => {
    if (
      pathname !== "/admin-view/add-product" &&
      currentUpdatedProduct !== null
    ) {
      setCurrentUpdatedProduct(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    setIsAuthUser(false);
    setUser(null);
    Cookies.remove("token");
    localStorage.clear();
    router.push("/");
  };

  // if there is admin-view in the url then set admin view true else it will be false.
  const isAdminView = pathname.includes("/admin-view"); //will return true or false

  return (
    <>
      <nav className="bg-white w-full fixed z-20 top-0 left-0 border-b border-gray-200">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <div
            onClick={() => router.push("/")}
            className="flex items-center cursor-pointer"
          >
            <span className="self-center text-2xl font-semibold whitespace-nowrap">
              Ecommercery
            </span>
          </div>
          <div className="flex md:order-2 gap-2">
            {
              // if user is not admin and user is authenticated then show these buttons

              !isAdminView && isAuthUser ? (
                <Fragment>
                  <button
                    className="buttonsStyle"
                    onClick={() => router.push("/account")}
                  >
                    Account
                  </button>
                  <button
                    onClick={() => setShowCartModal(true)}
                    className="buttonsStyle"
                  >
                    Cart
                  </button>
                </Fragment>
              ) : null
            }

            {user?.role === "admin" ? (
              isAdminView ? (
                <button
                  onClick={() => router.push("/")}
                  className="buttonsStyle"
                >
                  Client View
                </button>
              ) : (
                <button
                  onClick={() => router.push("/admin-view")}
                  className="buttonsStyle"
                >
                  Admin View
                </button>
              )
            ) : null}

            {/* login and logout button */}
            {isAuthUser ? (
              <button onClick={handleLogout} className="buttonsStyle">
                Logout
              </button>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="buttonsStyle"
              >
                Login
              </button>
            )}
            <OpenMenuButton
              showNavModal={showNavModal}
              setShowNavModal={setShowNavModal}
            />
          </div>
          <NavItems isAdminView={isAdminView} router={router} />
        </div>
      </nav>
      {/* mobile view */}
      <CommonModal
        showModalTitle={false}
        mainContent={
          <NavItems
            isModalView={true}
            isAdminView={isAdminView}
            router={router}
          />
        }
        show={showNavModal}
        setShow={setShowNavModal}
      />
      {showCartModal && <CartModal />}
    </>
  );
};

export default Navbar;
