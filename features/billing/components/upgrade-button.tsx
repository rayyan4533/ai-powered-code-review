"use client";

import { useRouter } from "next/navigation";
import Script from "next/script";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { statusButtonClass } from "@/features/dashboard/lib/status-style";
import { confirmProSubscription, startProSubscription } from "@/lib/billing";

type RazorpayCheckout = new (options: Record<string, unknown>) => {
    open: () => void;
};

declare global {
    interface Window {
        Razorpay?: RazorpayCheckout;
    }
}

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
        if (typeof window === "undefined") return resolve(false);
        if (window.Razorpay) return resolve(true);

        const existingScript = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
        if (existingScript) {
            existingScript.addEventListener("load", () => resolve(true));
            existingScript.addEventListener("error", () => resolve(false));
            return;
        }

        const script = document.createElement("script");
        script.src = RAZORPAY_SCRIPT_URL;
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

export function UpgradeButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleUpgrade() {
        const key =
            process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
            process.env.NEXT_PUBLIC_RAZORPAY_API_KEY;

        if (!key) {
            toast.error("Razorpay is not configured yet. Missing NEXT_PUBLIC_RAZORPAY_KEY_ID in .env.");
            return;
        }

        setLoading(true);

        try {
            if (!window.Razorpay) {
                const loaded = await loadRazorpayScript();
                if (!loaded || !window.Razorpay) {
                    throw new Error("Unable to load Razorpay checkout SDK. Please check your internet connection.");
                }
            }

            const { subscriptionId } = await startProSubscription();

            const checkout = new window.Razorpay({
                key,
                subscription_id: subscriptionId,
                name: "Chai Code Reviewer",
                description: "Pro plan — unlimited AI reviews",
                handler: async (response: {
                    razorpay_payment_id: string;
                    razorpay_subscription_id: string;
                    razorpay_signature: string;
                }) => {
                    try {
                        toast.loading("Activating your Pro plan...", { id: "activate-pro" });
                        await confirmProSubscription(response);
                        toast.success("Payment successful! Your Pro plan is now active!", { id: "activate-pro" });
                        router.refresh();
                    } catch (err) {
                        toast.error(err instanceof Error ? err.message : "Could not activate Pro subscription", { id: "activate-pro" });
                    }
                },
                modal: {
                    ondismiss: () => {
                        setLoading(false);
                    },
                },
            });

            checkout.open();
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Could not start checkout.";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Script src={RAZORPAY_SCRIPT_URL} strategy="afterInteractive" />
            <Button
                onClick={handleUpgrade}
                disabled={loading}
                className={cn(statusButtonClass.success)}
            >
                {loading ? "Opening checkout…" : "Upgrade to Pro"}
            </Button>
        </>
    );
}