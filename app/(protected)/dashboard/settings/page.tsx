import { requiresAuth } from "@/features/auth/actions";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { SettingsContent } from "@/features/dashboard/components/settings-contents";
import { getUserSettings } from "@/features/settings/server/get-settings";

export default async function DashboardSettingsPage() {
    const session = await requiresAuth();
    const settings = await getUserSettings(session.user.id);

    return (
        <>
            <DashboardHeader
                title="Settings"
                description="Manage your profile and subscription."
            />
            <SettingsContent
                profile={settings.profile}
                subscription={settings.subscription}
                usage={settings.usage}
            />
        </>
    );
}
