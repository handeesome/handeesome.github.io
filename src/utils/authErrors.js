const SIGN_IN_ERROR_MESSAGES = {
  "auth/popup-blocked":
    "Your browser blocked the Google sign-in window. Allow pop-ups for this site, then try again.",
  "auth/unauthorized-domain":
    "This domain is not authorized in Firebase yet. Add it under Authentication settings, then try again.",
  "auth/network-request-failed":
    "The sign-in request could not reach Firebase. Check your connection, then try again.",
};

export const getSignInErrorMessage = (error) =>
  SIGN_IN_ERROR_MESSAGES[error?.code] ??
  "Unable to sign in with Google. Please try again.";
