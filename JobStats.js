/*
  JobStats.js — React Component
  Shows live job statistics bar on HR Portal page
*/


function JobStats() {
  const [stats, setStats] = React.useState({
    total: 0,
    types: {},
    topType: '—'
  });

  function calculateStats() {
    const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
    const types = {};
    jobs.forEach(j => {
      types[j.type] = (types[j.type] || 0) + 1;
    });
    const topType = Object.keys(types).length > 0
      ? Object.entries(types).sort((a, b) => b[1] - a[1])[0][0]
      : '—';
    setStats({ total: jobs.length, types, topType });
  }

  React.useEffect(() => {
    calculateStats();

    // re-calculate whenever localStorage changes (job posted/deleted)
    window.addEventListener('storage', calculateStats);

    // also poll every second to catch same-tab updates
    const interval = setInterval(calculateStats, 1000);

    return () => {
      window.removeEventListener('storage', calculateStats);
      clearInterval(interval);
    };
  }, []);

  const typeColors = {
    'Full Time': 'success',
    'Part Time': 'warning',
    'Internship': 'info',
    'Remote': 'primary',
    'Contract': 'secondary'
  };

  return React.createElement('div', {
    style: {
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderRadius: '12px',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '20px',
      marginBottom: '8px',
      border: '1px solid rgba(255,255,255,0.08)'
    }
  },
    // Total jobs
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
      React.createElement('div', {
        style: {
          background: '#0d6efd',
          borderRadius: '8px',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      },
        React.createElement('i', { className: 'bi bi-briefcase-fill text-white' })
      ),
      React.createElement('div', null,
        React.createElement('div', {
          style: { color: '#fff', fontWeight: 700, fontSize: '1.3rem', lineHeight: 1 }
        }, stats.total),
        React.createElement('div', {
          style: { color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }
        }, 'Total Jobs')
      )
    ),

    // Divider
    React.createElement('div', {
      style: { width: '1px', height: '36px', background: 'rgba(255,255,255,0.1)' }
    }),

    // Top job type
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
      React.createElement('div', {
        style: {
          background: '#198754',
          borderRadius: '8px',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }
      },
        React.createElement('i', { className: 'bi bi-star-fill text-white' })
      ),
      React.createElement('div', null,
        React.createElement('div', {
          style: { color: '#fff', fontWeight: 700, fontSize: '0.95rem', lineHeight: 1 }
        }, stats.topType),
        React.createElement('div', {
          style: { color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }
        }, 'Most Posted Type')
      )
    ),

    // Divider
    React.createElement('div', {
      style: { width: '1px', height: '36px', background: 'rgba(255,255,255,0.1)' }
    }),

    // Job type badges
    React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px', flex: 1 } },
      Object.keys(stats.types).length === 0
        ? React.createElement('span', {
            style: { color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }
          }, 'No jobs posted yet')
        : Object.entries(stats.types).map(([type, count]) =>
            React.createElement('span', {
              key: type,
              className: `badge bg-${typeColors[type] || 'secondary'}`,
              style: { fontSize: '0.8rem', padding: '5px 10px' }
            }, `${type}: ${count}`)
          )
    )
  );
}

const jobStatsRoot = document.getElementById('job-stats-root');
if (jobStatsRoot) {
  ReactDOM.createRoot(jobStatsRoot).render(React.createElement(JobStats));
}