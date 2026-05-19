import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { submitInquiry } from "../lib/api";
import type { InquiryForm } from "../types";

const schema = z.object({
  name: z.string().min(1, "이름을 입력해주세요"),
  organization: z.string().min(1, "기관명을 입력해주세요"),
  phone: z
    .string()
    .min(1, "연락처를 입력해주세요")
    .regex(/^[\d-]+$/, "올바른 연락처를 입력해주세요"),
  message: z.string().min(1, "문의 내용을 입력해주세요"),
  privacyAgree: z.boolean().refine((val) => val === true, { message: "개인정보보호방침에 동의해주세요" }),
});

export function useContactForm() {
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const form = useForm<InquiryForm>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", organization: "", phone: "", message: "", privacyAgree: false },
  });

  const onSubmit = async (data: InquiryForm) => {
    setSubmitStatus("loading");
    try {
      const result = await submitInquiry(data);
      if (result.success) {
        setSubmitStatus("success");
        form.reset();
      } else {
        setSubmitStatus("error");
      }
    } catch {
      setSubmitStatus("error");
    }
  };

  return { form, onSubmit, submitStatus, setSubmitStatus };
}
