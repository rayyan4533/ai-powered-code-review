"use server";

import { getServerSession } from "@/features/auth/actions";
import { cancelProSubscription, createProSubscription } from "@/features/billing/server/subscription";
import { redirect } from "next/navigation";


export async function startProSubscription() {
    const session = await getServerSession();

    if (!session) {
        redirect("/sign-in");
    }

    return createProSubscription(session.user.id);
}

export async function cancelSubscription() {
    const session = await getServerSession();

    if (!session) {
        redirect("/sign-in");
    }

    await cancelProSubscription(session.user.id);
}

export async function confirmProSubscription(data: {
    razorpay_payment_id: string;
    razorpay_subscription_id: string;
    razorpay_signature: string;
}) {
    const { verifyAndActivateProSubscription } = await import("@/features/billing/server/subscription");
    const session = await getServerSession();

    if (!session) {
        redirect("/sign-in");
    }

    return verifyAndActivateProSubscription({
        userId: session.user.id,
        ...data,
    });
}