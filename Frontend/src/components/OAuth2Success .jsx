import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OAuth2Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      navigate("/dashboard");
    } else {
      alert("Google Login failed");
      navigate("/login");
    }
  }, []);

  return <p>Logging you in via Google...</p>;
};

export default OAuth2Success;
