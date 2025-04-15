var ToDoList = function(name) {
  this.el = document.querySelector('[data-list="' + name + '"]');
  this.lastRemoved = [];

  this.input = document.querySelector('[data-input="' + name + '"]');
  this.undoButton = document.querySelector('[data-undo="' + name + '"]');

  this.addEntry = function(entryText) {
    var li = document.createElement('li');
    li.textContent = entryText;
    this.el.appendChild(li);
  };

  this.init = function() {
    this.removeEntry();
    this.addByInput();
    this.undoRemove();
    return this;
  };
};

ToDoList.prototype.addByArray = function(array) {
  var list = this;
  array.forEach(function(item) {
    list.addEntry(item);
  });
};

ToDoList.prototype.addByInput = function() {
  this.input.addEventListener('keyup', function(e) {
    if (e.keyCode === 13 && e.target.value.trim() !== '') {
      this.addEntry(e.target.value.trim());
      e.target.value = '';
    }
  }.bind(this));
};

ToDoList.prototype.removeEntry = function() {
  this.el.addEventListener('click', function(e) {
    if (e.target.nodeName === 'LI') {
      this.lastRemoved.push({ action: 'remove', content: e.target });
      this.el.removeChild(e.target);
    }
  }.bind(this));
};

ToDoList.prototype.undoRemove = function() {
  this.undoButton.addEventListener('click', function(e) {
    e.preventDefault();
    var lastEntry = this.lastRemoved.pop();
    if (lastEntry && lastEntry.action === 'remove') {
      this.el.appendChild(lastEntry.content);
    }
  }.bind(this));
};

// Initialize ToDo Lists
var lists = {
  work: new ToDoList('work').init(),
  private: new ToDoList('private').init()
};