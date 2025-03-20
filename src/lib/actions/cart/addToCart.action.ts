"use server";

import { JSON_HEADER } from "@/lib/constants/api.constant";
import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

const BASE_URL = process.env.API;

export const addToCart = async (formData: FormData) => {


  const tokenCookie = cookies().get("next-auth.session-token")?.value;
  const token = await decode({
    token: tokenCookie,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  

  // إرسال الطلب
  const response = await fetch(BASE_URL + "/cart/add", {
    method: "POST",
    body: formData,
    headers: {
      ...JSON_HEADER,
      Authorization: `Bearer ${token?.token}`,
    },
  });

  // قراءة البيانات من الاستجابة
  const payload = await response.json();
 
// **التحقق مما إذا كان هناك خطأ في الاستجابة**
if (!response.ok) {
    console.error("خطأ في الاستجابة من السيرفر:", payload); // طباعة الخطأ لفحصه
    throw new Error(JSON.stringify(payload)); // تأكد أن الخطأ يتم إلقاؤه كمحتوى JSON
  }

  return payload;
};
