import { useState } from 'react';

const Objectives = () => {
  const [objectives] = useState([
    {
      id: 1,
      title: 'Increase Customer Satisfaction',
      description: 'Improve NPS score and reduce customer churn rate',
      owner: 'Sarah Johnson',
      team: 'Customer Success',
      quarter: 'Q1 2024',
      status: 'On Track',
      progress: 75,
      keyResults: 3,
    },
    {
      id: 2,
      title: 'Launch New Product Line',
      description: 'Successfully launch and market our new product offerings',
      owner: 'Mike Chen',
      team: 'Product',
      quarter: 'Q1 2024',
      status: 'At Risk',
      progress: 45,
      keyResults: 4,
    },
    {
      id: 3,
      title: 'Improve Development Velocity',
      description: 'Increase team productivity and reduce time to market',
      owner: 'Alex Rivera',
      team: 'Engineering',
      quarter: 'Q1 2024',
      status: 'On Track',
      progress: 60,
      keyResults: 5,
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

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Objectives</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage and track your organization's objectives
          </p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
          + New Objective
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option>All Teams</option>
          <option>Customer Success</option>
          <option>Product</option>
          <option>Engineering</option>
          <option>Marketing</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option>All Quarters</option>
          <option>Q1 2024</option>
          <option>Q2 2024</option>
          <option>Q3 2024</option>
          <option>Q4 2024</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option>All Status</option>
          <option>On Track</option>
          <option>At Risk</option>
          <option>Behind</option>
        </select>
      </div>

      {/* Objectives List */}
      <div className="space-y-4">
        {objectives.map((objective) => (
          <div
            key={objective.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {objective.title}
                  </h3>
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    {objective.description}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    objective.status
                  )}`}
                >
                  {objective.status}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Owner</p>
                  <p className="font-medium text-gray-900 dark:text-white">{objective.owner}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Team</p>
                  <p className="font-medium text-gray-900 dark:text-white">{objective.team}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Quarter</p>
                  <p className="font-medium text-gray-900 dark:text-white">{objective.quarter}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400">Key Results</p>
                  <p className="font-medium text-gray-900 dark:text-white">{objective.keyResults}</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">Progress</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {objective.progress}%
                  </span>
                </div>
                <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${objective.progress}%` }}
                  />
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                  View Details
                </button>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium">
                  Edit
                </button>
                <span className="text-gray-300 dark:text-gray-600">|</span>
                <button className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium">
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Objectives;