/*
  MatchSummary.js — React Component
  Shows a summary banner after job matching runs
*/

const { useState: useState, useEffect: useEffect } = React;

function MatchSummary() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    // Listen for custom event fired by matchCandidates()
    function handleMatchDone(e) {
      setSummary(e.detail);
    }
    window.addEventListener('matchDone', handleMatchDone);
    return () => window.removeEventListener('matchDone', handleMatchDone);
  }, []);

  if (!summary) return null;

  const avgScore = summary.total > 0
    ? Math.round(summary.scores.reduce((a, b) => a + b, 0) / summary.scores.length)
    : 0;

  const scoreColor = avgScore >= 70 ? '#198754' : avgScore >= 40 ? '#ffc107' : '#dc3545';

  return React.createElement('div', {
    style: {
      background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)',
      borderRadius: '12px',
      padding: '20px 24px',
      marginBottom: '16px',
      display: 'flex',
      flexWrap: 'wrap',
      gap: '24px',
      alignItems: 'center'
    }
  },
    // Total matches
    React.createElement('div', { style: { textAlign: 'center' } },
      React.createElement('div', {
        style: { color: '#fff', fontWeight: 700, fontSize: '2rem', lineHeight: 1 }
      }, summary.total),
      React.createElement('div', {
        style: { color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginTop: '4px' }
      }, 'Candidates Matched')
    ),

    React.createElement('div', {
      style: { width: '1px', height: '50px', background: 'rgba(255,255,255,0.2)' }
    }),

    // Average score
    React.createElement('div', { style: { textAlign: 'center' } },
      React.createElement('div', {
        style: {
          color: '#fff',
          fontWeight: 700,
          fontSize: '2rem',
          lineHeight: 1
        }
      }, avgScore + '%'),
      React.createElement('div', {
        style: { color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginTop: '4px' }
      }, 'Average Match Score')
    ),

    React.createElement('div', {
      style: { width: '1px', height: '50px', background: 'rgba(255,255,255,0.2)' }
    }),

    // Best candidate
    React.createElement('div', null,
      React.createElement('div', {
        style: { color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: '4px' }
      }, '🏆 Best Match'),
      React.createElement('div', {
        style: { color: '#fff', fontWeight: 700, fontSize: '1.1rem' }
      }, summary.best),
      React.createElement('div', {
        style: {
          display: 'inline-block',
          background: scoreColor,
          color: '#fff',
          borderRadius: '20px',
          padding: '2px 10px',
          fontSize: '0.78rem',
          marginTop: '4px'
        }
      }, summary.bestScore + '% match')
    )
  );
}

const matchRoot = document.getElementById('match-summary-root');
if (matchRoot) {
  ReactDOM.render(React.createElement(MatchSummary), matchRoot);
}