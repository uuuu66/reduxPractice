import type { NextApiRequest, NextApiResponse } from "next";
import { api } from "./common";

type Data = {
  name: string;
  age: number;
  address: string;
  phone: string;
};

const userInfo: Data = {
  name: "이민기",
  age: 29,
  address: "화곡동",
  phone: "010-4567-8964",
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json(userInfo);
}

/**
 * 유저정보 get
 */
export const getUserInfo = async () => {
  const { data } = await api.get("api/user");
  return data;
};
