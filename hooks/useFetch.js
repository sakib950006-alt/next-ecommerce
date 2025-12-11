import { useState, useMemo, useEffect } from "react";
import axios from "axios";

const useFetch = (url, method = "GET", options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const optionsString = JSON.stringify(options);

  const requestOptions = useMemo(() => {
    const opts = { ...options };
    if (method === "POST" && !opts.data) {
      opts.data = {};
    }
    return opts;
  }, [method, optionsString]);

  useEffect(() => {
    if (!url) return; // ✅ अगर url null है तो call मत करो

    const apiCall = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: response } = await axios({
          url,
          method,
          ...requestOptions, // ✅ Fixed line here
        });

        if (!response.success) {
          throw new Error(response.message);
        }

        setData(response);
      } catch (error) {
        setError(error.message);
        setData(null); // ✅ clear old data
      } finally {
        setLoading(false);
      }
    };

    apiCall();
  }, [url, refreshIndex, requestOptions]);

  const refetch = () => {
    setRefreshIndex((prev) => prev + 1);
  };

  return { data, loading, error, refetch };
};

export default useFetch;
