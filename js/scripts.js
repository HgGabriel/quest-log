// Seleção de elementos no DOM
const questForm = document.querySelector("#quest-form");
const questInput = document.querySelector("#quest-input");
const questList = document.querySelector("#quest-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");

// Verificação e inicialização do localStorage
if (!localStorage.getItem('quests')) {
  localStorage.setItem('quests', '[]');
}

// Função para limpar o campo de busca
const clearSearch = () => {
  searchInput.innerText = "";
}

// Função para salvar uma nova tarefa
const saveQuest = (text, addToLocalStorage = true) => {
  const quests = JSON.parse(localStorage.getItem('quests')) || [];

  // Verifica se o texto já existe na lista de tarefas
  if (quests.includes(text)) {
    window.alert("Não adicione tarefas repetidas :/");
    questInput.value = "";
    questInput.focus();
  } else {
    // Cria um novo elemento de tarefa e adiciona à lista
    const quest = createQuestElement(text);
    questList.appendChild(quest);

    questInput.value = "";
    questInput.focus();

    // Adiciona a nova tarefa ao localStorage, se necessário
    if (addToLocalStorage) {
      quests.push(text);
      localStorage.setItem('quests', JSON.stringify(quests));
    }
  }
}

// Função para criar um elemento de tarefa
const createQuestElement = (text, id) => {
  const quest = document.createElement("div");
  quest.classList.add("quest");

  const questTitle = document.createElement("h3");
  questTitle.innerText = text;
  quest.appendChild(questTitle);

  // Cria botões para marcar como concluído, editar e remover a tarefa
  const doneBtn = createButton("complete-quest", '<i class="fa-solid fa-check"></i>', id);
  const editBtn = createButton("edit-quest", '<i class="fa-solid fa-pen"></i>', id);
  const deleteBtn = createButton("remove-quest", '<i class="fa-solid fa-xmark"></i>', id);

  quest.appendChild(doneBtn);
  quest.appendChild(editBtn);
  quest.appendChild(deleteBtn);

  return quest;
}

// Função para criar um botão genérico
const createButton = (className, innerHTML, id) => {
  const button = document.createElement("button");
  button.classList.add(className);
  button.innerHTML = innerHTML;
  return button;
}

// Função para carregar tarefas do localStorage e exibi-las na lista
const loadQuests = () => {
  const quests = JSON.parse(localStorage.getItem('quests')) || [];

  // Limpa a lista antes de adicionar as tarefas
  questList.innerHTML = "";

  quests.forEach((questText, index) => {
    const quest = createQuestElement(questText, index);
    questList.appendChild(quest);
  });
}

// Função para alternar entre os formulários de adição e edição
const toggleForms = () => {
  editForm.classList.toggle("hide");
  questForm.classList.toggle("hide");
  questList.classList.toggle("hide");
}

// Função para atualizar o texto de uma tarefa
const updateQuest = (text) => {
  const quests = document.querySelectorAll(".quest");
  quests.forEach((quest) => {
    const questTitle = quest.querySelector("h3");
    if (questTitle.innerText === oldValueInput) {
      questTitle.innerText = text;
    }
  });
}

// Eventos
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

    // Marcar como concluído, remover ou editar a tarefa, dependendo do botão clicado
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

// Função para remover uma tarefa do localStorage
const removeQuestFromLocalStorage = (text) => {
  const quests = JSON.parse(localStorage.getItem('quests')) || [];
  const updatedQuests = quests.filter(quest => quest !== text);
  localStorage.setItem('quests', JSON.stringify(updatedQuests));
}

// Função para atualizar uma tarefa no localStorage
const updateQuestInLocalStorage = (id, newText) => {
  const quests = JSON.parse(localStorage.getItem('quests')) || [];
  const updatedQuests = quests.map((quest, index) => (index === id ? newText : quest));
  localStorage.setItem('quests', JSON.stringify(updatedQuests));
}

// Carrega tarefas do localStorage
loadQuests();
