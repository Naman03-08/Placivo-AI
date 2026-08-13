import React, { useState, useEffect } from 'react';
import { 
  Github, 
  GitBranch, 
  CheckCircle2, 
  ExternalLink, 
  Upload, 
  AlertTriangle, 
  Code2, 
  FileCode2, 
  RefreshCw, 
  Sparkles, 
  Folder,
  X,
  FileCheck2,
  Copy,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DSAProblem } from '../../types';
import { GitHubConnectionState } from './GitHubSyncSection';

interface PushToGitHubModalProps {
  userId: string;
  problem: DSAProblem | null;
  initialCode?: string;
  connectionState: GitHubConnectionState;
  onClose: () => void;
  onSuccess?: (solutionUrl: string) => void;
  onOpenConnect?: () => void;
}

const SUPPORTED_LANGUAGES = [
  { id: 'cpp', name: 'C++', ext: '.cpp', defaultStarter: `// Optimal C++ Solution\n#include <iostream>\n#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> mp;\n        for (int i = 0; i < nums.size(); i++) {\n            int diff = target - nums[i];\n            if (mp.count(diff)) return {mp[diff], i};\n            mp[nums[i]] = i;\n        }\n        return {};\n    }\n};` },
  { id: 'java', name: 'Java', ext: '.java', defaultStarter: `import java.util.HashMap;\nimport java.util.Map;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> map = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (map.containsKey(complement)) {\n                return new int[] { map.get(complement), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[0];\n    }\n}` },
  { id: 'python', name: 'Python 3', ext: '.py', defaultStarter: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        prevMap = {}\n        for i, n in enumerate(nums):\n            diff = target - n\n            if diff in prevMap:\n                return [prevMap[diff], i]\n            prevMap[n] = i\n        return []` },
  { id: 'javascript', name: 'JavaScript', ext: '.js', defaultStarter: `function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}` },
  { id: 'typescript', name: 'TypeScript', ext: '.ts', defaultStarter: `function twoSum(nums: number[], target: number): number[] {\n  const map = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const diff = target - nums[i];\n    if (map.has(diff)) return [map.get(diff)!, i];\n    map.set(nums[i], i);\n  }\n  return [];\n}` },
  { id: 'c', name: 'C', ext: '.c', defaultStarter: `#include <stdio.h>\n#include <stdlib.h>\n\nint* twoSum(int* nums, int numsSize, int target, int* returnSize) {\n    *returnSize = 2;\n    int* result = (int*)malloc(2 * sizeof(int));\n    for (int i = 0; i < numsSize; i++) {\n        for (int j = i + 1; j < numsSize; j++) {\n            if (nums[i] + nums[j] == target) {\n                result[0] = i;\n                result[1] = j;\n                return result;\n            }\n        }\n    }\n    return result;\n}` },
  { id: 'go', name: 'Go', ext: '.go', defaultStarter: `package main\n\nfunc twoSum(nums []int, target int) []int {\n    m := make(map[int]int)\n    for i, num := range nums {\n        if idx, ok := m[target-num]; ok {\n            return []int{idx, i}\n        }\n        m[num] = i\n    }\n    return nil\n}` },
  { id: 'rust', name: 'Rust', ext: '.rs', defaultStarter: `use std::collections::HashMap;\n\nimpl Solution {\n    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {\n        let mut map = HashMap::new();\n        for (i, &num) in nums.iter().enumerate() {\n            if let Some(&prev_idx) = map.get(&(target - num)) {\n                return vec![prev_idx as i32, i as i32];\n            }\n            map.insert(num, i);\n        }\n        vec![]\n    }\n}` },
];

