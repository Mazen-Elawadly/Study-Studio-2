import React, { useState } from 'react';
import { Github, Globe, Check, Copy, ExternalLink, Terminal, Sparkles, Rocket, ArrowRight, ShieldCheck } from 'lucide-react';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployModal: React.FC<DeployModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activePlatform, setActivePlatform] = useState<'ghpages' | 'vercel' | 'netlify'>('ghpages');
  const [username, setUsername] = useState('');
  const [repoName, setRepoName] = useState('study-studio');

  if (!isOpen) return null;

  const resolvedUser = username.trim() || 'YOUR-GITHUB-USERNAME';
  const resolvedRepo = repoName.trim() || 'study-studio';

  const gitCommands = `# 1. Create a new repository on GitHub: https://github.com/new
#    Name it "${resolvedRepo}" and choose "Public"

# 2. Add your remote repository and push:
git remote add origin https://github.com/${resolvedUser}/${resolvedRepo}.git
git push -u origin main`;

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 sm:p-7 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Rocket className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-xl text-[var(--ink)]">
                Deploy to GitHub & Make Public
              </h2>
              <p className="text-xs text-[var(--muted)]">
                Your local Git repo is initialized with branch <code className="text-[var(--ink)] font-mono font-bold">main</code>.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-[var(--muted)] hover:text-[var(--ink)] hover:bg-[var(--surface-2)] flex items-center justify-center transition-colors cursor-pointer text-lg leading-none"
          >
            ×
          </button>
        </div>

        {/* Step 1: Push to GitHub */}
        <div className="flex flex-col gap-3 bg-[var(--bg)] p-4 rounded-xl border border-[var(--line)]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] flex items-center gap-1.5">
              <Github className="w-4 h-4 text-[var(--ink)]" />
              <span>Step 1: Push code to your GitHub account</span>
            </span>
            <a
              href="https://github.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[var(--accent)] hover:underline inline-flex items-center gap-1 font-semibold"
            >
              <span>Create GitHub Repo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div>
              <label className="text-[11px] font-medium text-[var(--muted)]">Your GitHub Username:</label>
              <input
                type="text"
                placeholder="e.g. johndoe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-8 px-2 rounded-md border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-mono mt-0.5 focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="text-[11px] font-medium text-[var(--muted)]">Repository Name:</label>
              <input
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                className="w-full h-8 px-2 rounded-md border border-[var(--line)] bg-[var(--surface)] text-[var(--ink)] font-mono mt-0.5 focus:outline-none focus:border-[var(--accent)]"
              />
            </div>
          </div>

          <div className="relative mt-1">
            <pre className="p-3 bg-[var(--surface)] border border-[var(--line)] rounded-lg text-xs font-mono text-[var(--ink)] overflow-x-auto whitespace-pre leading-relaxed">
              {gitCommands}
            </pre>
            <button
              type="button"
              onClick={() => copyToClipboard(gitCommands, 'git')}
              className="absolute top-2 right-2 px-2.5 py-1 rounded bg-[var(--ink)] text-[var(--surface)] text-[11px] font-semibold flex items-center gap-1 hover:opacity-90 transition-opacity cursor-pointer shadow-xs"
            >
              {copiedSection === 'git' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Step 2: Choose Public Hosting Platform */}
        <div className="flex flex-col gap-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
            Step 2: Choose Free Public Hosting (100% Free & Fast)
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'ghpages' as const, label: 'GitHub Pages', tag: 'Automated Actions' },
              { id: 'vercel' as const, label: 'Vercel', tag: '1-Click Fast' },
              { id: 'netlify' as const, label: 'Netlify', tag: 'Zero Config' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActivePlatform(p.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  activePlatform === p.id
                    ? 'border-[var(--accent)] bg-[var(--accent-soft)] shadow-xs'
                    : 'border-[var(--line)] bg-[var(--bg)] hover:border-[var(--muted)]'
                }`}
              >
                <b className="block font-display text-xs text-[var(--ink)]">{p.label}</b>
                <span className="text-[10px] text-[var(--muted)]">{p.tag}</span>
              </button>
            ))}
          </div>

          {/* Details per platform */}
          {activePlatform === 'ghpages' && (
            <div className="p-4 rounded-xl bg-[var(--surface-2)]/50 border border-[var(--line)] flex flex-col gap-2.5 text-xs">
              <div className="flex items-center gap-2 font-semibold text-[var(--ink)]">
                <Globe className="w-4 h-4 text-emerald-500" />
                <span>Deploy via GitHub Pages (Built-in workflow ready)</span>
              </div>
              <p className="text-[var(--muted)]">
                We have generated a pre-configured workflow file at <code className="bg-[var(--surface)] px-1 py-0.5 rounded font-mono">.github/workflows/deploy.yml</code>.
              </p>
              <ol className="list-decimal list-inside space-y-1 text-[var(--ink)] font-medium pl-1">
                <li>Push your repository to GitHub using the commands above.</li>
                <li>Go to your GitHub repo <strong>Settings</strong> &gt; <strong>Pages</strong>.</li>
                <li>Under <strong>Build and deployment &gt; Source</strong>, select <strong>GitHub Actions</strong>.</li>
                <li>GitHub Actions will build and deploy your site automatically!</li>
              </ol>
              <div className="mt-1 text-[11px] text-[var(--muted)] bg-[var(--surface)] p-2.5 rounded-lg border border-[var(--line)] font-mono">
                Public Live URL will be: https://{resolvedUser}.github.io/{resolvedRepo}/
              </div>
            </div>
          )}

          {activePlatform === 'vercel' && (
            <div className="p-4 rounded-xl bg-[var(--surface-2)]/50 border border-[var(--line)] flex flex-col gap-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[var(--ink)] flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-indigo-500" />
                  <span>Deploy to Vercel (Instant HTTPS & Global CDN)</span>
                </span>
                <a
                  href="https://vercel.com/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--accent)] hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  <span>Open Vercel</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[var(--ink)] font-medium pl-1">
                <li>Log in to <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] underline">vercel.com</a> with your GitHub account.</li>
                <li>Click <strong>Add New Project</strong> &gt; <strong>Import Git Repository</strong>.</li>
                <li>Select <strong>{resolvedRepo}</strong>.</li>
                <li>Framework preset will automatically detect <strong>Vite</strong>. Click <strong>Deploy</strong>.</li>
              </ol>
            </div>
          )}

          {activePlatform === 'netlify' && (
            <div className="p-4 rounded-xl bg-[var(--surface-2)]/50 border border-[var(--line)] flex flex-col gap-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-[var(--ink)] flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-teal-500" />
                  <span>Deploy to Netlify</span>
                </span>
                <a
                  href="https://app.netlify.com/start"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--accent)] hover:underline inline-flex items-center gap-1 font-semibold"
                >
                  <span>Open Netlify</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-[var(--ink)] font-medium pl-1">
                <li>Go to Netlify and click <strong>Add new site &gt; Import an existing project</strong>.</li>
                <li>Authorize GitHub and pick <strong>{resolvedRepo}</strong>.</li>
                <li>Build command: <code className="bg-[var(--surface)] px-1 rounded font-mono">npm run build</code>, Publish dir: <code className="bg-[var(--surface)] px-1 rounded font-mono">dist</code>.</li>
                <li>Click <strong>Deploy Site</strong> to get your public live link!</li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[var(--line)] pt-4">
          <span className="text-[11px] text-[var(--muted)] flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Fully open-source, client-side, zero server costs</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[var(--accent)] text-[var(--on-accent)] font-semibold text-xs hover:brightness-105 cursor-pointer shadow-xs"
          >
            Got it, Let's Study
          </button>
        </div>
      </div>
    </div>
  );
};
