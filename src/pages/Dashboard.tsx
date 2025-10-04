const Dashboard = () => {
  const stats = [
    { label: 'Total Objectives', value: '24', change: '+12%', positive: true },
    { label: 'Key Results', value: '89', change: '+8%', positive: true },
    { label: 'Teams', value: '12', change: '0%', positive: true },
    { label: 'Completion Rate', value: '68%', change: '-3%', positive: false },
  ];

  const recentObjectives = [
    { id: 1, title: 'Increase Customer Satisfaction', progress: 75, team: 'Customer Success' },
    { id: 2, title: 'Launch New Product Line', progress: 45, team: 'Product' },
    { id: 3, title: 'Improve Development Velocity', progress: 60, team: 'Engineering' },
    { id: 4, title: 'Expand Market Reach', progress: 30, team: 'Marketing' },
  ];

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track your organization's OKR performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
              {stat.value}
            </p>
            <div className="mt-2 flex items-center">
              <span
                className={`text-sm font-medium ${
                  stat.positive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </span>
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                from last quarter
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Objectives */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Objectives
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentObjectives.map((objective) => (
              <div
                key={objective.id}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {objective.title}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {objective.team}
                  </p>
                </div>
                <div className="ml-4 w-32">
                  <div className="flex items-center">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${objective.progress}%` }}
                      />
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {objective.progress}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;