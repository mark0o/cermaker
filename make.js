// Load projects from local storage
const loadProjects = () => {
  return JSON.parse(localStorage.getItem("projects")) || [];
};

// Save projects to local storage
const saveProjects = (projects) => {
  projects.forEach((project) => {
    project.totalQuestions = project.questions.filter(
      (q) => q.type !== "DEFAULT_TEXT" && q.type !== "IMAGE_UPLOAD"
    ).length; // Calculate total questions excluding DEFAULT_TEXT and IMAGE_UPLOAD

    totalPointsUndrounded = project.questions.reduce((sum, question) => {
      if (question.type === "ABCD" || question.type === "OPEN") {
        return sum + (question.points || 0);
      } else if (
        question.type === "ANO-NE" ||
        question.type === "PRIRAZOVANI"
      ) {
        const questionPoints = question.questions.reduce(
          (subSum, subQuestion) => {
            return subSum + (subQuestion.points || 0);
          },
          0
        );

        if (question.type === "PRIRAZOVANI") {
          question.totalPoints = questionPoints; // Save total points for PRIRAZOVANI
        }

        return sum + questionPoints;
      }
      return sum;
    }, 0); // Calculate total points
    project.totalPoints = Math.round(totalPointsUndrounded * 1000) / 1000; // Round to 3 decimal places
  });

  localStorage.setItem("projects", JSON.stringify(projects));

  // Update spans with totalQuestions and totalPoints for the current project
  const projectIndex = getQueryParam("projectIndex");
  if (projectIndex !== null) {
    const project = projects[projectIndex];
    if (project) {
      document.querySelector("#pocetUloh").textContent = project.totalQuestions;
      document.querySelector("#celkemBodu").textContent = project.totalPoints;
    }
  }
};

// Get query parameter by name
const getQueryParam = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

// Navigate back to the index page
const goHome = () => {
  window.open("index.html", "_self");
};

// Update the project name in local storage
const updateProjectName = (newName) => {
  const projectIndex = getQueryParam("projectIndex");
  if (projectIndex !== null) {
    let projects = loadProjects();
    projects[projectIndex] = {
      ...projects[projectIndex],
      name: newName,
    };
    saveProjects(projects); // Save updated projects
  }
};

// Add event listener to update project name on title change
const setupTitleChangeListener = () => {
  const titleElement = document.querySelector("h1[contenteditable]");
  titleElement.addEventListener("input", (event) => {
    const newName = event.target.textContent.trim();
    updateProjectName(newName);
  });
};

// Add an ABCD question
const addABCDQuestion = () => {
  const projectIndex = getQueryParam("projectIndex");
  if (projectIndex !== null) {
    let projects = loadProjects();
    const newQuestion = {
      type: "ABCD",
      question: "", // Ensure the question field is blank
      subtitle: "",
      options: Array.from({ length: 4 }, () => ({
        text: "", // Default value is now blank
        correct: false,
      })),
    };
    projects[projectIndex].questions.push(newQuestion);
    saveProjects(projects);
    displayQuestions();

    // Jump to the newly added question
    setTimeout(() => {
      const questionsContainer = document.querySelector(".questions");
      const newQuestionElement = questionsContainer.lastElementChild;
      if (newQuestionElement) {
        newQuestionElement.scrollIntoView({ block: "nearest" });
      }
    }, 0);
  }
};

// Remove the addOptionToABCDQuestion function
// const addOptionToABCDQuestion = (questionIndex) => {
//   const projectIndex = getQueryParam("projectIndex");
//   if (projectIndex !== null) {
//     let projects = loadProjects();
//     const question = projects[projectIndex].questions[questionIndex];
//     if (question.options.length < 26) {
//       const newOption = {
//         text: String.fromCharCode(65 + question.options.length),
//         correct: false,
//       };
//       question.options.push(newOption);
//       saveProjects(projects);
//       displayQuestions();
//     }
//   }
// };

