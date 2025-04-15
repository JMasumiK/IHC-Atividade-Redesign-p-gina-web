class TodoList {
    constructor(listName) {
      this.listName = listName;
      this.listElement = document.querySelector(`[data-list-items="${listName}"]`);
      this.undoButton = document.querySelector(`[data-undo="${listName}"]`);
      this.form = document.querySelector(`[data-form="${listName}"]`);
      this.input = document.querySelector(`[data-input="${listName}"]`);
      this.history = [];
      
      this.init();
      this.loadFromStorage();
    }
  
    init() {
      // Delegation para itens dinâmicos
      this.listElement.addEventListener('click', (e) => this.handleItemClick(e));
      
      // Formulário
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
      
      // Botão Undo
      this.undoButton.addEventListener('click', (e) => this.handleUndo(e));
    }
  
    handleSubmit(e) {
      e.preventDefault();
      const text = this.input.value.trim();
      
      if (text) {
        this.addItem(text);
        this.input.value = '';
        this.input.focus();
      }
    }
  
    addItem(text) {
      const li = document.createElement('li');
      li.textContent = text;
      this.listElement.appendChild(li);
      this.saveToStorage();
    }
  
    handleItemClick(e) {
      const li = e.target.closest('li');
      if (li && this.listElement.contains(li)) {
        this.storeRemoved(li);
        li.remove();
        this.saveToStorage();
      }
    }
  
    storeRemoved(element) {
      this.history.push({
        element: element.cloneNode(true), // Clone para preservar o estado
        action: 'remove',
        timestamp: new Date()
      });
    }
  
    handleUndo(e) {
      e.preventDefault();
      if (this.history.length === 0) return;
  
      const lastAction = this.history.pop();
      if (lastAction.action === 'remove') {
        this.listElement.prepend(lastAction.element);
        this.saveToStorage();
      }
    }
  
    saveToStorage() {
      const items = Array.from(this.listElement.children).map(li => li.textContent);
      localStorage.setItem(`todo-${this.listName}`, JSON.stringify(items));
    }
  
    loadFromStorage() {
      try {
        const storedData = localStorage.getItem(`todo-${this.listName}`) || '[]';
        const items = JSON.parse(storedData);
        items.forEach(item => this.addItem(item));
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }
  }
  
  // Inicialização após carregamento do DOM
  document.addEventListener('DOMContentLoaded', () => {
    new TodoList('work');
    new TodoList('personal');
  });