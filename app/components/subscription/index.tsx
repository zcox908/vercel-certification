import {
  createSubscription,
  getSubscription,
  subscribe,
  unsubscribe,
} from "@/actions/subscriptions";
import SubmitButton from "./submit-button";

export default async function Subscription() {
  const sub = await getSubscription();

  if (!sub) {
    return (
      <form action={createSubscription}>
        <SubmitButton
          pendingLabel="Subscribing…"
          className="bg-black text-white dark:bg-white dark:text-black"
        >
          Subscribe
        </SubmitButton>
      </form>
    );
  }

  if (!sub.success) {
    return (
      <span className="text-xs text-red-600">
        {sub.error.code}: {sub.error.message}
      </span>
    );
  }

  const { status } = sub.data;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-zinc-600 dark:text-zinc-400 hidden sm:inline">
        <span className={status === "active" ? "text-green-600 font-semibold" : "text-zinc-500"}>
          {status === "active" ? "Subscribed" : "Inactive"}
        </span>
      </span>
      {status === "inactive" ? (
        <form action={subscribe}>
          <SubmitButton
            pendingLabel="Activating…"
            className="bg-black text-white dark:bg-white dark:text-black"
          >
            Activate
          </SubmitButton>
        </form>
      ) : (
        <form action={unsubscribe}>
          <SubmitButton
            pendingLabel="Unsubscribing…"
            className="border border-zinc-300 dark:border-zinc-700"
          >
            Unsubscribe
          </SubmitButton>
        </form>
      )}
    </div>
  );
}
