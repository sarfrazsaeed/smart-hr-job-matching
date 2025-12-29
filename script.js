// ================== CANDIDATE REGISTRATION ==================
document.getElementById("candidateForm")?.addEventListener("submit", function(e) {
    e.preventDefault();

    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let skills = document.getElementById("skills").value.trim();
    let education = document.getElementById("education").value.trim();
    let experience = document.getElementById("experience").value.trim();

    if(name === "" || email === "" || skills === "" || education === "" || experience === "") {
        alert("Please fill all fields!");
        return;
    }

    let candidate = { name, email, skills, education, experience };
    
    let candidates = JSON.parse(localStorage.getItem("candidates")) || [];
    
    // prevent duplicate email
    if (candidates.some(c => c.email.toLowerCase() === email.toLowerCase())) {
        alert("This candidate is already registered!");
        return;
    }

    candidates.push(candidate);
    localStorage.setItem("candidates", JSON.stringify(candidates));

    document.getElementById("message").innerHTML =
        `<div class="alert alert-success">
            Candidate <strong>${name}</strong> registered successfully!
        </div>`;

    document.getElementById("candidateForm").reset();
});


// ================== HR JOB POSTING ==================
document.addEventListener("DOMContentLoaded", function () {

    removeDuplicateCandidates();

    const jobForm = document.getElementById("jobForm");

    if (jobForm) {
        displayJobs();

        jobForm.addEventListener("submit", function(e) {
            e.preventDefault();

            let title = document.getElementById("jobTitle").value.trim();
            let skills = document.getElementById("jobSkills").value.trim();
            let exp = document.getElementById("jobExperience").value.trim();
            let type = document.getElementById("jobType").value.trim();

            if(title === "" || skills === "" || exp === "" || type === "") {
                alert("Please fill all fields!");
                return;
            }

            let job = { title, skills, exp, type };

            let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
            jobs.push(job);
            localStorage.setItem("jobs", JSON.stringify(jobs));

            document.getElementById("jobMessage").innerHTML =
                `<div class="alert alert-success mt-3">
                    Job <strong>${title}</strong> posted successfully!
                </div>`;

            jobForm.reset();
            displayJobs();
        });
    }
});


// ================== DISPLAY JOBS ==================
function displayJobs() {
    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    let table = document.getElementById("jobTable");
    if(!table) return;

    table.innerHTML = "";

    jobs.forEach((j, index) => {
        table.innerHTML += `
            <tr>
                <td>${j.title}</td>
                <td>${j.skills}</td>
                <td>${j.exp} Years</td>
                <td>${j.type}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteJob(${index})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });
}


// ================== DELETE SINGLE JOB ==================
function deleteJob(index) {
    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    jobs.splice(index, 1);
    localStorage.setItem("jobs", JSON.stringify(jobs));
    displayJobs();
}


// ================== CLEAR ALL JOBS ==================
function clearAllJobs() {
    if(confirm("Are you sure you want to delete ALL jobs?")) {
        localStorage.removeItem("jobs");
        displayJobs();
        document.getElementById("jobMessage").innerHTML =
        `<div class="alert alert-success mt-3">
            All Jobs Deleted!
        </div>`;
    }
}


// ================== MATCH CANDIDATES ==================
function matchCandidates() {
    let candidates = JSON.parse(localStorage.getItem("candidates")) || [];
    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

    let resultDiv = document.getElementById("result");

    if(jobs.length === 0 || candidates.length === 0) {
        resultDiv.innerHTML = `<div class='alert alert-danger'>
            Add jobs and candidates first!
        </div>`;
        return;
    }

    let job = jobs[jobs.length - 1];
    let jobSkills = job.skills.toLowerCase().split(",").map(s => s.trim());

    let matched = candidates.filter(c => {
        let cSkills = c.skills.toLowerCase().split(",").map(s => s.trim());
        return jobSkills.some(skill => cSkills.includes(skill));
    });

    matched = matched.filter((c, index, self) =>
        index === self.findIndex(x => x.email === c.email)
    );

    if(matched.length === 0) {
        resultDiv.innerHTML = `<div class="alert alert-warning">
            No Matching Candidates Found
        </div>`;
        return;
    }

    let html = `
        <h4>Job: ${job.title}</h4>
        <table class="table table-bordered">
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Skills</th>
                <th>Experience</th>
            </tr>
    `;

    matched.forEach(m => {
        html += `
            <tr>
                <td>${m.name}</td>
                <td>${m.email}</td>
                <td>${m.skills}</td>
                <td>${m.experience} Years</td>
            </tr>
        `;
    });

    html += "</table>";
    resultDiv.innerHTML = html;
}


// ================== REMOVE DUPLICATE CANDIDATES ==================
function removeDuplicateCandidates() {
    let candidates = JSON.parse(localStorage.getItem("candidates")) || [];

    let unique = [];
    let emails = new Set();

    candidates.forEach(c => {
        if (!emails.has(c.email.toLowerCase())) {
            emails.add(c.email.toLowerCase());
            unique.push(c);
        }
    });

    localStorage.setItem("candidates", JSON.stringify(unique));
}


// ================== VIEW ALL CANDIDATES ==================
function showCandidates() {
    let candidates = JSON.parse(localStorage.getItem("candidates")) || [];
    let div = document.getElementById("candidateList");

    if (candidates.length === 0) {
        div.innerHTML = `<div class="alert alert-warning">
            No candidates registered yet!
        </div>`;
        return;
    }

    let html = `
        <h4>All Registered Candidates</h4>
        <table class="table table-bordered">
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Skills</th>
                <th>Education</th>
                <th>Experience</th>
                <th>Action</th>
            </tr>
    `;

    candidates.forEach((c, index) => {
        html += `
            <tr>
                <td>${c.name}</td>
                <td>${c.email}</td>
                <td>${c.skills}</td>
                <td>${c.education}</td>
                <td>${c.experience} Years</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteCandidate(${index})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
    });

    html += "</table>";
    div.innerHTML = html;
}


// ================== DELETE SINGLE CANDIDATE ==================
function deleteCandidate(index) {
    let candidates = JSON.parse(localStorage.getItem("candidates")) || [];
    candidates.splice(index, 1);
    localStorage.setItem("candidates", JSON.stringify(candidates));
    showCandidates();
}


// ================== CLEAR ALL CANDIDATES ==================
function clearAllCandidates() {
    if (confirm("Are you sure you want to delete ALL candidates?")) {
        localStorage.removeItem("candidates");
        document.getElementById("candidateList").innerHTML =
            `<div class="alert alert-success">
                All candidates deleted!
            </div>`;
    }
}
