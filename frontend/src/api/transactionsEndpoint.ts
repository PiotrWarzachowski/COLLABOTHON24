import { Transactions } from "@/components/main/main";
import client from "./axios";

export interface Transaction {
  recipient: string,
  sender: string,
  title: string,
  date: string,
  tag: string,
  amount: number,
  currency_id: number
}

export const getTransactions = async (
): Promise<Transactions[]> => {
  try {
    const response = await client.get<any>("/users/transactions/");
    let data : Transaction[] = response.data["transactions"];
    return data.map((value, index) => {
      return {
        bankAccount: value.amount > 0 ? value.sender : value.recipient,
        title: value.title,
        tag: value.tag,
        date: new Date(value.date),
        amount: value.amount
      }
    })
  } catch (error) {
    console.error("Error fetching user tags:", error);
    throw error;
  }
};