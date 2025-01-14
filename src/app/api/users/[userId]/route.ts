import { db } from "@/lib/db";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import * as z from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const updateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["USER", "ADMIN"]),
});

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const json = await req.json();
    const body = updateUserSchema.parse(json);

    const existingUser = await db.user.findUnique({
      where: {
        id: params.userId,
      },
    });

    if (!existingUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    const emailExists = await db.user.findFirst({
      where: {
        email: body.email,
        NOT: {
          id: params.userId,
        },
      },
    });

    if (emailExists) {
      return new NextResponse("Email already exists", { status: 400 });
    }

    const user = await db.user.update({
      where: {
        id: params.userId,
      },
      data: {
        name: body.name,
        email: body.email,
        role: body.role,
      },
    });

    revalidateTag("users");

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(error.message, { status: 400 });
    }

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (session?.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    if (session.user.id === params.userId) {
      return new NextResponse("Cannot delete your own account", { status: 400 });
    }

    const user = await db.user.delete({
      where: {
        id: params.userId,
      },
    });

    revalidateTag("users");

    return NextResponse.json(user);
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 