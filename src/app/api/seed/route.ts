import { db } from "@/lib/db";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const adminExists = await db.user.findFirst({
      where: {
        email: "admin@example.com",
      },
    });

    if (adminExists) {
      return NextResponse.json(
        { message: "Admin user already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash("admin123", 12);

    const admin = await db.user.create({
      data: {
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    return NextResponse.json(
      { message: "Admin user created successfully", admin },
      { status: 201 }
    );
  } catch (error) {
    console.error("[SEED_ERROR]", error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
} 