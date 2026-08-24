"use client";

import {
    ArrowSquareOut,
    GithubLogo,
    Plugs,
} from "@phosphor-icons/react";

import type { GithubInstallationStatus } from "@/features/dashboard/lib/types";
import {
    statusBadge,
    statusButtonClass,
} from "@/features/dashboard/lib/status-style";
import { getGitHubInstallUrl } from "@/features/github/utils/github-app";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { disconnectGithubApp } from "../actions";
// import { disconnectGithubApp } from "../actions";


type GithubConnectCardProps = {
    userId: string;
    installation: GithubInstallationStatus;
};

//user's login id or my slug 
function ConnectedDetails({ accountLogin }: { accountLogin: string | null }) {
    return (
        <p className="text-muted-foreground text-xs">
            Installed for{" "}
            <span className="font-medium text-green-700 dark:text-green-400">
                @{accountLogin}
            </span>
            . The app can read repository metadata and post review comments on pull
            requests.
        </p>
    );
}
//if I am connected,i will option to disconnect
function ConnectedActions() {
    return (
        <form action={disconnectGithubApp}>
            <Button
                type="submit"
                variant="outline"
                className={statusButtonClass.danger}
            >
                <Plugs />
                Disconnect GitHub App
            </Button>
        </form>
    );
}

// user needs permissions
function DisconnectedDetails() {
    return (
        <ul className="space-y-1 text-muted-foreground text-xs list-disc list-inside">
            <li>Access public and private repositories you select</li>
            <li>Receive webhooks for pull request events</li>
            <li>Post AI-generated review comments on PRs</li>
        </ul>
    );
}

//when app is not connected
function DisconnectedActions({ installUrl }: { installUrl: string }) {
    return (
        <Button
            nativeButton={false}
            render={<a href={installUrl} />}
            className={statusButtonClass.success}
        >
            <GithubLogo />
            Install GitHub App
            <ArrowSquareOut className="opacity-80 size-3" />
        </Button>
    );
}

function ConnectionDetails({
    connected,
    accountLogin,
}: {
    connected: boolean;
    accountLogin: string | null;
}) {
    if (connected) {
        return <ConnectedDetails accountLogin={accountLogin} />;
    }

    return <DisconnectedDetails />;
}
function ConnectionActions({
    connected,
    installUrl,
}: {
    connected: boolean;
    installUrl: string;
}) {
    if (connected) {
        return <ConnectedActions />;
    }

    return <DisconnectedActions installUrl={installUrl} />;
}


export function GithubConnectCard({
    userId,
    installation,
}: GithubConnectCardProps) {
    const { connected, accountLogin } = installation;
    // Install URL encodes userId so the callback can associate the installation
    const installUrl = getGitHubInstallUrl(userId);

    // Default to neutral styling; switch to green when connected
    let cardBorderClass = "border-border";
    let iconWrapperClass = "border-border bg-muted";
    let statusTone: "success" | "neutral" = "neutral";
    let statusLabel = "Not connected";

    if (connected) {
        cardBorderClass = "border-green-500/30";
        iconWrapperClass =
            "border-green-500/40 bg-green-500/10 text-green-700 dark:text-green-400";
        statusTone = "success";
        statusLabel = "Connected";
    }

    return (
        <div className="flex flex-col flex-1 gap-6 p-6">
            <Card className={cn("max-w-2xl transition-colors", cardBorderClass)}>
                <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                        <div className="flex items-center gap-3">
                            <span
                                className={cn(
                                    "flex justify-center items-center border rounded-none size-10",
                                    iconWrapperClass
                                )}
                            >
                                <GithubLogo className="size-5" />
                            </span>
                            <div>
                                <CardTitle>GitHub App</CardTitle>
                                <CardDescription>
                                    Install the Chai reviewer app on your GitHub account or
                                    organization to access public and private repositories.
                                </CardDescription>
                            </div>
                        </div>
                        <span className={statusBadge(statusTone)}>{statusLabel}</span>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ConnectionDetails connected={connected} accountLogin={accountLogin} />
                </CardContent>
                <CardFooter className="flex flex-wrap gap-2">
                    <ConnectionActions connected={connected} installUrl={installUrl} />
                </CardFooter>
            </Card>
        </div>
    );
}




