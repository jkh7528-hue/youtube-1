"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions";

type LoginState = { error?: string };

async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  return login(formData);
}

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="next" value={next} />
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-zinc-300">비밀번호</span>
        <input
          type="password"
          name="password"
          autoFocus
          required
          className="rounded-lg border border-zinc-700 bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-600 focus:border-rose-500"
          placeholder="••••••••"
        />
      </label>
      {state.error && <p className="text-sm text-rose-400">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="mt-1 rounded-lg bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-400 disabled:opacity-50"
      >
        {pending ? "확인 중..." : "입장하기"}
      </button>
    </form>
  );
}
