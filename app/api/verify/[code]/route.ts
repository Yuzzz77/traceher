import { getVerificationByCode } from "@/lib/verification";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type RouteContext = {
  params: {
    code: string;
  };
};

export async function GET(_: Request, { params }: RouteContext) {
  const record = await getVerificationByCode(params.code);

  if (!record) {
    return NextResponse.json(
      { message: "QR code not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(record);
}
