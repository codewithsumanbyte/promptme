"use client"

import * as React from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const mockData = [
  { name: 'Mon', views: 2400, copies: 1400 },
  { name: 'Tue', views: 1398, copies: 2210 },
  { name: 'Wed', views: 9800, copies: 2290 },
  { name: 'Thu', views: 3908, copies: 2000 },
  { name: 'Fri', views: 4800, copies: 2181 },
  { name: 'Sat', views: 3800, copies: 2500 },
  { name: 'Sun', views: 4300, copies: 2100 },
]

interface AnalyticsProps {
  topPrompts: Array<{ title: string, views: number, copies: number }>
}

export function AnalyticsDashboard({ topPrompts }: AnalyticsProps) {
  // Map real top prompt data for the Bar chart
  const chartData = topPrompts.map(p => ({
    name: p.title.substring(0, 10) + (p.title.length > 10 ? '...' : ''),
    views: p.views,
    copies: p.copies,
    fullName: p.title
  }))

  return (
    <div className="space-y-6 w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Overview Trend Chart */}
        <div className="border border-white/10 bg-zinc-950 rounded-3xl p-6 h-80">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-white">Performance Activity</h3>
            <span className="text-xs font-medium text-zinc-500">Last 7 Days</span>
          </div>
          <div className="w-full h-60">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} 
                  itemStyle={{ color: '#fff' }}
                  cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1 }}
                />
                <Area type="monotone" dataKey="views" stroke="#ffffff" fillOpacity={1} fill="url(#colorViews)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Prompts Rankings */}
        <div className="border border-white/10 bg-zinc-950 rounded-3xl p-6 h-80 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-lg text-white">Top Product Performance</h3>
            <span className="text-xs font-medium text-zinc-500">By Total Views</span>
          </div>
          <div className="w-full flex-1 min-h-0 flex items-center justify-center">
             {chartData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                      contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    />
                    <Bar dataKey="views" fill="#ffffff" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="copies" fill="#52525b" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
               </ResponsiveContainer>
             ) : (
               <div className="text-zinc-600 text-sm font-medium italic">No prompt interaction data available yet.</div>
             )}
          </div>
        </div>
      </div>
    </div>
  )
}
