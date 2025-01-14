import { db } from "@/lib/db";
import { UserForm } from "./user-form";
import { notFound, redirect } from "next/navigation";
import { labels } from "@/config/labels";
import { Suspense } from "react";
import { unstable_cache } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface UserPageProps {
  params: {
    userId: string;
  };
}

const getUser = unstable_cache(
  async (userId: string) => {
    if (userId === "new") return null;

    return db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });
  },
  ["user-detail"],
  {
    revalidate: 60,
    tags: ["users"],
  }
);

export default async function UserPage({ params }: UserPageProps) {
  const session = await getServerSession(authOptions);
  
  if (session?.user?.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <Suspense fallback={<UserLoading />}>
      <UserContent userId={params.userId} />
    </Suspense>
  );
}

function UserLoading() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{labels.users.title}</h2>
      </div>
      <div className="animate-pulse">
        <div className="space-y-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

async function UserContent({ userId }: { userId: string }) {
  const user = await getUser(userId);

  if (userId !== "new" && !user) {
    notFound();
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {user ? labels.users.editUser : labels.users.newUser}
        </h2>
      </div>
      <UserForm initialData={user} />
    </div>
  );
} 