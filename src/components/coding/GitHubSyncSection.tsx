import React, { useState, useEffect } from 'react';
import { 
  Github, 
  GitBranch, 
  CheckCircle2, 
  ExternalLink, 
  Plus, 
  FolderGit2, 
  RefreshCw, 
  Unlink, 
  AlertCircle, 
  Key, 
  Lock, 
  Globe, 
  Code2, 
  Sparkles,
  Layers,
  ChevronRight,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface GitHubRepoInfo {
  id?: number | string;
  name: string;
  fullName: string;
  owner: string;
  isPrivate: boolean;
  defaultBranch: string;
  htmlUrl: string;
  description?: string;
}

export interface GitHubConnectionState {
  connected: boolean;
  username?: string;
  avatarUrl?: string;
  selectedRepo?: GitHubRepoInfo | null;
  selectedBranch?: string;
}

interface GitHubSyncSectionProps {
  userId: string;
  onRepoSelected?: (repo: GitHubRepoInfo) => void;
  onRequestPush?: () => void;
  connectionState: GitHubConnectionState;
  setConnectionState: React.Dispatch<React.SetStateAction<GitHubConnectionState>>;
}

export const GitHubSyncSection: React.FC<GitHubSyncSectionProps> = ({
  userId,
  onRepoSelected,
  onRequestPush,
  connectionState,
  setConnectionState,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modals state
  const [showRepoModal, setShowRepoModal] = useState<boolean>(false);
  const [showPatModal, setShowPatModal] = useState<boolean>(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState<boolean>(false);

  // Repositories list for selection
  const [repoList, setRepoList] = useState<GitHubRepoInfo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState<boolean>(false);
  const [repoSearch, setRepoSearch] = useState<string>('');

  // Create repo form
  const [repoTab, setRepoTab] = useState<'create' | 'select'>('create');
  const [newRepoName, setNewRepoName] = useState<string>('placivo-dsa-solutions');
  const [newRepoDesc, setNewRepoDesc] = useState<string>('Data Structures & Algorithms solutions solved on Placivo AI');
  const [newRepoPrivate, setNewRepoPrivate] = useState<boolean>(false);
  const [creatingRepo, setCreatingRepo] = useState<boolean>(false);

  // PAT form
  const [patInput, setPatInput] = useState<string>('');
  const [patUsername, setPatUsername] = useState<string>('');
  const [patLoading, setPatLoading] = useState<boolean>(false);

  // Check connection status on load
  useEffect(() => {
    fetchConnectionStatus();
  }, [userId]);

  const fetchConnectionStatus = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/github/status?userId=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.connected) {
          setConnectionState({
            connected: true,
            username: data.username,
            avatarUrl: data.avatarUrl,
            selectedRepo: data.selectedRepo || null,
            selectedBranch: data.selectedBranch || 'main'
          });
        }
      }
    } catch (err) {
      console.warn("Failed to check GitHub status:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectOAuth = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/github/connect-url?userId=${encodeURIComponent(userId)}`);
      const data = await res.json();
      
      if (data.url) {
        // Open OAuth popup window
        const width = 600;
        const height = 750;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        
        const popup = window.open(
          data.url,
          'GitHub_OAuth',
          `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes`
        );

        // Listen for message from callback window
        const messageHandler = (event: MessageEvent) => {
          if (event.data && event.data.type === 'GITHUB_AUTH_SUCCESS') {
            window.removeEventListener('message', messageHandler);
            fetchConnectionStatus();
            setShowRepoModal(true);
          }
        };
        window.addEventListener('message', messageHandler);

        // Fallback polling check if popup closes
        const timer = setInterval(() => {
          if (popup && popup.closed) {
            clearInterval(timer);
            window.removeEventListener('message', messageHandler);
            fetchConnectionStatus();
          }
        }, 1500);
      } else {
        // Fallback to PAT or local simulation if OAuth app not configured in dev
        setShowPatModal(true);
      }
    } catch (err: any) {
      setError("Failed to initiate GitHub authentication. Try using a Personal Access Token.");
      setShowPatModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectPat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patInput.trim()) return;
    try {
      setPatLoading(true);
      setError(null);
      const res = await fetch('/api/github/connect-pat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          token: patInput.trim(),
          username: patUsername.trim() || undefined
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setConnectionState({
          connected: true,
          username: data.username,
          avatarUrl: data.avatarUrl,
          selectedRepo: data.selectedRepo || null,
          selectedBranch: 'main'
        });
        setShowPatModal(false);
        setShowRepoModal(true);
      } else {
        setError(data.error || "Invalid Personal Access Token. Ensure it has 'repo' permissions.");
      }
    } catch (err: any) {
      setError("Failed to verify Personal Access Token.");
    } finally {
      setPatLoading(false);
    }
  };

  const fetchUserRepositories = async () => {
    if (!userId) return;
    try {
      setLoadingRepos(true);
      const res = await fetch(`/api/github/repositories?userId=${encodeURIComponent(userId)}`);
      if (res.ok) {
        const data = await res.json();
        setRepoList(data.repositories || []);
      }
    } catch (err) {
      console.warn("Failed to fetch repositories:", err);
    } finally {
      setLoadingRepos(false);
    }
  };

  const handleCreateRepository = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRepoName.trim()) return;
    try {
      setCreatingRepo(true);
      setError(null);
      const res = await fetch('/api/github/repositories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name: newRepoName.trim(),
          description: newRepoDesc.trim(),
          isPrivate: newRepoPrivate
        })
      });

      const data = await res.json();
      if (res.ok && data.repository) {
        const repoObj: GitHubRepoInfo = data.repository;
        setConnectionState(prev => ({
          ...prev,
          selectedRepo: repoObj,
          selectedBranch: repoObj.defaultBranch || 'main'
        }));
        if (onRepoSelected) onRepoSelected(repoObj);
        setShowRepoModal(false);
      } else {
        setError(data.error || "Failed to create repository on GitHub.");
      }
    } catch (err: any) {
      setError("Error creating repository.");
    } finally {
      setCreatingRepo(false);
    }
  };

  const handleSelectRepository = async (repo: GitHubRepoInfo) => {
    try {
      setLoading(true);
      const res = await fetch('/api/github/select-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          owner: repo.owner,
          name: repo.name,
          fullName: repo.fullName,
          defaultBranch: repo.defaultBranch || 'main'
        })
      });

      if (res.ok) {
        setConnectionState(prev => ({
          ...prev,
          selectedRepo: repo,
          selectedBranch: repo.defaultBranch || 'main'
        }));
        if (onRepoSelected) onRepoSelected(repo);
        setShowRepoModal(false);
      }
    } catch (err) {
      console.warn("Error selecting repo:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      setLoading(true);
      await fetch('/api/github/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      setConnectionState({
        connected: false,
        selectedRepo: null
      });
      setShowDisconnectConfirm(false);
    } catch (err) {
      console.warn("Error disconnecting GitHub:", err);
    } finally {
      setLoading(false);
    }
  };

  const openRepoModal = () => {
    setShowRepoModal(true);
    fetchUserRepositories();
  };

  const filteredRepos = repoList.filter(r => 
    r.name.toLowerCase().includes(repoSearch.toLowerCase()) || 
    r.fullName.toLowerCase().includes(repoSearch.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white shadow-xl border border-slate-700/80 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Left info */}
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white">
                <Github className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                    <span>GitHub Code Sync</span>
                    {connectionState.connected && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>Connected</span>
                      </span>
                    )}
                  </h3>
                </div>
                <p className="text-xs text-slate-300 font-medium">
                  Automatically push solved DSA problems to your personal GitHub repository organized by topic folders (`Arrays/Two-Sum.cpp`).
                </p>
              </div>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {!connectionState.connected ? (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleConnectOAuth}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl bg-white text-slate-950 font-black text-xs hover:bg-cyan-50 hover:text-cyan-950 transition-all flex items-center gap-2 shadow-lg hover:scale-[1.02] cursor-pointer"
                >
                  <Github className="w-4 h-4 text-slate-900" />
                  <span>{loading ? 'Connecting...' : 'Connect GitHub'}</span>
                </button>

                <button
                  onClick={() => setShowPatModal(true)}
                  className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Connect via GitHub Access Token"
                >
                  <Key className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Token</span>
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                {/* Account info badge */}
                <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-2xl border border-slate-700/80">
                  {connectionState.avatarUrl ? (
                    <img
                      src={connectionState.avatarUrl}
                      alt={connectionState.username}
                      className="w-6 h-6 rounded-full border border-cyan-400/50"
                    />
                  ) : (
                    <Github className="w-4 h-4 text-cyan-400" />
                  )}
                  <span className="text-xs font-extrabold text-cyan-300">
                    @{connectionState.username}
                  </span>
                </div>

                {/* Selected Repo status */}
                {connectionState.selectedRepo ? (
                  <div className="flex items-center gap-2 flex-wrap">
                    <a
                      href={connectionState.selectedRepo.htmlUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-200 font-bold text-xs flex items-center gap-1.5 transition-all group"
                      title="Open repository on GitHub"
                    >
                      <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="font-mono text-[11px] font-bold text-cyan-100">
                        {connectionState.selectedRepo.fullName}
                      </span>
                      <ExternalLink className="w-3 h-3 text-cyan-400 opacity-70 group-hover:opacity-100" />
                    </a>

                    <button
                      onClick={openRepoModal}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[11px] border border-slate-700 transition-colors cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={openRepoModal}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-md animate-pulse cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Select or Create Repo</span>
                  </button>
                )}

                <button
                  onClick={() => setShowDisconnectConfirm(true)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 border border-slate-700 transition-colors cursor-pointer ml-auto sm:ml-0"
                  title="Disconnect GitHub"
                >
                  <Unlink className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Repo Setup Modal */}
      <AnimatePresence>
        {showRepoModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => setShowRepoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 md:p-8 space-y-6 text-slate-900 relative"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-2xl bg-cyan-50 border border-cyan-100 text-cyan-600">
                    <FolderGit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-900">GitHub Repository Setup</h3>
                    <p className="text-xs text-slate-500 font-medium">Select where to save your Placivo DSA code solutions</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRepoModal(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
                <button
                  onClick={() => setRepoTab('create')}
                  className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    repoTab === 'create'
                      ? 'bg-white text-cyan-900 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Plus className="w-4 h-4 text-cyan-600" />
                  <span>Create New Repo</span>
                </button>
                <button
                  onClick={() => {
                    setRepoTab('select');
                    fetchUserRepositories();
                  }}
                  className={`flex-1 py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                    repoTab === 'select'
                      ? 'bg-white text-cyan-900 shadow-xs font-black'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span>Select Existing Repo</span>
                </button>
              </div>

              {/* Create Repo Form */}
              {repoTab === 'create' ? (
                <form onSubmit={handleCreateRepository} className="space-y-4 text-xs font-medium">
                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-700">Repository Name</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 font-mono text-xs">
                        @{connectionState.username}/
                      </span>
                      <input
                        type="text"
                        value={newRepoName}
                        onChange={(e) => setNewRepoName(e.target.value)}
                        placeholder="placivo-dsa-solutions"
                        className="w-full pl-28 pr-3 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none font-mono text-xs text-slate-900 font-bold"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-extrabold text-slate-700">Description</label>
                    <input
                      type="text"
                      value={newRepoDesc}
                      onChange={(e) => setNewRepoDesc(e.target.value)}
                      placeholder="Data Structures & Algorithms solutions solved on Placivo AI"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none text-xs text-slate-800"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        {newRepoPrivate ? <Lock className="w-3.5 h-3.5 text-amber-600" /> : <Globe className="w-3.5 h-3.5 text-emerald-600" />}
                        <span>{newRepoPrivate ? 'Private Repository' : 'Public Repository'}</span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        {newRepoPrivate ? 'Only you can view this repository.' : 'Anyone can view your code solutions and README statistics.'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setNewRepoPrivate(!newRepoPrivate)}
                      className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                        newRepoPrivate ? 'bg-amber-500' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                          newRepoPrivate ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-3 rounded-2xl bg-cyan-50/80 border border-cyan-100 text-[11px] text-cyan-950 font-medium space-y-1">
                    <div className="font-bold flex items-center gap-1 text-cyan-900">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                      <span>Automatic README Setup:</span>
                    </div>
                    <p>
                      Placivo AI will initialize your repository with a `README.md` progress dashboard tracking total solved questions and category breakdowns.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={creatingRepo}
                    className="w-full py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {creatingRepo ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Creating Repository on GitHub...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Create & Link Repository</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Select Existing Repo */
                <div className="space-y-3 text-xs">
                  <input
                    type="text"
                    value={repoSearch}
                    onChange={(e) => setRepoSearch(e.target.value)}
                    placeholder="Search your GitHub repositories..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none text-xs text-slate-800"
                  />

                  <div className="max-h-60 overflow-y-auto pr-1 space-y-2">
                    {loadingRepos ? (
                      <div className="py-8 text-center text-slate-400 space-y-2">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto text-cyan-600" />
                        <p className="font-medium">Fetching repositories from GitHub...</p>
                      </div>
                    ) : filteredRepos.length === 0 ? (
                      <div className="py-8 text-center text-slate-500 font-medium space-y-1">
                        <Code2 className="w-6 h-6 text-slate-300 mx-auto" />
                        <p>No repositories found matching "{repoSearch}"</p>
                      </div>
                    ) : (
                      filteredRepos.map((repo) => (
                        <button
                          key={repo.id || repo.fullName}
                          onClick={() => handleSelectRepository(repo)}
                          className="w-full p-3 rounded-2xl border border-slate-200 hover:border-cyan-500 bg-slate-50 hover:bg-cyan-50/50 transition-all text-left flex items-center justify-between gap-3 group cursor-pointer"
                        >
                          <div className="space-y-0.5 min-w-0">
                            <div className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                              <FolderGit2 className="w-4 h-4 text-cyan-600 shrink-0" />
                              <span className="truncate">{repo.fullName}</span>
                              {repo.isPrivate && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-amber-100 text-amber-800">
                                  Private
                                </span>
                              )}
                            </div>
                            {repo.description && (
                              <p className="text-[11px] text-slate-500 truncate">{repo.description}</p>
                            )}
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 shrink-0" />
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PAT Modal */}
      <AnimatePresence>
        {showPatModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50"
            onClick={() => setShowPatModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4 text-slate-900 relative"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 font-black text-slate-900">
                  <Key className="w-5 h-5 text-cyan-600" />
                  <span>GitHub Personal Access Token</span>
                </div>
                <button
                  onClick={() => setShowPatModal(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                Provide a GitHub Personal Access Token (`ghp_...`) with <code className="bg-slate-100 px-1 py-0.5 rounded text-cyan-800 font-bold">repo</code> scope. Tokens are stored securely server-side only.
              </p>

              <form onSubmit={handleConnectPat} className="space-y-3 text-xs font-medium">
                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">GitHub Username (Optional)</label>
                  <input
                    type="text"
                    value={patUsername}
                    onChange={(e) => setPatUsername(e.target.value)}
                    placeholder="e.g. octocat"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-extrabold text-slate-700">Personal Access Token (PAT)</label>
                  <input
                    type="password"
                    value={patInput}
                    onChange={(e) => setPatInput(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 font-mono text-xs outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={patLoading}
                  className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  {patLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Verifying Token...</span>
                    </>
                  ) : (
                    <span>Save Token & Connect</span>
                  )}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Disconnect Confirmation Modal */}
      <AnimatePresence>
        {showDisconnectConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50"
            onClick={() => setShowDisconnectConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 space-y-4 text-slate-900"
            >
              <div className="flex items-center gap-3 text-rose-600">
                <Unlink className="w-6 h-6" />
                <h3 className="font-black text-base">Disconnect GitHub?</h3>
              </div>

              <p className="text-xs text-slate-600 font-medium">
                This will un-link your GitHub account from Placivo AI. Your GitHub repository and existing solution files will not be deleted.
              </p>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setShowDisconnectConfirm(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDisconnect}
                  className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
