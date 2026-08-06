import { getCategories } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import CategoryManager from "@/components/app/CategoryManager";
import SettingsForm from "@/components/app/SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [categories, settings] = await Promise.all([getCategories(), getSettings()]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
      <h1 className="text-xl font-bold text-zinc-50">설정</h1>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-bold text-zinc-400">카테고리 관리</h2>
        <CategoryManager categories={categories} />
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-bold text-zinc-400">판정 기준</h2>
        <SettingsForm settings={settings} />
      </section>
    </div>
  );
}
