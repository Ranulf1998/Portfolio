const { skills } = portfolioData;

const GITHUB_USERNAME = "Ranulf1998";
const selectedProjects = [
  "DEVCONSUI_MoveCodeCamp2026_Level1_Bahian",
  "Tough-Athletics-Gym",
  "RESQMESH-ADMIN",
  "Student-Management-CRUD-Laravel",
  "library-management",
  "Web-System"
];

const projectDisplayNames = {
  DEVCONSUI_MoveCodeCamp2026_Level1_Bahian: "SUI CODE CAMP 2026 Level 1",
  "Tough-Athletics-Gym": "Tough Athletics Gym Attendance Monitoring System",
  "RESQMESH-ADMIN": "ResQMesh Admin Dashboard(Capstone Project)",
  "Student-Management-CRUD-Laravel": "Student Management System CRUD Laravel",
  "library-management": "Library Management System",
  "Web-System": "Coffee Shop SaaS"
};

const projectImageMap = {
  DEVCONSUI_MoveCodeCamp2026_Level1_Bahian: "assets/images/project-1.jpg",
  "Tough-Athletics-Gym": "assets/images/project-2.jpg",
  "RESQMESH-ADMIN": "assets/images/project-3.jpg",
  "Student-Management-CRUD-Laravel": "assets/images/project-4.jpg",
  "library-management": "assets/images/project-5.jpg",
  "Web-System": "assets/images/project-6.jpg"
};

const fallbackProjects = selectedProjects.map((projectName) => ({
  title: projectDisplayNames[projectName] || projectName,
  description: "A project focused on clean design, usability, and practical functionality.",
  tags: ["GitHub", "Web"],
  url: `https://github.com/${GITHUB_USERNAME}/${projectName}`,
  shortLabel: projectName,
  image: projectImageMap[projectName] || "assets/images/project-default.jpg"
}));

const skillsList = document.getElementById("skills-list");
const projectsList = document.getElementById("projects-list");
const yearEl = document.getElementById("year");

function renderSkills() {
  if (!skillsList) return;

  skillsList.innerHTML = skills
    .map(
      (skill) => `
        <div class="skill-badge">${skill}</div>
      `
    )
    .join("");
}

function normalizeGitHubProject(repo, index) {
  const repoName = repo.name || selectedProjects[index] || `Project ${index + 1}`;

  return {
    title: projectDisplayNames[repoName] || repoName,
    description:
      repo.description ||
      "A project focused on clean design, usability, and practical functionality.",
    tags: [...new Set([repo.language, ...(repo.topics || [])].filter(Boolean))].slice(0, 3),
    url: repo.html_url || `https://github.com/${GITHUB_USERNAME}/${repo.name}`,
    shortLabel: repoName,
    image: projectImageMap[repoName] || "assets/images/project-default.jpg"
  };
}

function renderProjects(projectsToRender = fallbackProjects) {
  if (!projectsList) return;

  projectsList.innerHTML = projectsToRender
    .map(
      (project, index) => `
        <article class="project-card">
          <div class="project-thumb">
            <img
              src="${project.image || "assets/images/project-default.jpg"}"
              alt="${project.title || selectedProjects[index] || `Project ${index + 1}` }"
              class="project-thumb-image"
              onerror="this.style.display='none'; this.parentElement.style.background='linear-gradient(135deg, rgba(124, 58, 237, 0.28), rgba(56, 189, 248, 0.28))'; this.parentElement.innerHTML += '<span class=\'project-thumb-fallback\'>${(project.shortLabel || selectedProjects[index] || `Project ${index + 1}`).replace(/'/g, "\\'")}</span>';"
            />
          </div>
          <div class="project-body">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-tags">
              ${(project.tags || []).slice(0, 3).map((tag) => `<span>${tag}</span>`).join("")}
            </div>
            ${project.url ? `<a class="project-link" href="${project.url}" target="_blank" rel="noreferrer">View project</a>` : ""}
          </div>
        </article>
      `
    )
    .join("");
}

async function loadGitHubProjects() {
  try {
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`
    );

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const repos = await response.json();
    const repoMap = new Map(
      repos
        .filter((repo) => !repo.fork)
        .map((repo) => [repo.name, repo])
    );

    const orderedProjects = selectedProjects
      .map((projectName) => repoMap.get(projectName))
      .filter(Boolean)
      .map((repo, index) => normalizeGitHubProject(repo, index));

    if (orderedProjects.length === selectedProjects.length) {
      renderProjects(orderedProjects.slice(0, 6));
      return;
    }

    renderProjects(
      selectedProjects
        .map((name, index) => {
          const repo = repoMap.get(name);
          return repo ? normalizeGitHubProject(repo, index) : fallbackProjects[index];
        })
        .filter(Boolean)
        .slice(0, 6)
    );
  } catch (error) {
    console.warn("Could not load GitHub projects:", error);
    renderProjects(fallbackProjects);
  }
}

function setCurrentYear() {
  if (!yearEl) return;
  yearEl.textContent = new Date().getFullYear();
}

document.addEventListener("DOMContentLoaded", () => {
  renderSkills();
  loadGitHubProjects();
  setCurrentYear();
});
