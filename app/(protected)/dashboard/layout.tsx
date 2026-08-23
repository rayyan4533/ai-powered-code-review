import { requiresAuth } from "@/features/auth/actions";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";
import React from "react";


export default async function DashBoardLayout({ children, }: { children: React.ReactNode }) {
    const session = await requiresAuth();
    return (
        <DashboardShell user={session!.user} plan="pro">
            {children}
        </DashboardShell>
    )
}