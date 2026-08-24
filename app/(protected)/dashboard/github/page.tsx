import { requiresAuth } from '@/features/auth/actions'
import { DashboardHeader } from '@/features/dashboard/components/dashboard-header'
import { getInstalllationStatus } from '@/features/github/server/installation'
import { Metadata } from 'next'
import React from 'react'


export const metadata: Metadata = {
    title: "GitHub App Dashboard",

}

const DashBoardGitHubPage = async () => {

    // obviously protected route hai toh check if session exists
    const session = await requiresAuth()
    const installationStatus = await getInstalllationStatus(session.user.id)




    return (
        <DashboardHeader
            title='github app'
            description="Install or disconnect the reviewer app on your GitHub account." />
    )
}

export default DashBoardGitHubPage