// Add an ANO/NE question
const addAnoNeQuestion = () => {
  const projectIndex = getQueryParam("projectIndex");
  if (projectIndex !== null) {
    let projects = loadProjects();
    const newQuestion = {
      type: "ANO-NE",
      title: "",
      subtitle: "",
      questions: [
        { text: "", correct: null }, // Set correct to null for blank default
        { text: "", correct: null },
        { text: "", correct: null },
        { text: "", correct: null },
      ],
    };
    projects[projectIndex].questions.push(newQuestion);
    saveProjects(projects);
    displayQuestions();

    // Jump to the newly added question
    setTimeout(() => {
      const questionsContainer = document.querySelector(".questions");
      const newQuestionElement = questionsContainer.lastElementChild;
      if (newQuestionElement) {
        newQuestionElement.scrollIntoView({ block: "nearest" });
      }
    }, 0);
  }
};

// Add a new question to an ANO/NE question
const addOptionToAnoNeQuestion = (questionIndex) => {
  const projectIndex = getQueryParam("projectIndex");
  if (projectIndex !== null) {
    let projects = loadProjects();
    const question = projects[projectIndex].questions[questionIndex];
    question.questions.push({ text: "", correct: null }); // Add a new blank question
    saveProjects(projects);
    displayQuestions(); // Refresh the questions display
  }
};

// Add a Přiřazování question
const addPrirazovaniQuestion = () => {
  const projectIndex = getQueryParam("projectIndex");
  if (projectIndex !== null) {
    let projects = loadProjects();
    const newQuestion = {
      type: "PRIRAZOVANI",
      title: "",
      subtitle: "",
      questions: Array.from({ length: 4 }, (_, i) => ({
        text: "",
        option: null,
      })), // Default 4 questions
      options: Array.from({ length: 6 }, () => ({ text: "" })), // Default 6 options with blank text
    };
    projects[projectIndex].questions.push(newQuestion);
    saveProjects(projects);
    displayQuestions();

    // Jump to the newly added question
    setTimeout(() => {
      const questionsContainer = document.querySelector(".questions");
      const newQuestionElement = questionsContainer.lastElementChild;
      if (newQuestionElement) {
        newQuestionElement.scrollIntoView({ block: "nearest" });
      }
    }, 0);
  }
};

// Add a new question to a Přiřazování question
const addQuestionToPrirazovani = (questionIndex) => {
  const projectIndex = getQueryParam("projectIndex");
  if (projectIndex !== null) {
    let projects = loadProjects();
    const question = projects[projectIndex].questions[questionIndex];
    if (question.questions.length < 24) {
      // Max 24 questions
      question.questions.push({ text: "", option: null }); // Add a new blank question
      const additionalOptions =
        2 - (question.options.length - question.questions.length); // Ensure 2 more options than questions
      for (
        let i = 0;
        i < additionalOptions && question.options.length < 26;
        i++
      ) {
        // Max 26 options
        question.options.push({ text: "" }); // Add a blank option
      }
      saveProjects(projects);
      displayQuestions();
    }
  }
};

// Delete a question by index
const deleteQuestion = (questionIndex) => {
  const projectIndex = getQueryParam("projectIndex");
  if (projectIndex !== null) {
    let projects = loadProjects();
    projects[projectIndex].questions.splice(questionIndex, 1); // Remove the question
    saveProjects(projects);
    displayQuestions(); // Refresh the questions display
  }
};

// Delete an option from an ANO/NE question
const deleteOptionFromAnoNeQuestion = (questionIndex, optionIndex) => {
  const projectIndex = getQueryParam("projectIndex");
  if (projectIndex !== null) {
    let projects = loadProjects();
    const question = projects[projectIndex].questions[questionIndex];
    question.questions.splice(optionIndex, 1); // Remove the selected option
    saveProjects(projects);
    displayQuestions(); // Refresh the questions display
  }
};

