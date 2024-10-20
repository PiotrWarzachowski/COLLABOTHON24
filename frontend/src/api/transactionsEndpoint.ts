import client from "./axios";

export interface Transaction {
  transactions: any[];
}

export const getTransactions = async (
  sender: string,
  title: string,
  amount: number,
): Promise<Transaction> => {
  try {
    const response = await client.get<Transaction>("/users/transactions/", {
      params: {
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user tags:", error);
    throw error;
  }
};