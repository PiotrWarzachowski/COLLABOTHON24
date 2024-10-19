import client from "./axios";

export interface UserTag {
  tags: string[];
  data: any[];
  labels: any;
}

export const getUserTags = async (
  fromDate: string,
  toDate: string,
  key: string,
  type: string
): Promise<UserTag> => {
  try {
    const response = await client.get<UserTag>("/users/tags/", {
      params: {
        from_date: fromDate,
        to_date: toDate,
        key: key,
        type: type,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user tags:", error);
    throw error;
  }
};