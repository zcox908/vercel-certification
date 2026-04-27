"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { newsReq } from "@/lib/news-api";
import type {ApiResult} from "@/lib/news-api-types"

const COOKIE = "vdn_sub_token";
const COOKIE_MAX_AGE = 60 * 60 * 24;

type Subscription = {
  token: string;
  status: "active" | "inactive";
  subscribedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

async function readToken() {
  const store = await cookies();
  return store.get(COOKIE)?.value;
}

export async function createSubscription(): Promise<void> {
  const res = await newsReq("/subscription/create", {
    method: "POST",
  });

  const token = res.headers.get("x-subscription-token");
  if (token) {
    const store = await cookies();
    store.set(COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
  }
  
  revalidatePath("/", "layout");
}

export async function getSubscription(): Promise<ApiResult<Subscription> | null> {
  const token = await readToken();
  if (!token) return null;
  const res = await newsReq("/subscription", {
    headers: { "x-subscription-token": token },
  });
  if (res.status === 404) {
    const store = await cookies();
    store.delete(COOKIE);
    return null;
  }
  return (await res.json()) as ApiResult<Subscription>;
}

export async function subscribe(): Promise<void> {
  const token = await readToken();
  if (!token) return;
  await newsReq("/subscription", {
    method: "POST",
    headers: { "x-subscription-token": token },
  });
  revalidatePath("/", "layout");
}

export async function unsubscribe(): Promise<void> {
  const token = await readToken();
  if (!token) return;
  await newsReq("/subscription", {
    method: "DELETE",
    headers: { "x-subscription-token": token },
  });
  revalidatePath("/", "layout");
}
