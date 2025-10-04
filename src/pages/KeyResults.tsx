import { useState } from 'react';

const KeyResults = () => {
  const [keyResults] = useState([
    {
      id: 1,
      title: 'Increase NPS score from 45 to 60',
      objective: 'Increase Customer Satisfaction',
      owner: 'Sarah Johnson',
      currentValue: 52,
      targetValue: 60,
      unit: 'points',
      status: 'On Track',
      dueDate: '2024-03-31',
    },
    {
      id: 2,
      title: 'Reduce customer churn rate from 15% to 10%',
      objective: 'Increase Customer Satisfaction',
      owner: 'Sarah Johnson',
      currentValue: 12,
      targetValue: 10,
      unit: '%',
      status: 'On Track',
      dueDate: '2024-03-31',
    },
    {
      id: 3,
      title: 'Launch 3 new product features',
      objective: 'Launch New Product Line',
      owner: 'Mike Chen',
      currentValue: 1,
      targetValue: 3,
      unit: 'features',
      status: 'At Risk',
      dueDate: '2024-03-31',
    },
    {
      id: 4,
      title: 'Achieve 1000 new sign-ups',
      objective: 'Launch New Product Line',
      owner: 'Mike Chen',
      currentValue: 450,
      targetValue: 1000,
      unit: 'users',
      status: 'Behind',
      dueDate: '2024-03-31',
    },
    {
      id: 5,
      title: 'Reduce deployment time from 4 hours to 1 hour',
      objective: 'Improve Development Velocity',
      owner: 'Alex Rivera',
      currentValue: 2.5,
      targetValue: 1,
      unit: 'hours',
      status: 'On Track',
      dueDate: '2024-03-31',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Track':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'At Risk':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Behind':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Key Results</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Track measurable outcomes for your objectives
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          + New Key Result
        </button>
      </div>

      {/* Key Results Table */}
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Key Result
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Objective
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Progress
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {keyResults.map((kr) => {
                const progress = calculateProgress(kr.currentValue, kr.targetValue);
                return (
                  <tr key={kr.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {kr.title}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {kr.currentValue} / {kr.targetValue} {kr.unit}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{kr.objective}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{kr.owner}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-32">
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                progress >= 70
                                  ? 'bg-green-600'
                                  : progress >= 40
                                  ? 'bg-yellow-600'
                                  : 'bg-red-600'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            {progress}%
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          kr.status
                        )}`}
                      >
                        {kr.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(kr.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                        Edit
                      </button>
                      <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KeyResults;