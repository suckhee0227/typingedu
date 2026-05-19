import type { InquiryForm, ApiResponse } from "../types";

const GAS_URL = import.meta.env.VITE_GAS_URL as string;
const GAS_SECRET = import.meta.env.VITE_GAS_SECRET as string;

export async function submitInquiry(
  data: InquiryForm
): Promise<ApiResponse<null>> {
  const res = await fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    redirect: "follow",
    body: JSON.stringify({
      name: data.name,
      organization: data.organization,
      phone: data.phone,
      message: data.message,
      _secret: GAS_SECRET,
    }),
  });
  return res.json();
}
