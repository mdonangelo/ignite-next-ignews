import { signIn, useSession } from "next-auth/client";
import { api } from "../../services/api";
import { getStripeJs } from "../../services/stripe-front";
import styles from "./styles.module.scss";

interface SubscriptionButtonProps {
    priceId: string;
}

export function SubscribeButton ({ priceId }: SubscriptionButtonProps) {

    const [session] = useSession();

    async function handleSubscribe () {
        if(!session) {
            signIn("github")
            return;
        }

        // criar checkout session
        try {
            const response = await api.post("/subscribe");
            const { sessionId } = response.data;

            const stipe = await getStripeJs();
            
            await stipe.redirectToCheckout({sessionId})

        }catch (error) {
            alert(error.message);
        }
    }

    return (
        <button type="button" className={styles.subscribeButton} onClick={handleSubscribe}>
            Subscribe now
        </button>
    );
}