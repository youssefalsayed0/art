/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import { fetchWishlist } from "@/lib/apis/wishlist";

export async function GET(req: NextRequest) {
	try {
		const wishlist = await fetchWishlist();
		return NextResponse.json(wishlist, { status: 200 });
	} catch (error) {
		return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
	}
}
