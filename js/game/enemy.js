// 敌人类
class Enemy {
  constructor(level, type = 'normal') {
    this.level = level;
    this.type = type; // normal, elite, boss
    this.name = this.generateName();
    this.baseHealth = this.calculateHealth();
    this.currentHealth = this.baseHealth;
    this.baseAttack = this.calculateAttack();
    this.baseDefense = this.calculateDefense();
    this.expReward = this.calculateExpReward();
    this.realmExpReward = this.calculateRealmExpReward();
  }
  
  generateName() {
    const names = [
      '练气散修',
      '筑基期妖兽',
      '邪修',
      '魔气入体',
      '心魔',
      '妖族战士',
      '黑手博弟子',
      '邪宗弟子',
      '堕落修士',
      '阴鬼'
    ];
    return names[Math.floor(Math.random() * names.length)] + ' Lv.' + this.level;
  }
  
  calculateHealth() {
    let health = 50 + this.level * 15;
    if (this.type === 'elite') health *= 1.5;
    if (this.type === 'boss') health *= 2.5;
    return Math.floor(health);
  }
  
  calculateAttack() {
    let attack = 5 + this.level * 1.5;
    if (this.type === 'elite') attack *= 1.3;
    if (this.type === 'boss') attack *= 1.8;
    return attack;
  }
  
  calculateDefense() {
    let defense = 2 + this.level * 0.5;
    if (this.type === 'elite') defense *= 1.2;
    if (this.type === 'boss') defense *= 1.5;
    return defense;
  }
  
  calculateExpReward() {
    let exp = 10 + this.level * 5;
    if (this.type === 'elite') exp *= 2;
    if (this.type === 'boss') exp *= 3.5;
    return Math.floor(exp);
  }
  
  calculateRealmExpReward() {
    let realmExp = 5 + this.level * 2;
    if (this.type === 'elite') realmExp *= 1.5;
    if (this.type === 'boss') realmExp *= 2.5;
    return Math.floor(realmExp);
  }
  
  takeDamage(damage) {
    const actualDamage = Math.max(1, damage - this.baseDefense / 2);
    this.currentHealth -= actualDamage;
    return actualDamage;
  }
  
  isAlive() {
    return this.currentHealth > 0;
  }
  
  getAttackDamage() {
    const variance = (Math.random() - 0.5) * 0.2; // ±10% 变差
    return this.baseAttack * (1 + variance);
  }
  
  static generateForLevel(playerLevel) {
    const enemyLevel = Math.max(1, playerLevel + Math.floor((Math.random() - 0.5) * 4));
    const rand = Math.random();
    let type = 'normal';
    
    if (rand > 0.85) type = 'boss';
    else if (rand > 0.7) type = 'elite';
    
    return new Enemy(enemyLevel, type);
  }
}