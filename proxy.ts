import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
  const maintenance = process.env.MAINTENANCE_MODE === "true";

  if (maintenance) {
    return new NextResponse(
      "🚧 Site is under maintenance. Please check back later.",
      { status: 503 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/:path*",
};