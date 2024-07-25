import axios, { AxiosResponse } from "axios";
import { useState, useEffect } from "react";

export default function useGet(Url: string) {
  const [data, setData] = useState<React.ReactNode>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    axios
      .get(Url)
      .then((res: AxiosResponse) => {
        res ? setLoading(true) : setLoading(false);
        if (loading) {
          setData(res.data);
        }
      })
      .catch((err) => setError(err));
  }, [Url, loading]);
  return [data, error];
}
