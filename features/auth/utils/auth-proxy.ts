import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { getSafeCallbackPath, SIGN_IN_PATH } from ".";
import { redirect } from "next/dist/server/api-utils";

export async function handleAuthProxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathname === '/') {
        return NextResponse.next();
    }
    const session = await auth.api.getSession({
        headers: await request.headers
    })

    if (pathname === SIGN_IN_PATH) {
        if (session) {
            const redirectTo = getPostAuthRedirectPath(request);
            return NextResponse.redirect(new URL(redirectTo, request.url));

        }
        return NextResponse.next();
    }
    if (!session) {
        return redirectToSignIn(request, pathname)
    }
    return NextResponse.next()

}

//helper getPostAuthRedirectPath
function getPostAuthRedirectPath(request: NextRequest): string {
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl")
    return getSafeCallbackPath(callbackUrl)
}

//helper redirectTosignIn
function redirectToSignIn(request: NextRequest, pathname: string) {
    const signInURL = new URL(SIGN_IN_PATH, request.url)
    signInURL.searchParams.set(
        "callbackUrl",
        `${pathname}${request.nextUrl.search}`
    )
    return NextResponse.redirect(signInURL)
}