// 本地存储管理类
class StorageManager {
  static TODO_KEY = 'todos_list';
  static SETTINGS_KEY = 'todos_settings';

  // 获取所有任务
  static getTodos() {
    const todos = localStorage.getItem(this.TODO_KEY);
    return todos ? JSON.parse(todos) : [];
  }

  // 保存任务
  static saveTodos(todos) {
    localStorage.setItem(this.TODO_KEY, JSON.stringify(todos));
  }

  // 获取设置
  static getSettings() {
    const settings = localStorage.getItem(this.SETTINGS_KEY);
    return settings ? JSON.parse(settings) : { theme: 'light', sortBy: 'date' };
  }

  // 保存设置
  static saveSettings(settings) {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
  }

  // 清空所有数据
  static clearAll() {
    localStorage.removeItem(this.TODO_KEY);
    localStorage.removeItem(this.SETTINGS_KEY);
  }

  // 导出数据为 JSON
  static exportData() {
    const todos = this.getTodos();
    return JSON.stringify(todos, null, 2);
  }
}