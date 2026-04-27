import cn from "classnames";
import {
  createSubscription,
  getSubscription,
  subscribe,
  unsubscribe,
} from "@/actions/subscriptions";

const buttonBase = "rounded-md px-3 py-1.5 text-xs font-medium transition-colors";

export default async function Subscription() {
  const sub = await getSubscription();

  if (!sub) {
    return (
      <form action={createSubscription}>
        <button
          type="submit"
          className={cn(buttonBase, "bg-black text-white dark:bg-white dark:text-black")}
        >
          Subscribe
        </button>
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
          <button
            type="submit"
            className={cn(buttonBase, "bg-black text-white dark:bg-white dark:text-black")}
          >
            Activate
          </button>
        </form>
      ) : (
        <form action={unsubscribe}>
          <button
            type="submit"
            className={cn(buttonBase, "border border-zinc-300 dark:border-zinc-700")}
          >
            Unsubscribe
          </button>
        </form>
      )}
    </div>
  );
}
