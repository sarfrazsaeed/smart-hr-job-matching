/*
  SkillsPreview.js — React Component
  Shows live skill badges as candidate types in the skills field
 
*/

const { useState, useEffect } = React;
function SkillsPreview() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const skillsInput = document.getElementById('skills');
    if (!skillsInput) return;

    function handleInput() {
      const raw = skillsInput.value;
      const parsed = raw
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);
      setSkills(parsed);
    }

    skillsInput.addEventListener('input', handleInput);
    return () => skillsInput.removeEventListener('input', handleInput);
  }, []);

  if (skills.length === 0) return null;

  const colors = [
    'primary', 'success', 'info', 'warning',
    'danger', 'secondary', 'dark'
  ];

  return React.createElement('div', {
    style: {
      marginTop: '10px',
      padding: '10px 12px',
      background: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #dee2e6'
    }
  },
    React.createElement('small', {
      style: { color: '#6c757d', fontWeight: 600, display: 'block', marginBottom: '8px' }
    }, 'Skills Preview:'),
    React.createElement('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px' } },
      skills.map((skill, i) =>
        React.createElement('span', {
          key: i,
          className: `badge bg-${colors[i % colors.length]}`,
          style: { fontSize: '0.8rem', padding: '5px 10px' }
        }, skill)
      )
    )
  );
}

const skillsRoot = document.getElementById('skills-preview-root');
if (skillsRoot) {
  ReactDOM.createRoot(skillsRoot).render(React.createElement(SkillsPreview));
}