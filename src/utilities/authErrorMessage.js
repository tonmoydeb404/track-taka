const authErrorMessage = (error) => {
  switch (error?.code) {
    case "auth/account-exists-with-different-credential":
      return "user already exist with different signin method";
    case "auth/credential-already-in-use":
      return "user already exist with the same information";
    case "auth/email-already-in-use":
      return "unique email id is required";
    case "auth/popup-closed-by-user":
      return "authorization canceled by user";
    default:
      return "something wents to wrong, please try again later.";
  }
};

export default authErrorMessage;
