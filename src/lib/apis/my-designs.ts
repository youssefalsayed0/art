'use server';

import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";
import { JSON_HEADER } from "../constants/api.constant";

const BASE_URL = process.env.API;

export async function fetchMyDesgin() {
  try {
    const locale = cookies().get('NEXT_LOCALE')?.value || "ar";
    const tokenCookie = cookies().get("next-auth.session-token")?.value;

    const token = await decode({
      token: tokenCookie,
      secret: process.env.NEXTAUTH_SECRET!,
    });

    

    const response = await fetch(`${BASE_URL}/auth/price_requests`, {
      method: "GET",
      cache: "no-store",
      headers: {
        lang: locale,
        ...JSON_HEADER,
        Authorization: `Bearer ${token?.token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const payload = await response.json();
    return payload;
  } catch (error) {
    console.error("Error fetching products:", error);
    return null;
  }
}

