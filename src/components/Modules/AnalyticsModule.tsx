import React from 'react';
import { BarChart3, TrendingUp, ShieldCheck, Download, RefreshCw, Cpu } from 'lucide-react';

export const AnalyticsModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
          <BarChart3 className="w-7 h-7 text-cyan-400" />
          <span>Analytics & Performance Metrics</span>
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Deep telemetry, operational throughput, and Supabase database latency reports.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            <span>Monthly Revenue Growth Velocity</span>
          </h3>
          <div className="h-64 flex items-end justify-between gap-3 pt-6 px-4 bg-slate-950/60 rounded-xl border border-slate-800">
            {[45, 62, 58, 74, 88, 95].map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-gradient-to-t from-indigo-600 to-cyan-400 rounded-t-lg transition-all duration-500 hover:opacity-90"
                  style={{ height: `${val}%` }}
                />
                <span className="text-xs text-slate-500 font-mono">M{idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
          <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
            <Cpu className="w-5 h-5 text-emerald-400" />
            <span>Supabase Cluster Health</span>
          </h3>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-white block">PostgreSQL Connection Pool</span>
                <span className="text-xs text-slate-400">Active pool connections</span>
              </div>
              <span className="text-emerald-400 font-mono font-bold">14 / 100</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-white block">API Latency (PostgREST)</span>
                <span className="text-xs text-slate-400">Average round-trip response</span>
              </div>
              <span className="text-indigo-400 font-mono font-bold">34ms</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-white block">Auth Token Security</span>
                <span className="text-xs text-slate-400">JWT RS256 Signature Verification</span>
              </div>
              <span className="text-emerald-400 font-mono font-bold">Secure</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
