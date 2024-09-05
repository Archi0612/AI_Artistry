import React from "react";
import { useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../Utils/firebase";
import { signOut } from "firebase/auth";

const Header = () => {
  const userDetail = useSelector((store) => store.user);

  const navigate = useNavigate();

  // console.log(userDetail.displayName);

  const logout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
        console.log("sign out error");
      });
  };

  const gotoCreate = () => {
    if (userDetail === null) {
      navigate("/auth");
    } else {
      navigate("/generate");
    }
  };

  const gotoHome = () => {
    navigate("/");
  };

  return (
    <div className="px-32 py-4 bg-zinc-900 flex items-center justify-between">
      <p className="font-semibold text-white text text-2xl">
        Hello {userDetail ? ", " + userDetail?.displayName : ""}
      </p>
      <div className="font-bold text-blue-500 text text-3xl cursor-pointer" onClick={gotoHome}>
        {/* <img src="AIArtistry.png" className="h-14" /> */}
        AI Artistry
      </div>
      <div className="flex text-xl">
        <button
          className="mr-4 px-5 py-2 rounded-md font-semibold text-xl bg-green-500"
          onClick={gotoCreate}
        >
          Create
        </button>
        {!userDetail ? (
          <NavLink
            to="/auth"
            className="px-5 py-2 rounded-md font-semibold text-white text-xl bg-red-600"
          >
            Log In
          </NavLink>
        ) : (
          <div>
            <button
              className="flex items-center bg-red-600 px-5 py-2 rounded-md"
              onClick={logout}
            >
              <img
                className="rounded-full w-7 mr-2"
                src={userDetail.photoURL}
                alt="profile"
              />
              <p className=" font-semibold text-xl text-white">Sign Out</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
