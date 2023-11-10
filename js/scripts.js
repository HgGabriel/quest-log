// Element Selection
const questForm = document.querySelector("#quest-form");
const questInput = document.querySelector("#quest-input");
const questList = document.querySelector("#quest-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");

// Check and initialize localStorage
if (!localStorage.getItem('quests')) {
  localStorage.setItem('quests', '[]');
}

// Function to clear the search field
const clearSearch = () => {
  searchInput.innerText = "";
}

// Function to save a new quest
const saveQuest = (text, addToLocalStorage = true) => {
  const quests = JSON.parse(localStorage.getItem('quests')) || [];

  // Check if the text already exists in the quests list
  if (quests.includes(text)) {
    window.alert("Don't add repeated quests :/");
    questInput.value = "";
    questInput.focus();
  } else {
    // Create a new quest element and add it to the list
    const quest = createQuestElement(text);
    questList.appendChild(quest);

    questInput.value = "";
    questInput.focus();

    // Add the new quest to localStorage if necessary
    if (addToLocalStorage) {
      quests.push(text);
      localStorage.setItem('quests', JSON.stringify(quests));
    }
  }
}

// Function to create a quest element
const createQuestElement = (text, id) => {
  const quest = document.createElement("div");
  quest.classList.add("quest");

  const questTitle = document.createElement("h3");
  questTitle.innerText = text;
  quest.appendChild(questTitle);

  // Create buttons to mark as done, edit, and remove the quest
  const doneBtn = createButton("complete-quest", '<i class="fa-solid fa-check"></i>', id);
  const editBtn = createButton("edit-quest", '<i class="fa-solid fa-pen"></i>', id);
  const deleteBtn = createButton("remove-quest", '<i class="fa-solid fa-xmark"></i>', id);

  quest.appendChild(doneBtn);
  quest.appendChild(editBtn);
  quest.appendChild(deleteBtn);

  return quest;
}

// Function to create a generic button
const createButton = (className, innerHTML, id) => {
  const button = document.createElement("button");
  button.classList.add(className);
  button.innerHTML = innerHTML;
  return button;
}

// Function to load quests from localStorage and display them in the list
const loadQuests = () => {
  const quests = JSON.parse(localStorage.getItem('quests')) || [];

  // Clear the list before adding the quests
  questList.innerHTML = "";

  quests.forEach((questText, index) => {
    const quest = createQuestElement(questText, index);
    questList.appendChild(quest);
  });
}

// Function to toggle between add and edit forms
const toggleForms = () => {
  editForm.classList.toggle("hide");
  questForm.classList.toggle("hide");
  questList.classList.toggle("hide");
}

// Function to update the text of a quest
const updateQuest = (text) => {
  const quests = document.querySelectorAll(".quest");
  quests.forEach((quest) => {
    const questTitle = quest.querySelector("h3");
    if (questTitle.innerText === oldValueInput) {
      questTitle.innerText = text;
    }
  });
}

// Events
questForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const inputValue = questInput.value;
  if (inputValue) {
    saveQuest(inputValue);
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");

  if (parentEl && parentEl.querySelector("h3")) {
    const questTitle = parentEl.querySelector("h3").innerText;

    // Mark as done, remove, or edit the quest, depending on the clicked button
    if (targetEl.classList.contains("complete-quest")) {
      parentEl.classList.toggle("done");
    }

    if (targetEl.classList.contains("remove-quest")) {
      parentEl.remove();
      removeQuestFromLocalStorage(questTitle);
    }

    if (targetEl.classList.contains("edit-quest")) {
      toggleForms();
      editInput.value = questTitle;
      oldValueInput = questTitle;
    }
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const editInputValue = editInput.value;
  if (editInputValue) {
    updateQuest(editInputValue);
    updateQuestInLocalStorage(oldValueInput, editInputValue);
  }
  toggleForms();
});

// Function to remove a quest from localStorage
const removeQuestFromLocalStorage = (text) => {
  const quests = JSON.parse(localStorage.getItem('quests')) || [];
  const updatedQuests = quests.filter(quest => quest !== text);
  localStorage.setItem('quests', JSON.stringify(updatedQuests));
}

// Function to update a quest in localStorage
const updateQuestInLocalStorage = (id, newText) => {
  const quests = JSON.parse(localStorage.getItem('quests')) || [];
  const updatedQuests = quests.map((quest, index) => (index === id ? newText : quest));
  localStorage.setItem('quests', JSON.stringify(updatedQuests));
}

// Load quests from localStorage
loadQuests();
