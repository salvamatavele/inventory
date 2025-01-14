"use client";

import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { columns } from "./columns";
import { labels } from "@/config/labels";
import { memo } from "react";

interface UsersClientProps {
  data: any[];
}

const UsersClient = memo(function UsersClient({ data }: UsersClientProps) {
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Button
          onClick={() => router.push("/users/new")}
          className="flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          {labels.common.add}
        </Button>
      </div>
      <DataTable 
        columns={columns} 
        data={data} 
        searchKey="name" 
        searchPlaceholder={labels.common.search}
        noResults={labels.common.noResults}
      />
    </>
  );
});

export { UsersClient }; 