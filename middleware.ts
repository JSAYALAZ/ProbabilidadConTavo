// middleware.ts (Edge, ligero)
import { NextResponse, type NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
