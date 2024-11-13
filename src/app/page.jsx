'use client'
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import Grid from "@mui/material/Grid";
import { useRouter } from 'next-nprogress-bar';
import useAppStore from "@/store/appStore";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Fade from "@mui/material/Fade";
import { setCookie } from "cookies-next";
import { signIn, useSession } from "next-auth/react";
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import google from "@/img/google.png";
import facebook from "@/img/facebook.png";
import twitter from "@/img/twitter.png";
import Image from 'next/image';
import axios from "axios";
import github from "@/img/github.png";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Login = () => {
  const { data: session } = useSession();
  const buttonStyle = { margin: "28px 0" };
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(true);
  const router = useRouter();
  const { updateUserRole, updateOrganizationName, updateOnboardData } = useAppStore();
  const { updateUserId, updateUserEmail, userEmail, updateSelectedMenu } = useAppStore();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const baseURL = '/api/';
  const currentYear = new Date().getFullYear();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const [open, setOpen] = useState(false);
  const [state] = useState({
    vertical: "top",
    horizontal: "center",
    Transition: Fade,
  });
  const { vertical, horizontal } = state;

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const schema = yup.object().shape({
    email: yup.string().email().required("Email is required"),
    password: yup.string().min(2).required("Password is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: userEmail,
      password: "",
    },
  });

  if (session && session.data) {
    // console.log('session ', session);
    if (session?.data?.isOnboarded) {
      router.push('/scale/home');
    } else if (!session?.data?.isOnboarded) {
      router.push('/onboard');
    }
  }


  useEffect(() => {
    if (session) {
      let user = session;
      updateUserId(user?.data?._id);
      updateUserEmail(user?.data?.email);
      updateUserRole(user?.data?.role);
      if (user?.data?.organization !== undefined && user?.data?.organization !== '' & user?.data?.organization !== null) {
        updateOrganizationName(user?.data?.organization);
      }
      console.log('User ', user);
      if (user?.email !== undefined) {
        getData();
      }
    }
  }, [session])

  const getData = async () => {
    let posturl = baseURL + "sso";
    await axios
      .post(posturl)
      .then((res) => {
        console.log('sso ', res);
        let ssoData = {
          email: res?.data?.email,
          hashedPassword: res?.data?.password,
        }
        submitHandler(ssoData);
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 401) {
          deleteCookie("logged");
          signOut();
        }
      });
  };

  const onSubmitNew = (data) => {
    setIsLoading(true);
    submitHandler(data);
  };

  const submitHandler = async (data) => {
    // console.log('submitHandler ', data);
    const resdata = await signIn("credentials", {
      email: data?.email,
      password: data?.password,
      hashedPassword: data?.hashedPassword,
      redirect: false,
    });

    updateOnboardData(
      {
        email: data.email,
        password: data.password,
        hashedPassword: data?.hashedPassword
      }
    );

    // console.log('resdata ', resdata);
    if (resdata.status === 400 || resdata.status === 401 || resdata.status === 403) {
      setIsLoading(false);
      setIsError(true);
      setMessage(
        "Invalid Credentials! \n Please try again"
      );
      setOpen(true);
    } else if (resdata.status === 500) {
      setIsLoading(false);
      setIsError(true);
      setMessage(
        "Sorry....the backend server is down!! Please try again later"
      );
      setOpen(true);
    } else {
      setCookie("logged", "true", { maxAge: 60 * 60 * 24 * 30 });
      updateSelectedMenu('');
      // console.log('resdata ', resdata);
    }
  };

  const openInNewTab = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };


  return (
    <>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar
          open={open}
          autoHideDuration={4000}
          onClose={handleClose}
          key={vertical + horizontal}
          anchorOrigin={{ vertical, horizontal }}
          TransitionComponent={state.Transition}
        >
          {isError === true ? (
            <Alert
              onClose={handleClose}
              severity="error"
              sx={{
                width: "100%",
                minWidth: "400px",
                backgroundColor: "#fb7185",
                color: "black",
              }}
            >
              {message}
            </Alert>
          ) : (
            <Alert
              onClose={handleClose}
              severity="success"
              sx={{
                width: "100%",
                minWidth: "400px",
                backgroundColor: "#86efac",
                color: "black",
              }}
            >
              {message}
            </Alert>
          )}
        </Snackbar>
      </Stack>
      <Grid>
        <div className="bg-gray-50 min-h-screen">
          <div className="flex items-center justify-center pt-[14vh]">
            <div className="max-w-sm w-full p-6 bg-white rounded-md shadow-md">
              <h2 className="text-2xl font-semibold text-center text-gray-800">
                Welcome Back
              </h2>
              <form onSubmit={handleSubmit(onSubmitNew)}>
                <div className="mb-4 mt-10">
                  <label htmlFor="email" className="scaleformlabel">
                    Email
                  </label>
                  <input
                    type="text"
                    name="email"
                    {...register("email")}
                    className={`scaleform ${errors?.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors?.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email?.message}</p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="scaleformlabel">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="hs-toggle-password"
                      type={passwordVisible ? 'text' : 'password'}
                      className={`scaleform ${errors?.password ? 'border-red-500' : 'border-gray-300'}`}
                      {...register("password")}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute top-0 end-0 p-3.5 rounded-e-md"
                    >
                      <svg
                        className="flex-shrink-0 size-3.5 text-gray-400 dark:text-neutral-600"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {!passwordVisible ? (
                          <>
                            <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                            <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                            <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                            <line x1="2" x2="22" y1="2" y2="22"></line>
                          </>
                        ) : (
                          <>
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                            <circle cx="12" cy="12" r="3"></circle>
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                  {errors?.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password?.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  className={`w-full mb-4 mt-4 ${buttonStyle} ${isLoading
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-blue-800 hover:bg-blue-900"
                    } text-white font-bold py-2 px-4 rounded`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <div className="flex justify-center">
                        Signing...
                        <span className="ml-2">
                          <div role="status">
                            <svg ariaHidden="true" className="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span className="sr-only">Signing...</span>
                          </div>
                        </span>
                      </div>
                    </>
                  ) : "Sign In"}
                </button>
                <div className="mb-6">
                  <Divider>
                    <Chip label="OR" size="medium" />
                  </Divider>
                  <div className="flex justify-center">
                    <div className="mt-4 mx-2 cursor-pointer" onClick={() => signIn("google")}>
                      <Image
                        src={google}
                        alt="Google"
                        width={30}
                        height={30}
                      />
                    </div>
                    <div className="mt-4 mx-2 cursor-pointer" onClick={() => signIn("github")}>
                      <Image
                        src={github}
                        alt="Github"
                        width={27}
                        height={27}
                      />
                    </div>
                    <div className="mt-4 mx-2 cursor-pointer" onClick={() => signIn("facebook")}>
                      <Image
                        src={facebook}
                        alt="Facebook"
                        width={27}
                        height={27}
                      />
                    </div>
                    <div className="mt-4 mx-2 cursor-pointer"
                      onClick={() => signIn("twitter")}
                    >
                      <Image
                        src={twitter}
                        alt="twitter"
                        width={27}
                        height={27}
                      />
                    </div>
                  </div>
                </div>
              </form>
              <div className="">
                <p className="text-blue-500 cursor-pointer text-[15px]"
                  onClick={() => {
                    router.push('/forgot-password', { scroll: false })
                  }}
                >
                  Forgot Password?
                </p>
                <p className="text-[15px]">
                  Not a member?
                  <span
                    className="text-blue-500 cursor-pointer text-[15px]"
                    onClick={() => {
                      router.push('/register', { scroll: false })
                    }}
                  >
                    {" "}
                    Sign up
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-center items-center fixed bottom-0 w-full p-4">
              <span className="text-slate-700 text-sm cursor-pointer">
                &copy; Scale {currentYear}. All rights reserved.
              </span>
            </div>
            <div className="flex justify-end fixed bottom-0 right-0 p-4 items-end space-y-3">
              <div>
                <span className="text-slate-700 text-sm cursor-pointer mr-3" onClick={() => {
                  openInNewTab('/terms-of-service')
                }}>
                  Terms of Service
                </span>
              </div>
              <div>
                <span className="text-slate-700 text-sm cursor-pointer mr-3" onClick={() => {
                  openInNewTab('/privacy-policy')
                }}>
                  Privacy Policy
                </span>
              </div>
              <div>
                <span className="text-slate-700 text-sm cursor-pointer mr-6" onClick={() => {
                  openInNewTab('/cookie-policy')
                }}>
                  Cookie Policy
                </span>
              </div>
            </div>
          </div>

        </div>
      </Grid>
    </>
  );
};

export default Login;
