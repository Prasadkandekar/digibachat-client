import React, { useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Users, Calendar, BarChart3 } from 'lucide-react';

const Analytics: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  const analyticsData = {
    overview: [
      {
        title: 'Total Savings Growth',
        value: '₹25,430',
        change: '+18.2%',
        trend: 'up',
        icon: TrendingUp,
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      },
      {
        title: 'Monthly Average',
        value: '₹4,238',
        change: '+12.5%',
        trend: 'up',
        icon: DollarSign,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      },
      {
        title: 'Active Groups',
        value: '3',
        change: '+1',
        trend: 'up',
        icon: Users,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100'
      },
      {
        title: 'Contribution Rate',
        value: '98.5%',
        change: '+2.1%',
        trend: 'up',
        icon: BarChart3,
        color: 'text-teal-600',
        bgColor: 'bg-teal-100'
      }
    ],
    monthlyData: [
      { month: 'Aug 2024', savings: 3200, contributions: 3000, withdrawals: 0 },
      { month: 'Sep 2024', savings: 6800, contributions: 6000, withdrawals: 0 },
      { month: 'Oct 2024', savings: 10200, contributions: 9000, withdrawals: 0 },
      { month: 'Nov 2024', savings: 14800, contributions: 12500, withdrawals: 0 },
      { month: 'Dec 2024', savings: 19200, contributions: 16000, withdrawals: 0 },
      { month: 'Jan 2025', savings: 25430, contributions: 20500, withdrawals: 1500 }
    ],
    groupPerformance: [
      { name: 'Family Savings', contribution: 15420, target: 18000, percentage: 85.7 },
      { name: 'Friends Fund', contribution: 7830, target: 9000, percentage: 87.0 },
      { name: 'Office Group', contribution: 2180, target: 3000, percentage: 72.7 }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Period Selection */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Financial Analytics</h2>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        >
          <option value="3months">Last 3 Months</option>
          <option value="6months">Last 6 Months</option>
          <option value="1year">Last Year</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.overview.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${item.bgColor} rounded-lg flex items-center justify-center`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div className={`flex items-center ${item.color}`}>
                {item.trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                <span className="text-sm font-medium">{item.change}</span>
              </div>
            </div>
            <h3 className="text-sm text-gray-600 mb-1">{item.title}</h3>
            <p className="text-2xl font-bold text-gray-900">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Savings Growth Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Savings Growth Trend</h3>
          <div className="space-y-4">
            {analyticsData.monthlyData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 w-20">{data.month}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(data.savings / 25430) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-16 text-right">₹{data.savings.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Group Performance */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Group Performance</h3>
          <div className="space-y-6">
            {analyticsData.groupPerformance.map((group, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-900">{group.name}</span>
                  <span className="text-sm text-gray-600">{group.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${group.percentage}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>₹{group.contribution.toLocaleString()}</span>
                  <span>Target: ₹{group.target.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Month</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Total Savings</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Contributions</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Withdrawals</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Net Growth</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.monthlyData.map((data, index) => {
                const netGrowth = data.contributions - data.withdrawals;
                const prevSavings = index > 0 ? analyticsData.monthlyData[index - 1].savings : 0;
                const growthPercentage = prevSavings > 0 ? ((data.savings - prevSavings) / prevSavings * 100).toFixed(1) : '0.0';
                
                return (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-900">{data.month}</td>
                    <td className="py-3 px-4 text-right font-medium text-gray-900">₹{data.savings.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-green-600">+₹{data.contributions.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-red-600">
                      {data.withdrawals > 0 ? `-₹${data.withdrawals.toLocaleString()}` : '₹0'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end">
                        <span className="text-green-600 font-medium">+₹{netGrowth.toLocaleString()}</span>
                        <span className="text-xs text-gray-500 ml-2">({growthPercentage}%)</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-teal-50 to-green-50 p-6 rounded-xl border border-teal-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Financial Insights</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Best Performing Group</h4>
            <p className="text-sm text-gray-600">
              <strong>Friends Fund</strong> has the highest contribution rate at 87.0%, 
              showing excellent group discipline.
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Growth Opportunity</h4>
            <p className="text-sm text-gray-600">
              <strong>Office Group</strong> has potential for improvement. Consider 
              setting up automated reminders for contributions.
            </p>
          </div>
        </div>
      </div>

      {/* Backend Integration Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="text-lg font-semibold text-blue-900 mb-2">
          Backend Integration - Analytics
        </h4>
        <p className="text-blue-800 mb-4">
          This analytics page is ready for backend integration with the following API endpoints:
        </p>
        <div className="bg-white rounded-lg p-4 font-mono text-sm">
          <div className="space-y-2">
            <div>• <strong>GET</strong> /api/analytics/overview - Fetch overview statistics</div>
            <div>• <strong>GET</strong> /api/analytics/growth?period=6months - Fetch growth data</div>
            <div>• <strong>GET</strong> /api/analytics/groups - Fetch group performance data</div>
            <div>• <strong>GET</strong> /api/analytics/monthly - Fetch monthly breakdown</div>
            <div>• <strong>GET</strong> /api/analytics/insights - Fetch AI-generated insights</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;