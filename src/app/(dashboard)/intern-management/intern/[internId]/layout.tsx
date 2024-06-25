// /app/intern/[internId]/layout.tsx

import { Metadata } from "next";
import { cookies } from "next/headers";
import React from "react";

type Props = {
  children: React.ReactNode;
};

interface LayoutProps {
  params: { internId: string };
}

export async function generateMetadata({
  params,
}: LayoutProps): Promise<Metadata> {
  const { internId } = params;

  const cookieStore = cookies();
  const token = cookieStore.get("accessToken")?.value;

  let title = `Intern: ${internId}`;

  if (token) {
    try {
      const response = await fetch(
        `http://localhost:8000/api/intern?id=${internId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        title = `${data.full_name}`; // Adjust based on actual response structure
      }
    } catch (error) {
      console.error("Failed to fetch intern data:", error);
    }
  }

  return {
    title,
  };
}

const Layout = ({ children }: Props) => {
  return <div className="w-full">{children}</div>;
};

export default Layout;
