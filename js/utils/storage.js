// 本地存储管理
class StorageManager {
  static PREFIX = 'xiuxian_';

  static setItem(key, value) {
    const fullKey = this.PREFIX + key;
    localStorage.setItem(fullKey, JSON.stringify(value));
  }

  static getItem(key) {
    const fullKey = this.PREFIX + key;
    const value = localStorage.getItem(fullKey);
    return value ? JSON.parse(value) : null;
  }

  static removeItem(key) {
    const fullKey = this.PREFIX + key;
    localStorage.removeItem(fullKey);
  }

  static clear() {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }
}