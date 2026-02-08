// PM2 Ecosystem Configuration for NotebookLM Columns
// https://pm2.keymetrics.io/docs/usage/application-declaration/

module.exports = {
  apps: [{
    name: 'notebook-columns',
    script: './server.js',
    
    // Instances
    instances: 1, // Use 'max' for cluster mode across all CPUs
    exec_mode: 'fork', // 'cluster' for load balancing
    
    // Watch & Restart
    watch: false, // Enable in development: true
    ignore_watch: ['node_modules', 'logs', '.git'],
    watch_options: {
      followSymlinks: false
    },
    
    // Resource Limits
    max_memory_restart: '500M',
    
    // Environment Variables
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    
    // Logging
    error_file: './logs/pm2-error.log',
    out_file: './logs/pm2-out.log',
    log_file: './logs/pm2-combined.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    
    // Restart Strategy
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    restart_delay: 4000,
    
    // Advanced Features
    kill_timeout: 5000,
    listen_timeout: 3000,
    shutdown_with_message: true,
    
    // Monitoring
    instance_var: 'INSTANCE_ID'
  }],
  
  // Deployment Configuration (optional)
  deploy: {
    production: {
      user: 'node',
      host: 'your-server.com',
      ref: 'origin/main',
      repo: 'git@github.com:your-repo/notebook-columns.git',
      path: '/var/www/notebook-columns',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production',
      'post-setup': 'npm install'
    }
  }
};
