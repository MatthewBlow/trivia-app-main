import axios from "axios";
import React, { useEffect, useState } from "react";

axios.defaults.baseURL = "https://opentdb.com/";

const useAxios = async ({ url }) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        const data = await response.json();
        setResponse(data);
      } catch (error) {
        setError(error);
        console.log(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [url]);

  return { response, error, loading };
};

export default useAxios;
