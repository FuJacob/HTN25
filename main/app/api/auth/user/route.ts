import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../../generated/prisma";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { auth0Id, email } = body;

    if (!auth0Id || !email) {
      return NextResponse.json(
        { error: "Missing auth0Id or email" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { auth0Id },
    });

    if (existingUser) {
      return NextResponse.json({ user: existingUser });
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        auth0Id,
        email,
      },
    });

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch (error) {
    console.error("Error creating/finding user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
