// src/app/api/vote/route.ts
import { NextRequest, NextResponse } from "next/server";
import { addVote } from "@/lib/firebaseActions";

export async function POST(req: NextRequest) {
  try {
    const { modelName } = await req.json();

    if (!modelName) {
      return NextResponse.json({ message: "Model name is required" }, { status: 400 });
    }

    await addVote(modelName);
    return NextResponse.json({ message: "Vote added successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