// Helper function to truncate text with ellipsis
const truncateText = (text, maxLength = 20) => {
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

// Display questions in the .questions div
const displayQuestions = () => {
  const projectIndex = getQueryParam("projectIndex");
  if (projectIndex !== null) {
    const projects = loadProjects();
    const project = projects[projectIndex];
    const questionsContainer = document.querySelector(".questions");
    questionsContainer.innerHTML = ""; // Clear existing questions

    let questionNumber = 0; // Initialize question numbering

    project.questions.forEach((question, index) => {
      const questionCard = document.createElement("div");
      questionCard.className = "question-card";
      questionCard.setAttribute("data-index", index); // Add data-index attribute
      questionCard.draggable = true; // Make the question draggable
      questionCard.ondragstart = dragQuestion; // Attach drag start event

      if (
        question.type !== "DEFAULT_TEXT" &&
        question.type !== "IMAGE_UPLOAD"
      ) {
        questionNumber++; // Increment numbering only for non-DEFAULT_TEXT and non-IMAGE_UPLOAD types
        question.questionNum = questionNumber; // Save question number
      } else {
        delete question.questionNum; // Ensure IMAGE_UPLOAD and DEFAULT_TEXT types do not have questionNum
      }

      if (question.type === "ABCD") {
        question.options = question.options || []; // Ensure options is defined
        questionCard.innerHTML = `
          <h3>${questionNumber}. ABCD Otázka</h3>
          <input type="text" class="title" placeholder="Nadpis" value="${
            question.question
          }" />
          <input type="text" class="subtitle" placeholder="Podnadpis (nepovinné)" value="${
            question.subtitle
          }" />
          <input type="number" class="points-input" placeholder="Body" value="${
            question.points || ""
          }" min="0" step="1" style="width: 50px; margin-right: 10px;" />
          ${question.options
            .map(
              (option, i) => `
            <label>
              <span>${String.fromCharCode(65 + i)})</span>
              <input type="radio" name="abcd-${index}" ${
                option.correct ? "checked" : ""
              } />
              <input type="text" class="option-text" placeholder="Možnost ${
                i + 1
              }" value="${option.text}" />
            </label>
          `
            )
            .join("")}
        `; // Removed the delete option icons

        questionCard
          .querySelector(".points-input")
          .addEventListener("input", (e) => {
            question.points = parseFloat(e.target.value) || 0;
            saveProjects(projects);
          });

        // Add event listeners to save changes to the JSON
        questionCard.querySelector(".title").addEventListener("input", (e) => {
          question.question = e.target.value;
          saveProjects(projects);
        });

        questionCard
          .querySelector(".subtitle")
          .addEventListener("input", (e) => {
            question.subtitle = e.target.value;
            saveProjects(projects);
          });

        questionCard.querySelectorAll(".option-text").forEach((input, i) => {
          input.addEventListener("input", (e) => {
            question.options[i].text = e.target.value;
            saveProjects(projects);
          });
        });

        questionCard
          .querySelectorAll(`input[type="radio"][name="abcd-${index}"]`)
          .forEach((radio, i) => {
            radio.addEventListener("change", () => {
              question.options.forEach(
                (option, j) => (option.correct = j === i)
              );
              saveProjects(projects);
            });
          });
      } else if (question.type === "ANO-NE") {
        questionCard.innerHTML = `
          <h3>${questionNumber}. ANO/NE Otázka</h3>
          <input type="text" class="title" placeholder="Nadpis" value="${
            question.title
          }" />
          <input type="text" class="subtitle" placeholder="Podnadpis (nepovinné)" value="${
            question.subtitle
          }" />
          <div class="true-false-header">
            <span class="blank"></span>
            <span class="letter">A</span>
            <span class="letter">N</span>
            <span class="" style="width: calc(76px + 1em); margin-left: 10px; opacity: 0;" />
          </div>
          ${question.questions
            .map(
              (q, i) => `
            <div class="true-false-row">
              <span>${index + 1}.${i + 1}</span>
              <input type="text" class="question-text" placeholder="Zadejte otázku" value="${
                q.text
              }" />
              <input type="radio" name="ano-ne-${index}-${i}" ${
                q.correct === true ? "checked" : ""
              } />
              <input type="radio" name="ano-ne-${index}-${i}" ${
                q.correct === false ? "checked" : ""
              } />
              <input type="number" class="subquestion-points-input" placeholder="Body" value="${
                q.points || ""
              }" min="0" step="1" style="width: 50px; margin-left: 10px;" />
              <img src="src/icons/close.svg" alt="Delete option" class="delete-option-icon" data-option-index="${i}" />
            </div>
          `
            )
            .join("")}
          <button onclick="addOptionToAnoNeQuestion(${index})">Přidat otázku</button>
        `;

        questionCard
          .querySelectorAll(".subquestion-points-input")
          .forEach((input, i) => {
            input.addEventListener("input", (e) => {
              question.questions[i].points = parseFloat(e.target.value) || 0;
              saveProjects(projects);
            });
          });

        // Add event listeners for deleting options
        questionCard.querySelectorAll(".delete-option-icon").forEach((icon) => {
          icon.addEventListener("click", (e) => {
            const optionIndex = parseInt(
              e.target.getAttribute("data-option-index"),
              10
            );
            deleteOptionFromAnoNeQuestion(index, optionIndex); // Call delete function
          });
        });

        // Add event listeners to save changes to the JSON
        questionCard.querySelector(".title").addEventListener("input", (e) => {
          question.title = e.target.value;
          saveProjects(projects);
        });

        questionCard
          .querySelector(".subtitle")
          .addEventListener("input", (e) => {
            question.subtitle = e.target.value;
            saveProjects(projects);
          });

        questionCard.querySelectorAll(".question-text").forEach((input, i) => {
          input.addEventListener("input", (e) => {
            question.questions[i].text = e.target.value;
            saveProjects(projects);
          });
        });

        questionCard
          .querySelectorAll(`input[type="radio"][name^="ano-ne-${index}-"]`)
          .forEach((radio, i) => {
            radio.addEventListener("change", () => {
              const questionIndex = Math.floor(i / 2);
              question.questions[questionIndex].correct = i % 2 === 0;
              saveProjects(projects);
            });
          });
      } else if (question.type === "PRIRAZOVANI") {
        questionCard.innerHTML = `
          <h3>${questionNumber}. Přiřazování</h3>
          <input type="text" class="title" placeholder="Nadpis" value="${
            question.title
          }" />
          <input type="text" class="subtitle" placeholder="Podnadpis (nepovinné)" value="${
            question.subtitle
          }" />
          <div class="prirazovani-questions">
            ${question.questions
              .map(
                (q, i) => `
              <div class="prirazovani-row">
                <span>${index + 1}.${i + 1}</span>
                <input type="text" class="question-text" placeholder="Zadejte otázku" value="${
                  q.text
                }" />
                <select class="option-select">
                  <option hidden value="">Vyberte možnost</option>
                  ${question.options
                    .map(
                      (option, j) => `
                    <option value="${j}" ${q.option === j ? "selected" : ""}>
                      ${truncateText(option.text)}
                    </option>
                  `
                    )
                    .join("")}
                </select>
                <input type="number" class="subquestion-points-input" placeholder="Body" value="${
                  q.points || ""
                }" min="0" step="1" style="width: 50px; margin-left: 10px;" />
              </div>
            `
              )
              .join("")}
          </div>
          <div class="prirazovani-options">
            ${question.options
              .map(
                (option, i) => `
              <div class="prirazovani-option">
                <span>${String.fromCharCode(65 + i)})</span>
                <input type="text" class="option-text" placeholder="Možnost ${
                  i + 1
                }" value="${option.text}" data-option-index="${i}" />
              </div>
            `
              )
              .join("")}
          </div>
        `; // Removed the "Add Question" button and delete option icons

        questionCard
          .querySelectorAll(".subquestion-points-input")
          .forEach((input, i) => {
            input.addEventListener("input", (e) => {
              question.questions[i].points = parseFloat(e.target.value) || 0;
              saveProjects(projects);
            });
          });

        // Add event listeners to save changes to the JSON
        questionCard.querySelector(".title").addEventListener("input", (e) => {
          question.title = e.target.value;
          saveProjects(projects);
        });

        questionCard
          .querySelector(".subtitle")
          .addEventListener("input", (e) => {
            question.subtitle = e.target.value;
            saveProjects(projects);
          });

        questionCard.querySelectorAll(".question-text").forEach((input, i) => {
          input.addEventListener("input", (e) => {
            question.questions[i].text = e.target.value;
            saveProjects(projects);
          });
        });

        questionCard.querySelectorAll(".option-select").forEach((select, i) => {
          select.addEventListener("change", (e) => {
            question.questions[i].option = e.target.value
              ? parseInt(e.target.value, 10)
              : null;
            saveProjects(projects);
          });
        });

        questionCard.querySelectorAll(".option-text").forEach((input, i) => {
          input.addEventListener("input", (e) => {
            question.options[i].text = e.target.value;
            saveProjects(projects);

            // Dynamically update the dropdown options
            questionCard
              .querySelectorAll(".option-select")
              .forEach((select) => {
                const optionElement = select.querySelector(
                  `option[value="${i}"]`
                );
                if (optionElement) {
                  optionElement.textContent = truncateText(e.target.value);
                }
              });
          });
        });
      } else if (question.type === "OPEN") {
        questionCard.innerHTML = `
          <h3>${questionNumber}. Otevřená úloha</h3>
          <input type="text" class="title" placeholder="Nadpis" value="${
            question.title
          }" />
          <input type="text" class="subtitle" placeholder="Podnadpis (nepovinné)" value="${
            question.subtitle
          }" />
          <input type="number" class="points-input" placeholder="Body" value="${
            question.points || ""
          }" min="0" step="1" style="width: 50px; margin-right: 10px;" />
          <label>
            <input type="checkbox" class="toggle-textfield-size" ${
              question.isLarge ? "checked" : ""
            } />
            Velké textové pole
          </label>
          ${
            question.isLarge
              ? `<textarea class="large-textfield" rows="4">${
                  question.content || ""
                }</textarea>`
              : `<input type="text" class="small-textfield" value="${
                  question.content || ""
                }" />`
          }
        `;

        questionCard
          .querySelector(".points-input")
          .addEventListener("input", (e) => {
            question.points = parseFloat(e.target.value) || 0;
            saveProjects(projects);
          });

        // Add event listeners to save changes to the JSON
        questionCard.querySelector(".title").addEventListener("input", (e) => {
          question.title = e.target.value;
          saveProjects(projects);
        });

        questionCard
          .querySelector(".subtitle")
          .addEventListener("input", (e) => {
            question.subtitle = e.target.value;
            saveProjects(projects);
          });

        const textField = questionCard.querySelector(
          question.isLarge ? ".large-textfield" : ".small-textfield"
        );
        textField.addEventListener("input", (e) => {
          question.content = e.target.value;
          saveProjects(projects);
        });

        questionCard
          .querySelector(".toggle-textfield-size")
          .addEventListener("change", (e) => {
            question.isLarge = e.target.checked;
            saveProjects(projects);
            displayQuestions(); // Refresh the questions display
          });
      } else if (question.type === "DEFAULT_TEXT") {
        questionCard.innerHTML = `
          <select class="question-type-dropdown" style="margin-right: 10px;">
            <option value="DEFAULT_TEXT" selected>Výchozí text</option>
            <option value="IMAGE_UPLOAD">Obrázek</option>
          </select>
          <h3>Výchozí text</h3>
          <div contenteditable="true" class="rich-text" spellcheck="false" style="width: calc(100% - 1em); border: 1px solid #ccc; padding: 0.5em;">
            ${question.content || "Zde napište text..."}
          </div>
          <span style="color:#525252">Tip: Pro ztučnění textu použijte ctrl+B, pro podtržení ctrl+U</span>
          <input type="text" class="source-input" placeholder="Zdroj" value="${
            question.source
          }" style="width: calc(100% - 1em); padding: 0.5em; border: 1px solid #ccc; margin-top: 0.5em;" />
        `;

        // Add event listener for dropdown to switch question type
        questionCard
          .querySelector(".question-type-dropdown")
          .addEventListener("change", (e) => {
            const newType = e.target.value;
            if (newType === "IMAGE_UPLOAD") {
              question.type = "IMAGE_UPLOAD";
              question.imageBase64 = ""; // Initialize imageBase64 for IMAGE_UPLOAD
              delete question.content; // Remove content field
              saveProjects(projects);
              displayQuestions(); // Refresh the questions display
            }
          });

        // Add event listeners to save changes to the JSON
        questionCard
          .querySelector(".rich-text")
          .addEventListener("input", (e) => {
            question.content = e.target.innerHTML; // Save as HTML
            saveProjects(projects);
          });

        questionCard
          .querySelector(".source-input")
          .addEventListener("input", (e) => {
            question.source = e.target.value;
            saveProjects(projects);
          });
      } else if (question.type === "IMAGE_UPLOAD") {
        questionCard.innerHTML = `
          <select class="question-type-dropdown" style="margin-right: 10px;">
            <option value="DEFAULT_TEXT">Výchozí text</option>
            <option value="IMAGE_UPLOAD" selected>Obrázek</option>
          </select>
          <h3>Obrázek</h3>
          <input type="file" class="image-upload-input" accept="image/*" />
          <img src="${
            question.imageBase64 || ""
          }" alt="Uploaded Image" class="uploaded-image" style="max-width: 100%; max-height: 15cm; margin-top: 10px;" />
          <input type="text" class="source-input" placeholder="Zdroj" value="${
            question.source
          }" style="width: calc(100% - 1em); padding: 0.5em; border: 1px solid #ccc; margin-top: 0.5em;" />
        `;

        // Add event listener for dropdown to switch question type
        questionCard
          .querySelector(".question-type-dropdown")
          .addEventListener("change", (e) => {
            const newType = e.target.value;
            if (newType === "DEFAULT_TEXT") {
              question.type = "DEFAULT_TEXT";
              question.content = ""; // Initialize content for DEFAULT_TEXT
              delete question.imageBase64; // Remove imageBase64 field
              saveProjects(projects);
              displayQuestions(); // Refresh the questions display
            }
          });

        // Handle image upload and conversion to base64
        questionCard
          .querySelector(".image-upload-input")
          .addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                  question.imageBase64 = event.target.result;
                  saveProjects(projects);
                  displayQuestions(); // Refresh to display the uploaded image
                };
                img.src = event.target.result;
              };
              reader.readAsDataURL(file);
            }
          });

        // Save source input changes
        questionCard
          .querySelector(".source-input")
          .addEventListener("input", (e) => {
            question.source = e.target.value;
            saveProjects(projects);
          });
      }

      // Add delete icon to the top-right corner
      const deleteIcon = document.createElement("img");
      deleteIcon.src = "./src/icons/trashBin.svg";
      deleteIcon.alt = "Delete";
      deleteIcon.className = "deleteQuestion-icon";
      deleteIcon.onclick = (event) => {
        const questionIndex = event.target
          .closest(".question-card")
          .getAttribute("data-index");
        deleteQuestion(parseInt(questionIndex, 10)); // Use data-index to delete the correct question
      };
      questionCard.appendChild(deleteIcon);

      questionsContainer.appendChild(questionCard);
      saveProjects(projects); // Save updated projects with questionNum
    });
  }
};

// Initialize the make.html page
const initializeMakePage = () => {
  const projectIndex = getQueryParam("projectIndex");
  let projects = loadProjects();

  if (projectIndex !== null) {
    const project = projects[projectIndex];
    if (project) {
      // Recalculate and save totalQuestions and totalPoints
      project.totalQuestions = project.questions.filter(
        (q) => q.type !== "DEFAULT_TEXT"
      ).length;

      const totalPointsb4Rounding = project.questions.reduce(
        (sum, question) => {
          if (question.type === "ABCD" || question.type === "OPEN") {
            return sum + (question.points || 0);
          } else if (
            question.type === "ANO-NE" ||
            question.type === "PRIRAZOVANI"
          ) {
            return (
              sum +
              question.questions.reduce((subSum, subQuestion) => {
                return subSum + (subQuestion.points || 0);
              }, 0)
            );
          }
          return sum;
        },
        0
      );
      project.totalPoints = Math.round(totalPointsb4Rounding * 1000) / 1000;

      saveProjects(projects); // Save updated attributes

      // Update spans with totalQuestions and totalPoints
      document.querySelector("#pocetUloh").textContent = project.totalQuestions;
      document.querySelector("#celkemBodu").textContent = project.totalPoints;

      document.querySelector("h1").textContent = project.name;

      const tools = project.tools ? project.tools.split(", ") : [];
      document.querySelector("#writing-tools").checked =
        tools.includes("psací pomůcky");
      document.querySelector("#drawing-tools").checked =
        tools.includes("rýsovací pomůcky");
      document.querySelector("#calculator").checked =
        tools.includes("kalkulačka");
      document.querySelector("#book").checked = tools.includes("učebnice");
      document.querySelector("#notebook").checked = tools.includes("sešit");
      document.querySelector("#internet").checked = tools.includes("internet");
      document.querySelector("#other").checked = tools.includes("jiné");
    }
  } else {
    // Create a new project if no index is provided
    const newProject = { name: "Nový test", questions: [] };
    projects.push(newProject);
    saveProjects(projects);
    const newIndex = projects.length - 1;
    window.history.replaceState(null, "", `make.html?projectIndex=${newIndex}`);
    document.querySelector("h1").textContent = newProject.name;
  }

  setupTitleChangeListener();
  displayQuestions(); // Display questions on page load
};

// Run initialization on page load
window.onload = initializeMakePage;

// Attach goHome function to the button
document.querySelector("#create-project").onclick = goHome;

// Add an open question
const addOpenQuestion = () => {
  const projectIndex = getQueryParam("projectIndex");
  if (projectIndex !== null) {
    let projects = loadProjects();
    const newQuestion = {
      type: "OPEN",
      title: "",
      subtitle: "",
      isLarge: false, // Default to small textfield
    };
    projects[projectIndex].questions.push(newQuestion);
    saveProjects(projects);
    displayQuestions();

    // Jump to the newly added question
    setTimeout(() => {
      const questionsContainer = document.querySelector(".questions");
      const newQuestionElement = questionsContainer.lastElementChild;
      if (newQuestionElement) {
        newQuestionElement.scrollIntoView({ block: "nearest" });
      }
    }, 0);
  }
};

function addDefaultTextCard() {
  const projectIndex = getQueryParam("projectIndex");
  if (projectIndex !== null) {
    let projects = loadProjects();
    const newQuestion = {
      type: "DEFAULT_TEXT",
      content: "",
      source: "",
    };
    projects[projectIndex].questions.push(newQuestion);
    saveProjects(projects);
    displayQuestions();

    // Jump to the newly added question
    setTimeout(() => {
      const questionsContainer = document.querySelector(".questions");
      const newQuestionElement = questionsContainer.lastElementChild;
      if (newQuestionElement) {
        newQuestionElement.scrollIntoView({ block: "nearest" });
      }
    }, 0);
  }
}

// Add an Image Upload question
function addImageUploadCard() {
  const projectIndex = getQueryParam("projectIndex");
  if (projectIndex !== null) {
    let projects = loadProjects();
    const newQuestion = {
      type: "IMAGE_UPLOAD",
      imageBase64: "", // Placeholder for the base64 image data
      source: "",
    };
    projects[projectIndex].questions.push(newQuestion);
    saveProjects(projects);
    displayQuestions();

    // Jump to the newly added question
    setTimeout(() => {
      const questionsContainer = document.querySelector(".questions");
      const newQuestionElement = questionsContainer.lastElementChild;
      if (newQuestionElement) {
        newQuestionElement.scrollIntoView({ block: "nearest" });
      }
    }, 0);
  }
}

function updateTools() {
  const projectIndex = getQueryParam("projectIndex");
  if (projectIndex !== null) {
    let projects = loadProjects();
    const project = projects[projectIndex];

    const tools = [];
    if (document.querySelector("#writing-tools").checked)
      tools.push("psací pomůcky");
    if (document.querySelector("#drawing-tools").checked)
      tools.push("rýsovací pomůcky");
    if (document.querySelector("#calculator").checked) tools.push("kalkulačka");
    if (document.querySelector("#book").checked) tools.push("učebnice");
    if (document.querySelector("#notebook").checked) tools.push("sešit");
    if (document.querySelector("#internet").checked) tools.push("internet");
    if (document.querySelector("#other").checked) tools.push("jiné");

    project.tools = tools.join(", ");
    saveProjects(projects);
  }
}
