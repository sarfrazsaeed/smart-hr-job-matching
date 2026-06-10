//  SmartHire — script.js  

let currentPage = 1;
const PAGE_SIZE = 10;

// toast helper
function showToast(msg, type = 'success') {
  const toastEl = document.getElementById('toast');
   if (!toastEl) return;
  toastEl.className = `toast align-items-center text-white border-0 bg-${type}`;
   document.getElementById('toastMsg').textContent = msg;

  const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
  toast.show();
}


// Duplicate removal (runs on every page load)

function removeDuplicateCandidates() {
   let candidates = JSON.parse(localStorage.getItem('candidates')) || [];
   const seen = new Set();
  const unique = candidates.filter(c => {
    const key = c.email.toLowerCase();
     if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  localStorage.setItem('candidates', JSON.stringify(unique));
}


//  candidate registration (index.html)

const candidateForm = document.getElementById('candidateForm');
if (candidateForm) {

  // show the live count
  removeDuplicateCandidates();
  updateCandidateCount();

  candidateForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const name       = document.getElementById('name').value.trim();
    const email      = document.getElementById('email').value.trim();

    const skills     = document.getElementById('skills').value.trim();
    const education  = document.getElementById('education').value.trim();
    const experience = document.getElementById('experience').value.trim();

     if (!name || !email || !skills || !education || !experience) {
      showToast('Please fill in all fields!', 'danger');
      return;
    }


    // simple email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Please enter a valid email address!', 'danger');
      return;
    }


    let candidates = JSON.parse(localStorage.getItem('candidates')) || [];

    if (candidates.some(c => c.email.toLowerCase() === email.toLowerCase())) {
       showToast('This email is already registered!', 'warning');

      return;
    }


    // loading state
    document.getElementById('btnText').classList.add('d-none');
    document.getElementById('btnSpinner').classList.remove('d-none');


    setTimeout(() => {

      candidates.push({ name, email, skills, education, experience });
      localStorage.setItem('candidates', JSON.stringify(candidates));


      showToast(`${name} registered successfully!`, 'success');
      candidateForm.reset();
      updateCandidateCount();

      document.getElementById('btnText').classList.remove('d-none');
      document.getElementById('btnSpinner').classList.add('d-none');
    }, 600);

  });
}


function updateCandidateCount() {

  const el = document.getElementById('candidateCount');
  if (!el) return;

  const count = (JSON.parse(localStorage.getItem('candidates')) || []).length;
  el.innerHTML = `<i class="bi bi-people me-1"></i>${count} candidate${count !== 1 ? 's' : ''} registered`;
}



//  HR PORTAL (hr.html)
document.addEventListener('DOMContentLoaded', function () {
  removeDuplicateCandidates();

  //  Job form 
  const jobForm = document.getElementById('jobForm');

  if (jobForm) {
    displayJobs();

    jobForm.addEventListener('submit', function (e) {

      e.preventDefault();

      const title  = document.getElementById('jobTitle').value.trim();
      const skills = document.getElementById('jobSkills').value.trim();
       const exp    = document.getElementById('jobExperience').value.trim();
      const type   = document.getElementById('jobType').value.trim();


      if (!title || !skills || !exp || !type) {
        showToast('Please fill in all job fields!', 'danger');
        return;
      }


      const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
      jobs.push({ title, skills, exp, type });
      localStorage.setItem('jobs', JSON.stringify(jobs));


      showToast(`Job "${title}" posted successfully!`, 'success');
      jobForm.reset();
      displayJobs();

    });
  }

  // match page: populate job selector
  const jobSelector = document.getElementById('jobSelector');
  if (jobSelector) {
    populateJobSelector();
  }

  // auto-load candidates on HR page
  if (document.getElementById('candidateList')) {
    showCandidatesPaginated();
  }

  // dashboard
  if (document.getElementById('statCandidates')) {
    loadDashboard();
    loadCharts();
  }
});



