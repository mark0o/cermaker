// Load projects from local storage or initialize with an empty array
const loadProjects = () => {
  const projects = JSON.parse(localStorage.getItem("projects")) || [];
  return projects;
};

// Format date and time as dd.mm.yyyy hh:mm
const formatDateTime = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

// Save projects to local storage
const saveProjects = (projects) => {
  localStorage.setItem("projects", JSON.stringify(projects));
};

// Delete a project by index
const deleteProject = (index) => {
  const confirmation = confirm(
    "Jste si naprosto jisti, že chcete test smazat? Po smazání už nebude možno ho obnovit."
  );
  if (confirmation) {
    let projects = loadProjects();
    projects.splice(index, 1);
    saveProjects(projects);
    displayProjects(); // Refresh the project list
  }
};

// Display projects in the "projects-list" section
const displayProjects = () => {
  const projects = loadProjects();
  const projectsList = document.getElementById("projects-list");
  projectsList.innerHTML = ""; // Clear existing content

  projects.forEach((project, index) => {
    const projectCard = document.createElement("div");
    projectCard.className = "project-card";
    projectCard.onclick = () => {
      window.open(`make.html?projectIndex=${index}`, "_self");
    };

    const projectDetails = document.createElement("div");
    projectDetails.className = "project-details";

    const projectName = document.createElement("h2");
    projectName.textContent = project.name;
    projectName.className = "project-name";

    const deleteIcon = document.createElement("img");
    deleteIcon.src = "src/icons/trashBin.svg"; // Corrected path for the delete icon
    deleteIcon.alt = "Delete";
    deleteIcon.className = "delete-icon";
    deleteIcon.onclick = (event) => {
      event.stopPropagation(); // Prevent triggering the card click
      deleteProject(index);
    };

    projectDetails.appendChild(projectName);
    projectCard.appendChild(projectDetails);
    projectCard.appendChild(deleteIcon);
    projectsList.appendChild(projectCard);
  });
};

// Initialize the page
const initializePage = () => {
  let projects = loadProjects();

  // If no projects exist, create a new one
  if (projects.length === 0) {
    const newProject = { name: "Nový test", questions: [] };
    projects.push(newProject);
    saveProjects(projects);
  }

  displayProjects();
};

// Run initialization on page load
window.onload = initializePage;
