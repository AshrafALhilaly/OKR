import { useState } from 'react';

const Teams = () => {
  const [teams] = useState([
    {
      id: 1,
      name: 'Customer Success',
      lead: 'Sarah Johnson',
      members: 8,
      objectives: 3,
      keyResults: 9,
      completionRate: 75,
      avatar: '👥',
    },
    {
      id: 2,
      name: 'Product',
      lead: 'Mike Chen',
      members: 12,
      objectives: 4,
      keyResults: 14,
      completionRate: 45,
      avatar: '🚀',
    },
    {
      id: 3,
      name: 'Engineering',
      lead: 'Alex Rivera',
      members: 20,
      objectives: 5,
      keyResults: 18,
      completionRate: 60,
      avatar: '⚙️',
    },
    {
      id: 4,
      name: 'Marketing',
      lead: 'Emma Wilson',
      members: 6,
      objectives: 3,
      keyResults: 10,
      completionRate: 80,
      avatar: '📈',
    },
    {
      id: 5,
      name: 'Sales',
      lead: 'David Brown',
      members: 15,
      objectives: 4,
      keyResults: 12,
      completionRate: 70,
      avatar: '💼',
    },
    {
      id: 6,
      name: 'HR',
      lead: 'Lisa Martinez',
      members: 4,
      objectives: 2,
      keyResults: 6,
      completionRate: 90,
      avatar: '👔',
    },
  ]);

  const getPerformanceColor = (rate: number) => {
    if (rate >= 70) return 'text-green-600 dark:text-green-400';
    if (rate >= 40) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Teams</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage teams and track their OKR performance
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          + New Team
        </button>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team) => (
          <div
            key={team.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="text-3xl mr-3">{team.avatar}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {team.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Lead: {team.lead}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Team Members</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {team.members}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Active Objectives</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {team.objectives}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Key Results</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {team.keyResults}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Completion Rate
                  </span>
                  <span
                    className={`text-lg font-bold ${getPerformanceColor(team.completionRate)}`}
                  >
                    {team.completionRate}%
                  </span>
                </div>
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      team.completionRate >= 70
                        ? 'bg-green-600'
                        : team.completionRate >= 40
                        ? 'bg-yellow-600'
                        : 'bg-red-600'
                    }`}
                    style={{ width: `${team.completionRate}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex justify-between">
                <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                  View Details
                </button>
                <button className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm font-medium">
                  Manage Team
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Team Performance Summary */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Overall Team Performance
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">67%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Average Completion Rate
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">21</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Total Objectives
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">69</div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Total Key Results
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Teams;