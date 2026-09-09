import { getGithubApp } from "../utils/github-app";




export type PullRequestWebhookPayload = {
    action: string;
    /** GitHub App installation that received the event */
    installation: { id: number }; //octokit to know which account permission to use
    repository: { full_name: string };
    pull_request: {
        number: number;
        title: string;
        user: { login: string } | null;
        head: { sha: string }; //latest git commit hash on pr branch
        base: { ref: string }; //The target branch into which changes are being merged (e.g., "main"
    };
}


async function isSignatureValid(payload: string, signature: string | null) {
    if (!signature) {
        return false;
    }

    const app = getGithubApp();

    return app.webhooks.verify(payload, signature)
}

/**Reads the raw string payload and the x-hub-signature-256 header.
 *  It computes an HMAC-SHA256 hash using GITHUB_WEBHOOK_SECRET 
 * and checks if it matches GitHub's signature.  Why we are coding this 
 * (Preventing Forged Requests): Anyone on the internet can send a POST request to [https://your-domain.com/api/github/webhook](https://your-domain.com/api/github/webhook). Without cryptographic verification, an attacker could trigger infinite AI review jobs, drain your token quota, or inject fake reviews. */


const REVIEWABLE_ACTIONS = ["opened", "synchronize", "reopened"];


export async function handleGithubWebHook(request: Request) {
    const payload = await request.text()
    const signature = request.headers.get("x-hub-signature-256");
    const eventName = request.headers.get("x-github-event");

    const isValid = await isSignatureValid(payload, signature);

    if (!isValid) {
        return Response.json({ error: "Invalid signature" }, { status: 401 });
    }

    if (eventName !== "pull_request") {
        return Response.json({ received: "true,but not pr action" });
    }
    const event = JSON.parse(payload) as PullRequestWebhookPayload;
    if (!REVIEWABLE_ACTIONS.includes(event.action)) {
        return Response.json({ received: true });
    }

    // const pullRequest = await savePullRequest(event);

    return Response.json({ received: true });
}