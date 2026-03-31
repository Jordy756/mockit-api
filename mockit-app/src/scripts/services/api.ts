import { API_URL } from "@scripts/constants/api";

export const insertMockRecord = async (payload: string) => {
  const response = await fetch(`${API_URL}mock-records/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
  });

  const data = await response.json().catch(() => null);

  return { response, data };
};