export const PushToGitHubModal: React.FC<PushToGitHubModalProps> = ({
  userId,
  problem,
  initialCode,
  connectionState,
  onClose,
  onSuccess,
  onOpenConnect
}) => {
  if (!problem) return null;

  const [selectedLang, setSelectedLang] = useState<string>('cpp');
  const [code, setCode] = useState<string>(initialCode || '');
  const [commitMessage, setCommitMessage] = useState<string>(`Add solution: ${problem.title} (${problem.difficulty})`);
  const [includeHeaderComment, setIncludeHeaderComment] = useState<boolean>(true);

  // Status
  const [pushing, setPushing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [pushedSuccessUrl, setPushedSuccessUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Auto-detect extension and starter code
  const langObj = SUPPORTED_LANGUAGES.find(l => l.id === selectedLang) || SUPPORTED_LANGUAGES[0];

  // Derived folder and file path
  const folderName = (problem.category || 'Algorithms')
    .trim()
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

  const fileName = (problem.title || 'Solution')
    .trim()
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

  const derivedPath = `${folderName}/${fileName}${langObj.ext}`;

  useEffect(() => {
    if (initialCode && initialCode.trim()) {
      setCode(initialCode);
    } else if (!code || code.trim() === '') {
      setCode(langObj.defaultStarter);
    }
  }, [initialCode, selectedLang]);

  const handlePush = async (forceOverwrite = false) => {
    if (!userId || !problem) return;
    if (!connectionState.connected || !connectionState.selectedRepo) {
      setError("Please connect your GitHub account and select a target repository first.");
      if (onOpenConnect) onOpenConnect();
      return;
    }

    try {
      setPushing(true);
      setError(null);
      setConflictWarning(null);

      // Construct formatted code with optional Placivo header comment
      let finalCode = code;
      if (includeHeaderComment) {
        const commentHeader = 
          `/*\n` +
          ` * Problem: ${problem.title}\n` +
          ` * Category: ${problem.category}\n` +
          ` * Difficulty: ${problem.difficulty}\n` +
          ` * Solved on Placivo AI: https://placivo.ai\n` +
          ` * Date: ${new Date().toISOString().slice(0, 10)}\n` +
          ` */\n\n`;
        if (!finalCode.trim().startsWith('/*')) {
          finalCode = commentHeader + finalCode;
        }
      }

      const res = await fetch('/api/github/push-solution', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          problemId: problem.id,
          title: problem.title,
          category: problem.category,
          difficulty: problem.difficulty,
          code: finalCode,
          language: selectedLang,
          path: derivedPath,
          commitMessage: commitMessage.trim() || `Add solution: ${problem.title}`,
          forceOverwrite
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setPushedSuccessUrl(data.htmlUrl);
        if (onSuccess) onSuccess(data.htmlUrl);
      } else if (data.conflict && !forceOverwrite) {
        setConflictWarning(data.message || `A solution file already exists at ${derivedPath}. Overwrite existing file?`);
      } else {
        setError(data.error || "Failed to commit solution to GitHub.");
      }
    } catch (err: any) {
      setError("Failed to communicate with GitHub API server.");
    } finally {
      setPushing(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 md:p-8 space-y-6 text-slate-900 relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200 flex items-center gap-1">
                  <Github className="w-3 h-3 text-slate-900" />
                  <span>GitHub Sync</span>
                </span>
                <span className="text-[10px] font-extrabold uppercase text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-md border border-cyan-100">
                  {problem.category}
                </span>
                <span
                  className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md ${
                    problem.difficulty === 'Easy'
                      ? 'bg-emerald-100 text-emerald-800'
                      : problem.difficulty === 'Medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {problem.difficulty}
                </span>
              </div>
              <h3 className="text-lg md:text-xl font-black text-slate-900 leading-tight">
                {problem.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Success Banner State */}
          {pushedSuccessUrl ? (
            <div className="py-8 space-y-5 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border-4 border-emerald-50">
                <FileCheck2 className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <h4 className="text-xl font-black text-slate-900">Committed to GitHub!</h4>
                <p className="text-xs text-slate-600 font-medium">
                  Your solution for <strong className="text-slate-900">{problem.title}</strong> has been saved at <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-cyan-800">{derivedPath}</code>.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-center gap-3 flex-wrap">
                <a
                  href={pushedSuccessUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs transition-all flex items-center gap-2 shadow-md hover:scale-[1.02]"
                >
                  <span>Open File on GitHub</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Main Form Body */
            <div className="space-y-4 text-xs font-medium">
              {/* Target Repo Banner */}
              {!connectionState.connected || !connectionState.selectedRepo ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
                  <div className="flex items-center gap-2 font-black text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>GitHub Not Connected or No Repository Selected</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    Connect your GitHub account to choose or create a repository for your DSA solutions.
                  </p>
                  <button
                    onClick={onOpenConnect}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Connect GitHub
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-2 text-slate-700">
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4 text-cyan-600" />
                    <span>Target Repository:</span>
                    <strong className="font-mono text-cyan-900 text-[11px]">
                      {connectionState.selectedRepo.fullName}
                    </strong>
                    <span className="text-slate-400">({connectionState.selectedBranch || 'main'})</span>
                  </div>

                  <span className="text-[11px] text-slate-500 font-mono bg-white px-2 py-0.5 rounded-lg border border-slate-200">
                    {derivedPath}
                  </span>
                </div>
              )}

              {/* Language Selection */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-700">Programming Language</label>
                <div className="flex flex-wrap gap-1.5">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => setSelectedLang(lang.id)}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                        selectedLang === lang.id
                          ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lang.name} <span className="opacity-75 font-mono">{lang.ext}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Snippet Editor */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-extrabold text-slate-700 flex items-center gap-1.5">
                    <FileCode2 className="w-4 h-4 text-cyan-600" />
                    <span>Solution Code</span>
                  </label>

                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <div className="relative rounded-2xl border border-slate-300 bg-slate-900 overflow-hidden shadow-inner">
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    rows={10}
                    placeholder="Paste or write your solution code here..."
                    className="w-full p-4 font-mono text-xs text-slate-100 bg-transparent outline-none resize-y leading-relaxed"
                  />
                </div>
              </div>

              {/* Commit Message & Header Comment Checkbox */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="font-extrabold text-slate-700">Commit Message</label>
                  <input
                    type="text"
                    value={commitMessage}
                    onChange={(e) => setCommitMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:border-cyan-500 outline-none text-xs font-mono"
                  />
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-[11px] font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={includeHeaderComment}
                      onChange={(e) => setIncludeHeaderComment(e.target.checked)}
                      className="rounded text-cyan-600 focus:ring-cyan-500"
                    />
                    <span>Add Placivo Header Comment</span>
                  </label>
                </div>
              </div>

              {/* Conflict Warning */}
              {conflictWarning && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2">
                  <div className="flex items-center gap-2 font-black text-amber-900">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Existing Solution File Detected</span>
                  </div>
                  <p className="text-[11px] text-amber-800 font-medium">{conflictWarning}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handlePush(true)}
                      disabled={pushing}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors cursor-pointer"
                    >
                      {pushing ? 'Replacing...' : 'Replace Solution File'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConflictWarning(null)}
                      className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-xs transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 font-bold text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => handlePush(false)}
                  disabled={pushing || !connectionState.connected || !connectionState.selectedRepo}
                  className="px-5 py-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-black text-xs transition-all flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {pushing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Pushing Solution to GitHub...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Push to GitHub</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
