import axios from "axios";
import { Data } from "pages/api/hello";

export const hello = async (): Promise<Data> => {
  const { data } = await axios("/api/hello", { method: "get" });
  return data;
};
