export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>
        <div className="flex justify-center items-center bg-muted/40 w-full h-screen min-h-full">
            <div className="w-full max-w-sm"> {children}</div>
        </div>
    </>
}   