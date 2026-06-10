const { useState, useEffect } = React;

function DashboardWidget() {
  const [stats, setStats] = useState({ candidates: 0, jobs: 0, skills: 0 });

  useEffect(() => {
    const candidates = JSON.parse(localStorage.getItem('candidates')) || [];
    const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
    const allSkills = candidates.flatMap(c =>
      c.skills.toLowerCase().split(',').map(s => s.trim()).filter(Boolean)
    );
    setStats({
      candidates: candidates.length,
      jobs: jobs.length,
      skills: new Set(allSkills).size
    });
  }, []);

  return React.createElement('div', {
    className: 'alert alert-info text-center fw-semibold'
  }, `📊 ${stats.candidates} Candidates · ${stats.jobs} Jobs · ${stats.skills} Unique Skills`);
}

const widgetRoot = document.getElementById('react-summary-root');
if (widgetRoot) {
  ReactDOM.createRoot(widgetRoot).render(React.createElement(DashboardWidget));
}