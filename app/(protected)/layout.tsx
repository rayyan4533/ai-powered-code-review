import { requiresAuth } from "@/features/auth/actions";




export default async function ProtectedLayout({
    children, }: { children: React.ReactNode; }) {
    await requiresAuth();
    return <div className="min-h-svh">{children}</div>
}