import Razorpay from "razorpay";


let razorpay: Razorpay | null = null;


export function getRazorpay() {
    if (!razorpay) {
        const keyId =
            process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
            process.env.NEXT_PUBLIC_RAZORPAY_API_KEY ||
            process.env.RAZORPAY_API_KEY;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
            throw new Error("Razorpay credentials (keyId or keySecret) are not set in environment.");
        }

        razorpay = new Razorpay({
            key_id: keyId,
            key_secret: keySecret,
        });
    }

    return razorpay;
}