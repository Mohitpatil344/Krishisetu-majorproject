import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";

const useAuthToken = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const fetchToken = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          setToken(token);
        } catch (error) {
          console.error("Error getting token:", error);
        }
      }
    };
    fetchToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  return token;
};

export default useAuthToken;