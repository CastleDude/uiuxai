import { getUpdates } from "@/lib/data";

export default async function UpdatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const updates = getUpdates();

  return (
    <div className="container-site py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        {locale === "zh" ? "更新动态" : "Updates"}
      </h1>
      {updates.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 py-12 text-center">
          {locale === "zh" ? "暂无更新" : "No updates yet"}
        </p>
      ) : (
        <div className="space-y-6">
          {updates.map((u) => (
            <div
              key={u.id}
              className="border-l-2 border-brand-500 pl-4"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-400">{u.created_at}</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  {u.type === "new_tool"
                    ? locale === "zh"
                      ? "新工具"
                      : "New Tool"
                    : u.type === "tool_update"
                    ? locale === "zh"
                      ? "工具更新"
                      : "Tool Update"
                    : locale === "zh"
                    ? "行业动态"
                    : "Industry News"}
                </span>
              </div>
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white">
                {locale === "zh" ? u.title : u.title_en || u.title}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {locale === "zh" ? u.content : u.content_en || u.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
