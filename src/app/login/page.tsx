import LoginForm from "@/components/app/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-zinc-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-xl shadow-black/40">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-rose-500/10 text-xl">
            💔
          </div>
          <h1 className="text-lg font-bold text-zinc-100">심정지 발굴기</h1>
          <p className="mt-1 text-sm text-zinc-500">비밀번호를 입력해 입장하세요</p>
        </div>
        <LoginForm next={next ?? "/"} />
      </div>
    </div>
  );
}
