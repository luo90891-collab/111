// Todo 应用核心逻辑
class TodoApp {
  constructor() {
    this.todos = StorageManager.getTodos();
    this.currentFilter = 'all';
  }

  // 添加任务
  addTodo(text, priority = 'medium') {
    if (!text.trim()) return null;

    const todo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      priority: priority,
      createdAt: new Date().toISOString(),
      completedAt: null
    };

    this.todos.unshift(todo);
    this.save();
    return todo;
  }

  // 删除任务
  deleteTodo(id) {
    const index = this.todos.findIndex(t => t.id === id);
    if (index > -1) {
      this.todos.splice(index, 1);
      this.save();
      return true;
    }
    return false;
  }

  // 切换任务完成状态
  toggleTodo(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      todo.completedAt = todo.completed ? new Date().toISOString() : null;
      this.save();
      return true;
    }
    return false;
  }

  // 获取所有任务
  getTodos() {
    return [...this.todos];
  }

  // 获取筛选后的任务
  getFilteredTodos() {
    switch (this.currentFilter) {
      case 'active':
        return this.todos.filter(t => !t.completed);
      case 'completed':
        return this.todos.filter(t => t.completed);
      default:
        return this.todos;
    }
  }

  // 设置筛选器
  setFilter(filter) {
    this.currentFilter = filter;
  }

  // 获取统计信息
  getStats() {
    const total = this.todos.length;
    const completed = this.todos.filter(t => t.completed).length;
    const active = total - completed;
    const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

    return {
      total,
      completed,
      active,
      completionRate
    };
  }

  // 清除已完成的任务
  clearCompleted() {
    this.todos = this.todos.filter(t => !t.completed);
    this.save();
  }

  // 保存到本地存储
  save() {
    StorageManager.saveTodos(this.todos);
  }

  // 导出数据
  export() {
    return StorageManager.exportData();
  }
}