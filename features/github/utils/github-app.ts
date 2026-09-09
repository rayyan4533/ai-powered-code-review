import { App } from "octokit"


let githubApp: App | null = null

export function getGithubApp() {
    if (!githubApp) {
        githubApp = new App({
            appId: process.env.GITHUB_APP_ID!,
            privateKey: process.env.GITHUB_APP_PRIVATE_KEY!.replace(/\\n/g, "\n"),
            webhooks: {
                secret: process.env.GITHUB_WEBHOOK_SECRET!,
            },

        })
    }
    return githubApp
}

// mai bas queryparams me add karduga mera userId and return karduga
export function getGitHubInstallUrl(userId: string) {
    const url = new URL(`https://github.com/apps/raycode-pr-review/installations/new`)

    url.searchParams.set("state", userId)
    return url.toString()

}

