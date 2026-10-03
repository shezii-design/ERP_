import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Settings, Shield, User, Server, LogOut, CheckCircle2 } from 'lucide-react';
import { isConfigured } from '../../lib/supabaseClient';

export const SettingsModule: React.FC = () => {
  const { user, role, signOut } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Settings className="w-7 h-7 text-indigo-400" />
          <span>Enterprise Settings & Security</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Manage your enterprise profile, Supabase session tokens, and RBAC permissions.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
          <User className="w-5 h-5 text-indigo-400" />
          <span>User Profile & Access Role</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <span className="text-slate-400 block text-xs uppercase tracking-wider mb-1">Email Address</span>
            <span className="text-white font-medium">{user?.email || 'N/A'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-xs uppercase tracking-wider mb-1">Assigned ERP Role</span>
            <span className="px-3 py-1 bg-indigo-950 text-indigo-400 border border-indigo-800 rounded-lg text-xs font-semibold inline-block">
              {role}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-xs uppercase tracking-wider mb-1">Authentication Provider</span>
            <span className="text-white font-medium">{user?.app_metadata?.provider || 'Supabase Auth'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-xs uppercase tracking-wider mb-1">User UUID</span>
            <span className="text-slate-300 font-mono text-xs">{user?.id || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center space-x-2">
          <Server className="w-5 h-5 text-cyan-400" />
          <span>Supabase Environment Integration</span>
        </h3>

        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
          <div className="flex items-center space-x-3">
            <span className={`w-3 h-3 rounded-full ${isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
            <div>
              <span className="text-sm font-semibold text-white block">
                {isConfigured ? 'Supabase Connected via Environment Secrets' : 'Supabase Environment Variables Missing'}
              </span>
              <span className="text-xs text-slate-400">
                {isConfigured ? 'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are correctly set.' : 'Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your deployment environment variables.'}
              </span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs font-mono">
            {isConfigured ? 'Active' : 'Missing'}
          </span>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Sign Out of Session</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Safely terminate your active Supabase session and clear persistent local credentials.
          </p>
        </div>
        <button
          onClick={signOut}
          className="px-4 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-800 rounded-xl text-xs font-semibold flex items-center space-x-2 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};
