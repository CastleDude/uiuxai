export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isZh = locale === "zh";

  return (
    <div className="container-site py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        {isZh ? "关于 UX.AI.Tools" : "About UX.AI.Tools"}
      </h1>

      <section className="prose dark:prose-invert max-w-none space-y-4">
        <p className="text-gray-700 dark:text-gray-300">
          {isZh
            ? "UX.AI.Tools 是一个专注于 UI/UX 设计师工作流的 AI 工具导航站。我们不做大而全的工具列表，而是按照设计师的真实工作流程来组织和推荐 AI 工具，帮助设计师做出「用不用这个工具」的决策。"
            : "UX.AI.Tools is a curated AI tools directory focused on UI/UX designer workflows. We don't list everything — we organize and recommend AI tools by real design workflows, helping designers decide which tools to use."}
        </p>

        <h2 className="text-xl font-bold mt-8 text-gray-900 dark:text-white">
          {isZh ? "提交工具" : "Submit a Tool"}
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          {isZh
            ? "发现好用的 AI 设计工具？欢迎通过 GitHub Issues 提交给我们："
            : "Found a great AI design tool? Submit it via GitHub Issues:"}
        </p>
        <a
          href="https://github.com/CastleDude/uiuxai/issues/new"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-medium rounded-lg transition-colors text-sm"
        >
          {isZh ? "提交工具 →" : "Submit a Tool →"}
        </a>

        <h2 className="text-xl font-bold mt-8 text-gray-900 dark:text-white">
          {isZh ? "联系我们" : "Contact"}
        </h2>
        <p className="text-gray-700 dark:text-gray-300">
          {isZh
            ? "如有任何问题或建议，欢迎通过 GitHub 或邮件与我们联系。"
            : "For questions or suggestions, reach out via GitHub or email."}
        </p>
      </section>
    </div>
  );
}
