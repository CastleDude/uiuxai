import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-400 py-12 mt-auto">
      <div className="container-site grid gap-8 sm:grid-cols-3">
        <div>
          <h3 className="text-white font-bold text-lg mb-3">UX.AI.Tools</h3>
          <p className="text-sm">
            UI/UX设计师的AI工具决策引擎 — 帮你找到最适合的AI设计工具。
          </p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">提交工具</h3>
          <p className="text-sm">
            发现好用的AI设计工具？欢迎通过关于页面提交给我们。
          </p>
        </div>
        <div>
          <h3 className="text-white font-semibold mb-3">链接</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="/zh/about" className="hover:text-white transition-colors">关于我们</Link></li>
            <li><Link href="/zh/tools" className="hover:text-white transition-colors">工具库</Link></li>
            <li><Link href="/zh/guides" className="hover:text-white transition-colors">对比指南</Link></li>
          </ul>
        </div>
      </div>
      <div className="container-site mt-8 pt-6 border-t border-gray-800 text-center text-sm">
        &copy; {new Date().getFullYear()} UX.AI.Tools. All rights reserved.
      </div>
    </footer>
  );
}
