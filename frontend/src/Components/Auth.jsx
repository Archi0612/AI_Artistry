import React, { useRef, useState } from "react";
import Header from "./Header";
import { checkValidData } from "../Utils/Helper";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { updateProfile } from "firebase/auth";
import { auth } from "../Utils/firebase";
import { addUser } from "../Utils/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [isSignUp, setSignUp] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const email = useRef(null);
  const password = useRef(null);
  const name = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handlesubmitbutton = () => {
    const errorQuery = checkValidData(
      email.current.value,
      password.current.value
    );
    setLoginError(errorQuery);

    if (errorQuery) return;

    if (isSignUp) {
      if (name.current.value === null || name.current.value === "") {
        setLoginError("Enter your Name");
        return;
      }

      // Sign Up Logic

      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          // Signed up
          const user = userCredential.user;

          updateProfile(user, {
            displayName: name.current.value,
            photoURL:
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
          })
            .then(() => {
              const { uid, email, displayName, photoURL } = auth.currentUser;
              dispatch(
                addUser({
                  uid: uid,
                  email: email,
                  displayName: displayName,
                  photoURL: photoURL,
                })
              );
              // navigate("/generate");
            })
            .catch((error) => {
              // An error occurred
              setLoginError(
                error.code +
                  " -:- " +
                  error.message +
                  " -:- Profile not updated "
              );
            });
        })
        .catch((error) => {
          setLoginError(error.code + " -:- " + error.message);
        });
    } else {
      //Sign In Logic

      signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          // Signed in
          // navigate("/generate");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;

          setLoginError(errorCode + " -:- " + errorMessage);
        });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/*  FIX BACK-GROUND IMAGE */}

      <div className=" absolute -z-10 opacity-70">
        <img src="AuthBackground.jpg" alt="Netflix-Background" />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="mx-auto p-14 mt-28 w-2/6 flex flex-col bg-black bg-opacity-70"
      >
        <h1 className="mb-6 text-white font-bold text-4xl">Sign In</h1>
        {isSignUp && (
          <input
            ref={name}
            className="mt-5 p-4 placeholder-gray-400 bg-zinc-700 border border-white rounded-lg bg-opacity-35 font-semibold text-white text-lg"
            type="text"
            placeholder="Name"
          />
        )}
        <input
          ref={email}
          className="mt-5 p-4 placeholder-gray-400 bg-zinc-700 border border-white rounded-lg bg-opacity-35 font-semibold text-white text-lg"
          type="text"
          placeholder="Email"
        />
        <input
          ref={password}
          className="mt-5 p-4 placeholder-gray-400 bg-zinc-700 border border-white rounded-lg bg-opacity-35 font-semibold text-white text-lg"
          type="password"
          placeholder="Password"
        />
        <p className="text-red-700 font-semibold text-base ">{loginError}</p>
        <button
          onClick={handlesubmitbutton}
          className="mt-8 p-3 rounded-lg bg-red-600"
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
        <p
          onClick={() => {
            setSignUp(!isSignUp);
            setLoginError(null);
            console.log(isSignUp);
          }}
          className="cursor-pointer text-white italic mt-3"
        >
          Not a Member? Sign Up
        </p>
      </form>
    </div>
  );
};

export default SignIn;
