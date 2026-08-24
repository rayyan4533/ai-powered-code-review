import type { GithubInstallationStatus } from "@/features/dashboard/lib/types";
import { getGithubApp } from "../utils/github-app";
import { prisma } from "@/lib/db"


//helper buildDisconnected()
function buildDisconnectedStatus(): GithubInstallationStatus {
    return { connected: false, accountLogin: null, installedAt: null }
}

//helper getAccountLogin 
function getAccountLogin(
    account: { login?: string; slug?: string } | null | undefined
): string | null {
    if (!account) {
        return null;
    }

    if ("login" in account && account.login) {
        return account.login;
    }

    if (account.slug) {
        return account.slug;
    }

    return null;
}


export async function getInstalllationStatus(userId: string) {
    const installationExists = await prisma.githubInstallation.findUnique({
        where: { userId }
    })

    if (!installationExists) {
        return buildDisconnectedStatus();
    }

    return {
        connected: true,
        accountLogin: installationExists.accountLogin,
        isInstalledAt: installationExists.createdAt.toISOString(),
    }
}

export async function saveInstallation(userId: string, installationId: number) {
    const app = getGithubApp()

    const { data } = await app.octokit.request(
        "GET /app/installations/{installation_id}",
        { installation_id: installationId }
    );

    const accountLogin = getAccountLogin(data.account);

    await prisma.githubInstallation.upsert({
        where: { userId },
        create: {
            userId,
            installationId,
            accountLogin,
            accountType: data.target_type ?? null,
        },
        update: {
            installationId,
            accountLogin,
            accountType: data.target_type ?? null,
        }
    });

}

export async function getUserIdByInstallationId(installationId: number) {
    const installation = await prisma.githubInstallation.findFirst({
        where: { installationId },
        select: { userId: true },
    });

    if (!installation) {
        return null;
    }

    return installation.userId;
}

export async function getUserInstallationId(userId: string) {
    const installation = await prisma.githubInstallation.findUnique({
        where: { userId },
        select: { installationId: true },
    });

    if (!installation) {
        return null;
    }

    return installation.installationId;
}

export async function deleteInstallation(userId: string) {
    await prisma.githubInstallation.delete({ where: { userId } });
}