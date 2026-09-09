//i will authenticate the user's github app installation
//i will fetch all his repos and relevent data
//i need to normalize it in a way frontend will consume it
//pagination wise 

import { getGithubApp } from "../utils/github-app";


//1 how much info of a repo on fend
export type GithubRepo = {
    /** GitHub's numeric repo id, stored as a string for consistency with other ids. */
    id: string;
    /** Short repo name without owner, e.g. `my-app`. */
    name: string;
    /** Full name with owner, e.g. `acme/my-app`. */
    fullName: string;
    /** Whether the repo is public or private on GitHub. */
    visibility: "public" | "private";
    /** Default branch GitHub reports (usually `main` or `master`). */
    defaultBranch: string;
    /** ISO timestamp of last activity on the repo. */
    updatedAt: string;
    /** Primary language from GitHub, or null if unknown. */
    language: string | null;
    /** Star count from GitHub's `stargazers_count`. */
    stars: number;
};
/** One page of repos plus pagination metadata for infinite scroll UI. */
export type InstallationReposPage = {
    repos: GithubRepo[];
    totalCount: number;
    page: number;
    hasMore: boolean;
};


//mujhe ocktokit fetch karke dega and I will set it 
function getRepoVisibility(isPrivate?: boolean): GithubRepo["visibility"] {
    if (isPrivate) {
        return "private"
    }
    return "public"
}

function mapRepo(repo: {
    id: number | bigint;
    name: string;
    full_name: string;
    private?: boolean;
    default_branch?: string;
    updated_at?: string | null;
    language?: string | null;
    stargazers_count?: number | null;
}): GithubRepo {
    return {
        id: String(repo.id),
        name: repo.name,
        fullName: repo.full_name,
        visibility: getRepoVisibility(repo.private),
        defaultBranch: repo.default_branch ?? "main",
        updatedAt: repo.updated_at ?? new Date().toISOString(),
        language: repo.language ?? null,
        stars: repo.stargazers_count ?? 0,
    };
}

const REPOS_PER_PAGE = 100;

export async function getInstallationRepo(
    installationId: number,
    page = 1
): Promise<InstallationReposPage> {
    const app = getGithubApp();
    const octokit = await app.getInstallationOctokit(installationId);
    const { data } = await octokit.request("GET /installation/repositories", {
        per_page: REPOS_PER_PAGE,
        page,
    })
    const totalCount = data.total_count;
    const repos = data.repositories.map(mapRepo);

    return {
        repos,
        totalCount,
        page,
        hasMore: page * REPOS_PER_PAGE < totalCount,
    }

}