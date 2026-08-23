

"use server"
import SignInPage from "@/app/(auth)/sign-in/page"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { DEFAULT_AUTH_CALLBACK, getSafeCallbackPath, SIGN_IN_PATH } from "../utils"
import { redirect } from "next/navigation"


export async function signInWithGithub(formData: FormData) {
    const callback = formData.get("callbackUrl") as string | undefined

    const redirectTo = getSafeCallbackPath(
        typeof callback === "string" ? callback : null
    )

    const result = await auth.api.signInSocial({
        body: {
            provider: "github",
            callbackURL: redirectTo
        },
        headers: await headers()
    })
    if (result.url) {
        redirect(result.url)
    }
}


export async function getServerSession() {
    return auth.api.getSession({
        headers: await headers()
    })
}


export async function requiresAuth(redirectTo = SIGN_IN_PATH) {
    const session = await getServerSession()

    if (!session) {
        redirect(redirectTo)
    }

    return session
}

export async function noAuthRequired(redirectTo = DEFAULT_AUTH_CALLBACK) {
    const session = await getServerSession()

    if (session) {
        redirect(redirectTo)
    }
}


