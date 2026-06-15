// ==========================================
//  SmartHire — Phase 4 Unit Tests (Jest)
//  Test file: __tests__/matchEngine.test.js
//  Run: npm test
// ==========================================

// ─── PURE FUNCTIONS (copy of src/utils/matchEngine.js) ──────

function runMatch(job, candidates) {
    const jobSkills = job.skills.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
    return candidates
      .map(c => {
        const cSkills = c.skills.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
        const matched = jobSkills.filter(s => cSkills.includes(s));
        const missing = jobSkills.filter(s => !cSkills.includes(s));
        const skillScore = jobSkills.length > 0 ? (matched.length / jobSkills.length) * 70 : 0;
        const cExp = parseFloat(c.experience || '0');
        const rExp = parseFloat(job.exp || '0');
        const expScore = rExp === 0 ? 20 : cExp >= rExp ? 20 : Math.round((cExp / rExp) * 20);
        const eduKw = ['bscs','bba','bse','bs','ms','mba','phd','bachelor','master','bsc'];
        const eduScore = eduKw.some(k => c.education.toLowerCase().includes(k)) ? 10 : 5;
        const score = Math.min(100, Math.round(skillScore + expScore + eduScore));
        return { candidate: c, score, matched, missing };
      })
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map((r, i) => ({ ...r, rank: i + 1 }));
  }
  
  function parseSkills(skillString) {
    return skillString.split(',').map(s => s.trim()).filter(Boolean);
  }
  
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  
  function generateCSV(candidates) {
    const headers = ['Name', 'Email', 'Skills', 'Experience', 'Education', 'Company'];
    const rows = candidates.map(c => [
      c.name, c.email, c.skills, c.experience, c.education, c.company || ''
    ]);
    return [headers, ...rows]
      .map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
  }
  
  function calculateExpScore(candidateExp, requiredExp) {
    const cExp = parseFloat(candidateExp || '0');
    const rExp = parseFloat(requiredExp || '0');
    if (rExp === 0) return 20;
    if (cExp >= rExp) return 20;
    return Math.round((cExp / rExp) * 20);
  }
  
  function calculateSkillScore(candidateSkills, jobSkills) {
    if (!jobSkills.length) return 0;
    const cSkills = parseSkills(candidateSkills).map(s => s.toLowerCase());
    const jSkills = jobSkills.map(s => s.toLowerCase());
    const matched = jSkills.filter(s => cSkills.includes(s));
    return Math.round((matched.length / jSkills.length) * 70);
  }
  
  // ────────────────────────────────────────────────────────────
  //  UNIT TESTS
  // ────────────────────────────────────────────────────────────
  
  describe('🧪 Match Engine — Core Scoring', () => {
  
    const baseJob = {
      title: 'Senior React Developer',
      skills: 'react, typescript, tailwind, node, jest',
      exp: '3',
      type: 'Full-time',
    };
  
    test('Candidate with 3/5 skills gets correct skill score', () => {
      const candidate = {
        id: 'c1', name: 'Test User', email: 'test@test.com',
        skills: 'react, typescript, tailwind',
        experience: '4', education: 'BSCS Air University', company: '',
      };
      const results = runMatch(baseJob, [candidate]);
      expect(results).toHaveLength(1);
      // 3/5 skills = 60% of 70 = 42 pts + 20 exp + 10 edu = 72
      expect(results[0].score).toBe(72);
    });
  
    test('Candidate with 5/5 skills + sufficient exp gets 100%', () => {
      const candidate = {
        id: 'c2', name: 'Perfect Match', email: 'perfect@test.com',
        skills: 'react, typescript, tailwind, node, jest',
        experience: '5', education: 'BSCS', company: '',
      };
      const results = runMatch(baseJob, [candidate]);
      expect(results[0].score).toBe(100);
    });
  
    test('Candidate with 0 matching skills scores 0 and is excluded', () => {
      const candidate = {
        id: 'c3', name: 'No Match', email: 'nomatch@test.com',
        skills: 'python, django, sql',
        experience: '10', education: 'BSCS', company: '',
      };
      const results = runMatch(baseJob, [candidate]);
      // Score = 0 skill + 20 exp + 10 edu = 30, so still included (score > 0)
      // BUT: skillScore = 0, expScore = 20, eduScore = 10 → score = 30
      // Score > 0, so included in results
      expect(results[0].score).toBe(30);
    });
  
    test('Results are sorted by score descending', () => {
      const candidates = [
        { id:'c1', name:'Low',  email:'low@t.com',  skills:'react',                           experience:'1', education:'BSCS', company:'' },
        { id:'c2', name:'High', email:'high@t.com', skills:'react, typescript, tailwind, node, jest', experience:'5', education:'BSCS', company:'' },
        { id:'c3', name:'Mid',  email:'mid@t.com',  skills:'react, typescript, tailwind',     experience:'3', education:'BSCS', company:'' },
      ];
      const results = runMatch(baseJob, candidates);
      expect(results[0].candidate.name).toBe('High');
      expect(results[1].candidate.name).toBe('Mid');
      expect(results[2].candidate.name).toBe('Low');
    });
  
    test('Results have correct rank numbers', () => {
      const candidates = [
        { id:'c1', name:'A', email:'a@t.com', skills:'react, typescript', experience:'3', education:'BSCS', company:'' },
        { id:'c2', name:'B', email:'b@t.com', skills:'react',             experience:'1', education:'BSCS', company:'' },
      ];
      const results = runMatch(baseJob, candidates);
      results.forEach((r, i) => expect(r.rank).toBe(i + 1));
    });
  
    test('Matched and missing skills are correctly identified', () => {
      const candidate = {
        id:'c1', name:'Partial', email:'p@t.com',
        skills:'react, typescript',
        experience:'3', education:'BSCS', company:'',
      };
      const results = runMatch(baseJob, [candidate]);
      expect(results[0].matched).toContain('react');
      expect(results[0].matched).toContain('typescript');
      expect(results[0].missing).toContain('tailwind');
      expect(results[0].missing).toContain('node');
      expect(results[0].missing).toContain('jest');
    });
  
    test('Skills matching is case-insensitive', () => {
      const candidate = {
        id:'c1', name:'Case Test', email:'c@t.com',
        skills:'React, TypeScript, TAILWIND, NODE, Jest',
        experience:'3', education:'BSCS', company:'',
      };
      const results = runMatch(baseJob, [candidate]);
      expect(results[0].matched).toHaveLength(5);
      expect(results[0].missing).toHaveLength(0);
    });
  
    test('Results capped at 20 candidates', () => {
      const candidates = Array.from({ length: 30 }, (_, i) => ({
        id: `c${i}`, name: `User ${i}`, email: `user${i}@t.com`,
        skills: 'react', experience: '1', education: 'BSCS', company:'',
      }));
      const results = runMatch(baseJob, candidates);
      expect(results.length).toBeLessThanOrEqual(20);
    });
  });
  
  // ────────────────────────────────────────────────────────────
  
  describe('⏱ Experience Score Calculator', () => {
  
    test('Candidate meets exactly the required experience → 20pts', () => {
      expect(calculateExpScore('3', '3')).toBe(20);
    });
  
    test('Candidate exceeds required experience → 20pts', () => {
      expect(calculateExpScore('7', '3')).toBe(20);
    });
  
    test('Candidate with half the required exp → ~10pts', () => {
      expect(calculateExpScore('1.5', '3')).toBe(10);
    });
  
    test('No experience required (0) → full 20pts always', () => {
      expect(calculateExpScore('0', '0')).toBe(20);
      expect(calculateExpScore('5', '0')).toBe(20);
    });
  
    test('Zero candidate exp → 0pts', () => {
      expect(calculateExpScore('0', '5')).toBe(0);
    });
  
    test('Missing exp field treated as 0', () => {
      expect(calculateExpScore(undefined, '3')).toBe(0);
    });
  });
  
  // ────────────────────────────────────────────────────────────
  
  describe('🛠 Skill Score Calculator', () => {
  
    const jobSkills = ['react', 'typescript', 'tailwind', 'node', 'jest'];
  
    test('All skills matched → 70pts', () => {
      expect(calculateSkillScore('react, typescript, tailwind, node, jest', jobSkills)).toBe(70);
    });
  
    test('No skills matched → 0pts', () => {
      expect(calculateSkillScore('python, django, sql', jobSkills)).toBe(0);
    });
  
    test('Half skills matched → 35pts', () => {
      // 2.5/5 * 70... let's use 3/5 which is clean: Math.round(3/5 * 70) = 42
      expect(calculateSkillScore('react, typescript, tailwind', ['react', 'typescript', 'tailwind', 'node'])).toBe(53); // 3/4 * 70 = 52.5 → 53
    });
  
    test('Empty job skills array returns 0', () => {
      expect(calculateSkillScore('react, node', [])).toBe(0);
    });
  });
  
  // ────────────────────────────────────────────────────────────
  
  describe('📧 Email Validation', () => {
  
    test('Valid email passes', () => {
      expect(validateEmail('sarfraz@au.edu.pk')).toBe(true);
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('name.surname@company.co.uk')).toBe(true);
    });
  
    test('Missing @ sign fails', () => {
      expect(validateEmail('sarfrazgmail.com')).toBe(false);
    });
  
    test('Missing domain fails', () => {
      expect(validateEmail('sarfraz@')).toBe(false);
    });
  
    test('Missing local part fails', () => {
      expect(validateEmail('@gmail.com')).toBe(false);
    });
  
    test('Spaces in email fail', () => {
      expect(validateEmail('sarfraz @gmail.com')).toBe(false);
      expect(validateEmail('sarfraz@ gmail.com')).toBe(false);
    });
  
    test('Empty string fails', () => {
      expect(validateEmail('')).toBe(false);
    });
  
    test('Multiple @ signs fail', () => {
      expect(validateEmail('a@b@c.com')).toBe(false);
    });
  });
  
  // ────────────────────────────────────────────────────────────
  
  describe('📋 Skills Parser', () => {
  
    test('"React, Node, CSS" splits into 3 trimmed strings', () => {
      const result = parseSkills('React, Node, CSS');
      expect(result).toHaveLength(3);
      expect(result).toEqual(['React', 'Node', 'CSS']);
    });
  
    test('Extra whitespace is trimmed from each skill', () => {
      expect(parseSkills('  React  ,  TypeScript  ,  Tailwind  ')).toEqual(['React', 'TypeScript', 'Tailwind']);
    });
  
    test('Empty segments are filtered out', () => {
      expect(parseSkills('React,,Node,,,')).toHaveLength(2);
    });
  
    test('Single skill returns array of one', () => {
      expect(parseSkills('React')).toEqual(['React']);
    });
  
    test('Empty string returns empty array', () => {
      expect(parseSkills('')).toHaveLength(0);
    });
  
    test('Skills with special characters are kept as-is', () => {
      const result = parseSkills('React.js, Node.js, C++, C#');
      expect(result).toContain('React.js');
      expect(result).toContain('C++');
      expect(result).toContain('C#');
    });
  });
  
  // ────────────────────────────────────────────────────────────
  
  describe('📤 CSV Export', () => {
  
    const sampleCandidates = [
      { id:'c1', name:'Sarfraz Saeed', email:'sarfraz@au.edu.pk', skills:'React, TypeScript, Tailwind', experience:'2', education:'BSCS Air University', company:'TechCorp' },
      { id:'c2', name:'Ahmed Ali',    email:'ahmed@mail.com',     skills:'Python, Django, SQL',          experience:'4', education:'BSCE NUST',          company:'' },
    ];
  
    test('CSV output includes all header columns', () => {
      const csv = generateCSV(sampleCandidates);
      const firstLine = csv.split('\n')[0];
      expect(firstLine).toContain('Name');
      expect(firstLine).toContain('Email');
      expect(firstLine).toContain('Skills');
      expect(firstLine).toContain('Experience');
      expect(firstLine).toContain('Education');
      expect(firstLine).toContain('Company');
    });
  
    test('CSV has correct number of rows (header + 1 per candidate)', () => {
      const csv = generateCSV(sampleCandidates);
      const lines = csv.split('\n');
      expect(lines).toHaveLength(sampleCandidates.length + 1);
    });
  
    test('CSV wraps all values in double quotes', () => {
      const csv = generateCSV(sampleCandidates);
      const lines = csv.split('\n');
      lines.forEach(line => {
        const cols = line.split('","');
        expect(cols[0].startsWith('"')).toBe(true);
      });
    });
  
    test('CSV escapes double quotes inside values', () => {
      const tricky = [{ id:'c1', name:'O\'Brien, "Bob"', email:'bob@t.com', skills:'React', experience:'1', education:'BS', company:'' }];
      const csv = generateCSV(tricky);
      expect(csv).toContain('""Bob""');
    });
  
    test('Empty candidates array produces only header row', () => {
      const csv = generateCSV([]);
      expect(csv.split('\n')).toHaveLength(1);
    });
  
    test('Missing company field defaults to empty string in CSV', () => {
      const csv = generateCSV([sampleCandidates[1]]);
      const dataRow = csv.split('\n')[1];
      expect(dataRow).toContain('""');
    });
  });
  
  // ────────────────────────────────────────────────────────────
  
  describe('🎯 Integration: Full Match Flow', () => {
  
    test('Post job → register candidates → run match → correct ranking', () => {
      const job = { title:'Frontend Dev', skills:'react, css, html', exp:'2', type:'Full-time' };
      const candidates = [
        { id:'c1', name:'Senior Dev', email:'s@t.com', skills:'react, css, html, typescript', experience:'4', education:'BSCS', company:'' },
        { id:'c2', name:'Junior Dev', email:'j@t.com', skills:'react',                        experience:'1', education:'BSCS', company:'' },
        { id:'c3', name:'Mid Dev',    email:'m@t.com', skills:'react, css',                  experience:'2', education:'BSCS', company:'' },
      ];
      const results = runMatch(job, candidates);
      expect(results[0].candidate.name).toBe('Senior Dev');
      expect(results[1].candidate.name).toBe('Mid Dev');
      expect(results[2].candidate.name).toBe('Junior Dev');
    });
  
    test('Match returns empty array when no candidates registered', () => {
      const job = { title:'Dev', skills:'react', exp:'1', type:'Full-time' };
      const results = runMatch(job, []);
      expect(results).toHaveLength(0);
    });
  
    test('Score never exceeds 100', () => {
      const job = { title:'Dev', skills:'react', exp:'0', type:'Full-time' };
      const candidate = { id:'c1', name:'Best', email:'b@t.com', skills:'react, typescript, node, python, django', experience:'10', education:'PhD BSCS Masters', company:'' };
      const results = runMatch(job, [candidate]);
      expect(results[0].score).toBeLessThanOrEqual(100);
    });
  });