// display jobs table (hr.html) 
function displayJobs() {

  const jobs  = JSON.parse(localStorage.getItem('jobs')) || [];
   const tbody = document.getElementById('jobTable');

  if (!tbody) return;

  if (jobs.length === 0) {

    tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">
      <i class="bi bi-inbox fs-4 d-block mb-2"></i>No jobs posted yet</td></tr>`;

    return;
  }


  tbody.innerHTML = jobs.map((j, i) => `

    <tr>
      <td><strong>${j.title}</strong></td>
      <td><small class="text-muted">${j.skills}</small></td>
      <td>${j.exp} yr${j.exp != 1 ? 's' : ''}</td>
      <td><span class="badge bg-secondary">${j.type}</span></td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteJob(${i})">
          <i class="bi bi-trash"></i>
        </button>
      </td>

    </tr>

  `).join('');
}


function deleteJob(index) {
  const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
  const removed = jobs.splice(index, 1);

  localStorage.setItem('jobs', JSON.stringify(jobs));
    showToast(`Job "${removed[0].title}" deleted`, 'danger');

  displayJobs();
}

function clearAllJobs() {
  if (!confirm('Delete ALL posted jobs?')) return;
  localStorage.removeItem('jobs');
  displayJobs();
  showToast('All jobs cleared', 'danger');
}


// show all candidates table (hr.html) 




function deleteCandidate(index) {
   const candidates = JSON.parse(localStorage.getItem('candidates')) || [];
  const removed = candidates.splice(index, 1);
   localStorage.setItem('candidates', JSON.stringify(candidates));
  showToast(`${removed[0].name} removed`, 'danger');
  showCandidatesPaginated();

}

function clearAllCandidates() {
  if (!confirm('Delete ALL registered candidates?')) return;
  localStorage.removeItem('candidates');
  currentPage = 1;
  showCandidatesPaginated();
  showToast('All candidates cleared', 'danger');
}

//  MATCH PAGE (match.html)
// Populate job dropdown
function populateJobSelector() {
  const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
  const sel  = document.getElementById('jobSelector');

  if (!sel) return;

  sel.innerHTML = '<option value="">-- Select a posted job --</option>';

  if (jobs.length === 0) {

    sel.innerHTML += '<option disabled>No jobs posted yet — go to HR Portal first</option>';
    return;

  }


  jobs.forEach((j, i) => {
    sel.innerHTML += `<option value="${i}">${j.title} (${j.type} · ${j.exp} yr exp)</option>`;
  });
}

// core match function — uses selected job
function matchCandidates() {
  const candidates = JSON.parse(localStorage.getItem('candidates')) || [];
  const jobs       = JSON.parse(localStorage.getItem('jobs'))       || [];

  const resultDiv  = document.getElementById('result');


  const sel = document.getElementById('jobSelector');
  const selectedIndex = sel ? parseInt(sel.value) : NaN;


  if (jobs.length === 0) {
    resultDiv.innerHTML = `<div class="alert alert-warning">
       <i class="bi bi-exclamation-triangle me-2"></i>
       No jobs posted yet. Go to <a href="hr.html">HR Portal</a> and post a job first.</div>`;

    return;

  }


  if (isNaN(selectedIndex) || sel.value === '') {

    resultDiv.innerHTML = `<div class="alert alert-info">
      <i class="bi bi-info-circle me-2"></i>Please select a job from the dropdown above.</div>`;

    return;
  }

  if (candidates.length === 0) {

    resultDiv.innerHTML = `<div class="alert alert-warning">
      <i class="bi bi-exclamation-triangle me-2"></i>
      No candidates registered. Go to <a href="index.html">Candidate page</a> first.</div>`;

     return;
  }


  const job       = jobs[selectedIndex];
  const jobSkills = job.skills.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);


  // score each candidate

  const scored = candidates.map(c => {
    const cSkills  = c.skills.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
    const matched  = jobSkills.filter(s => cSkills.includes(s));
    const missing  = jobSkills.filter(s => !cSkills.includes(s));
    const score    = jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : 0;
    return { ...c, matched, missing, score };
  })

  .filter(c => c.score > 0)
  .sort((a, b) => b.score - a.score);


  if (scored.length === 0) {

    resultDiv.innerHTML = `<div class="alert alert-warning">
      <i class="bi bi-people me-2"></i>
      No candidates matched the required skills for <strong>${job.title}</strong>.</div>`;

    return;
  }


  const scoreClass = s => s >= 70 ? 'score-high' : s >= 40 ? 'score-mid' : 'score-low';
  const scoreIcon  = s => s >= 70 ? 'bi-check-circle-fill' : s >= 40 ? 'bi-dash-circle-fill' : 'bi-x-circle-fill';

  const printBtn = document.getElementById('printBtn');
  if (printBtn) printBtn.style.display = 'block';

  // fire event for React MatchSummary component
  window.dispatchEvent(new CustomEvent('matchDone', {
    detail: {
      total: scored.length,
      scores: scored.map(c => c.score),
      best: scored[0].name,
      bestScore: scored[0].score
    }
  }));
  resultDiv.innerHTML = `
    <div class="card shadow border-0 mb-4">
      <div class="card-header bg-primary text-white py-3">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="mb-0"><i class="bi bi-diagram-3 me-2"></i>Results for: ${job.title}</h5>

          <span class="badge bg-light text-dark fs-6">${scored.length} match${scored.length !== 1 ? 'es' : ''} found</span>
        </div>
        <small class="opacity-75">Required skills: ${jobSkills.join(', ')} · ${job.exp} yr exp · ${job.type}</small>
       </div>
      <div class="card-body p-0">
        <div class="table-responsive">

          <table class="table table-hover mb-0">
            <thead class="table-light">
              <tr>
                <th>Rank</th>
                <th>Candidate</th>
                <th>Match Score</th>
                <th>Matched Skills</th>
                <th>Missing Skills</th>
                <th>Exp.</th>
               </tr>
            </thead>
            <tbody>

              ${scored.map((c, i) => `

                <tr>
                  <td><strong>#${i + 1}</strong></td>
                  <td>
                    <div class="fw-semibold">${c.name}</div>
                    <small class="text-muted">${c.email}</small>
                  </td>

                  <td>

                    <span class="badge ${scoreClass(c.score)} fs-6 px-3 py-2">
                      <i class="bi ${scoreIcon(c.score)} me-1"></i>${c.score}%
                    </span>
                    <div class="progress mt-1" style="height:5px;width:80px">
                      <div class="progress-bar bg-${c.score >= 70 ? 'success' : c.score >= 40 ? 'warning' : 'danger'}"
                           style="width:${c.score}%"></div>
                    </div>

                  </td>

                  <td>${c.matched.map(s => `<span class="skill-tag skill-matched"><i class="bi bi-check me-1"></i>${s}</span>`).join('') || '<span class="text-muted">—</span>'}</td>
                  <td>${c.missing.map(s => `<span class="skill-tag skill-missing"><i class="bi bi-x me-1"></i>${s}</span>`).join('') || '<span class="text-success"><i class="bi bi-check-all"></i> All matched</span>'}</td>
                  <td>${c.experience} yr${c.experience != 1 ? 's' : ''}</td>
            <td><button class="btn btn-danger btn-sm" onclick="deleteCandidate(${all.indexOf(c)})"><i class="bi bi-trash"></i></button></td>
          </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>
    </div>`;
}


//  dashboard (dashboard.html)

function loadDashboard() {
  const candidates = JSON.parse(localStorage.getItem('candidates')) || [];
  const jobs  = JSON.parse(localStorage.getItem('jobs'))  || [];


  // stat numbers
  document.getElementById('statCandidates').textContent = candidates.length;
  document.getElementById('statJobs').textContent       = jobs.length;

  // average experience
  const avgExp = candidates.length > 0

    ? (candidates.reduce((sum, c) => sum + parseFloat(c.experience || 0), 0) / candidates.length).toFixed(1)
    : 0;
   document.getElementById('statAvgExp').textContent = avgExp;

  // unique skills count
  const allSkills = candidates.flatMap(c => c.skills.toLowerCase().split(',').map(s => s.trim()).filter(Boolean));
  const uniqueSkills = [...new Set(allSkills)];
  document.getElementById('statSkills').textContent = uniqueSkills.length;

  // recent candidates table
  const rcTbody = document.getElementById('recentCandidates');
  if (rcTbody) {

    if (candidates.length === 0) {
      rcTbody.innerHTML = `<tr><td colspan="3" class="text-center text-muted py-3">No candidates yet</td></tr>`;
    } else {
      rcTbody.innerHTML = candidates.slice(-5).reverse().map(c => `

        <tr>
          <td><strong>${c.name}</strong><br><small class="text-muted">${c.email}</small></td>
          <td><small>${c.skills.split(',').slice(0, 2).join(', ')}${c.skills.split(',').length > 2 ? '...' : ''}</small></td>
          <td>${c.experience} yr${c.experience != 1 ? 's' : ''}</td>
        </tr>`).join('');

    }
  }

  // recent jobs table
  const rjTbody = document.getElementById('recentJobs');

  if (rjTbody) {
    if (jobs.length === 0) {
      rjTbody.innerHTML = `<tr><td colspan="3" class="text-center text-muted py-3">No jobs yet</td></tr>`;
    } else {
      rjTbody.innerHTML = jobs.slice(-5).reverse().map(j => `
        <tr>
          <td><strong>${j.title}</strong></td>
          <td><span class="badge bg-secondary">${j.type}</span></td>
          <td>${j.exp} yr${j.exp != 1 ? 's' : ''}</td>
        </tr>`).join('');

    }
  }

  // skill distribution bars
  const skillBarsDiv = document.getElementById('skillBars');
  if (skillBarsDiv) {

    if (allSkills.length === 0) {
      skillBarsDiv.innerHTML = `<p class="text-muted text-center py-2">Register candidates to see skill distribution</p>`;
      return;

    }

    // count skill frequency
    const freq = {};

    allSkills.forEach(s => { freq[s] = (freq[s] || 0) + 1; });
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const max    = sorted[0][1];

    skillBarsDiv.innerHTML = sorted.map(([skill, count]) => {

      const pct = Math.round((count / max) * 100);
      return `
        <div class="d-flex align-items-center mb-2 gap-3">
          <div style="min-width:110px;font-size:0.85rem;font-weight:600;text-transform:capitalize">${skill}</div>
          <div class="flex-grow-1">
            <div class="progress" style="height:20px;border-radius:10px">

              <div class="progress-bar bg-primary" style="width:${pct}%;border-radius:10px">
                <span class="px-2">${count}</span>
              </div>
            </div>
          </div>
          <div style="min-width:50px;font-size:0.8rem;color:#6c757d">${count} candidate${count !== 1 ? 's' : ''}</div>
        </div>`;
    }).join('');
    
  }
}

// Dark Mode
document.addEventListener('DOMContentLoaded', function () {
  const darkToggle = document.getElementById('darkToggle');
  if (!darkToggle) return;
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkToggle.checked = true;
  }
  darkToggle.addEventListener('change', function () {
    document.body.classList.toggle('dark-mode', this.checked);
    localStorage.setItem('darkMode', String(this.checked));
  });
});

// Candidate search filter
document.addEventListener('DOMContentLoaded', function () {
  const searchBox = document.getElementById('candidateSearch');
  if (!searchBox) return;
  searchBox.addEventListener('input', function () {
    const query = this.value.toLowerCase().trim();
    if (query === '') {
      currentPage = 1;
      showCandidatesPaginated();
      return;
    }
    const all = JSON.parse(localStorage.getItem('candidates')) || [];
    const filtered = all.filter(c =>
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      c.skills.toLowerCase().includes(query)
    );
    const div = document.getElementById('candidateList');
    if (!div) return;
    if (filtered.length === 0) {
      div.innerHTML = `<div class="p-3 text-center text-muted">No candidates match your search</div>`;
      return;
    }
    div.innerHTML = `<div class="table-responsive">
      <table class="table table-hover mb-0">
        <thead class="table-light">
        <tr><th>Name</th><th>Email</th><th>Skills</th><th>Edu.</th><th>Exp.</th><th>Action</th></tr>
        </thead><tbody>
        ${filtered.map(c => `
          <tr>
            <td><strong>${c.name}</strong></td>
            <td><small>${c.email}</small></td>
            <td><small class="text-muted">${c.skills}</small></td>
            <td>${c.education}</td>
            <td>${c.experience} yr${c.experience != 1 ? 's' : ''}</td>
            <td><button class="btn btn-danger btn-sm" onclick="deleteCandidate(${all.indexOf(c)})"><i class="bi bi-trash"></i></button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div class="px-3 py-2 border-top">
      <small class="text-muted">${filtered.length} result${filtered.length !== 1 ? 's' : ''} found</small>
    </div>`;
  });
});

// export candidates as CSV
function exportCSV() {
  const candidates = JSON.parse(localStorage.getItem('candidates')) || [];
  if (candidates.length === 0) { showToast('No candidates to export!', 'warning'); return; }
  const headers = ['Name', 'Email', 'Skills', 'Education', 'Experience (yrs)'];
  const rows = candidates.map(c => [c.name, c.email, c.skills, c.education, c.experience]);
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'smarthire-candidates.csv';
  a.click();
  showToast('Candidates exported as CSV!', 'success');
}

// PAGINATION — shows 10 candidates per page in HR portal
function showCandidatesPaginated() {
  const candidates = JSON.parse(localStorage.getItem('candidates')) || [];
  const div = document.getElementById('candidateList');
  if (!div) return;

  if (candidates.length === 0) {
    div.innerHTML = `<div class="p-3 text-center text-muted">
      <i class="bi bi-person-x fs-4 d-block mb-2"></i>No candidates registered yet</div>`;
    return;
  }

  const totalPages = Math.ceil(candidates.length / PAGE_SIZE);
  if (currentPage > totalPages) currentPage = totalPages;

  const start = (currentPage - 1) * PAGE_SIZE;
  const paginated = candidates.slice(start, start + PAGE_SIZE);

  let html = `<div class="table-responsive">
    <table class="table table-hover mb-0">
      <thead class="table-light">
        <tr><th>Name</th><th>Email</th><th>Skills</th><th>Edu.</th><th>Exp.</th><th>Action</th></tr>
      </thead><tbody>`;

  html += paginated.map((c, i) => `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td><small>${c.email}</small></td>
      <td><small class="text-muted">${c.skills}</small></td>
      <td>${c.education}</td>
      <td>${c.experience} yr${c.experience != 1 ? 's' : ''}</td>
      <td>
        <button class="btn btn-danger btn-sm" onclick="deleteCandidate(${start + i})">
          <i class="bi bi-trash"></i>
        </button>
      </td>
    </tr>`).join('');

  html += `</tbody></table></div>`;

  // pagination controls
  html += `<div class="d-flex justify-content-between align-items-center px-3 py-2 border-top">
    <small class="text-muted">Showing ${start + 1}–${Math.min(start + PAGE_SIZE, candidates.length)} of ${candidates.length}</small>
    <div class="d-flex gap-2">
      <button class="btn btn-sm btn-outline-secondary" onclick="changePage(-1)" ${currentPage === 1 ? 'disabled' : ''}>
        <i class="bi bi-chevron-left"></i> Prev
      </button>
      <span class="btn btn-sm btn-primary disabled">${currentPage} / ${totalPages}</span>
      <button class="btn btn-sm btn-outline-secondary" onclick="changePage(1)" ${currentPage === totalPages ? 'disabled' : ''}>
        Next <i class="bi bi-chevron-right"></i>
      </button>
    </div>
  </div>`;

  div.innerHTML = html;
}

function changePage(direction) {
  currentPage += direction;
  showCandidatesPaginated();
}

// CHART.JS — Job type pie chart + Experience bar chart
function loadCharts() {
  const jobs = JSON.parse(localStorage.getItem('jobs')) || [];
  const candidates = JSON.parse(localStorage.getItem('candidates')) || [];

  // Job Types Pie Chart
  const jobTypeCanvas = document.getElementById('jobTypeChart');
  if (jobTypeCanvas) {
    const typeCounts = {};
    jobs.forEach(j => { typeCounts[j.type] = (typeCounts[j.type] || 0) + 1; });
    const labels = Object.keys(typeCounts);
    const data = Object.values(typeCounts);

    if (labels.length === 0) {
      jobTypeCanvas.parentElement.innerHTML = '<p class="text-muted text-center py-4">No jobs posted yet</p>';
    } else {
      new Chart(jobTypeCanvas, {
        type: 'doughnut',
        data: {
          labels,
          datasets: [{ data, backgroundColor: ['#0d6efd','#198754','#ffc107','#dc3545','#0dcaf0'] }]
        },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
      });
    }
  }

  // Experience Distribution Bar Chart
  const expCanvas = document.getElementById('expChart');
  if (expCanvas) {
    const buckets = { '0 yrs': 0, '1 yr': 0, '2 yrs': 0, '3 yrs': 0, '4+ yrs': 0 };
    candidates.forEach(c => {
      const exp = parseInt(c.experience) || 0;
      if (exp === 0) buckets['0 yrs']++;
      else if (exp === 1) buckets['1 yr']++;
      else if (exp === 2) buckets['2 yrs']++;
      else if (exp === 3) buckets['3 yrs']++;
      else buckets['4+ yrs']++;
    });

    new Chart(expCanvas, {
      type: 'bar',
      data: {
        labels: Object.keys(buckets),
        datasets: [{ label: 'Candidates', data: Object.values(buckets), backgroundColor: '#0d6efd' }]
      },
      options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
    });
  }
}