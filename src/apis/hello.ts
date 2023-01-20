import axios from "axios";
import { Data } from "pages/api/hello";

export const hello = async (): Promise<Data> => {
  return await axios("/api/hello", { method: "get" });
};
