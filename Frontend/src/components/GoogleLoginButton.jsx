const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    // Redirect to your backend's OAuth2 start endpoint
    // window.location.href = "http://localhost:8080/api/auth/google";
    window.location.href = "http://localhost:8080/oauth2/authorization/google";

  };

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={handleGoogleLogin}
        className="flex items-center px-4 py-2 border rounded hover:bg-gray-100"
      >
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png"
          alt="Google"
          className="w-5 h-5 mr-2"
          
        />
        Sign in with Google
      </button>
    </div>
  );
};

export default GoogleLoginButton;
