import { NextResponse } from "next/server";
import { createUserAccount as createUserAccountServer } from "../../../../lib/appwrite.server";

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    const user = await createUserAccountServer(email, password, name);

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
