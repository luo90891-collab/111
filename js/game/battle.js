// 战斗系统
class BattleSystem {
  constructor(player, enemy) {
    this.player = player;
    this.enemy = enemy;
    this.isAutomatic = true;
    this.battleLog = [];
    this.round = 0;
    this.battleActive = false;
  }
  
  start() {
    this.battleActive = true;
    this.round = 0;
    this.battleLog = [];
    this.player.currentHealth = this.player.getTotalAttributes().health;
    this.addLog('战斗开始！对手：' + this.enemy.name, 'info');
  }
  
  nextRound() {
    if (!this.battleActive) return false;
    
    this.round++;
    
    // 玩家回合
    if (this.player.isAlive()) {
      const playerAction = this.playerTurn();
      if (!playerAction) {
        this.addLog('玩家无法继续战斗！', 'info');
        return this.end();
      }
    }
    
    // 敌人回合
    if (this.enemy.isAlive() && this.player.isAlive()) {
      this.enemyTurn();
    }
    
    // 检查战斗结束
    if (!this.enemy.isAlive()) {
      this.addLog('敌人已被击败！', 'info');
      return this.end();
    }
    
    if (!this.player.isAlive()) {
      this.addLog('你已被击败！', 'info');
      return this.end();
    }
    
    return true;
  }
  
  playerTurn() {
    // 使用基础攻击
    const skill = this.player.skills.attack;
    const attrs = this.player.getTotalAttributes();
    const baseDamage = attrs.attack * skill.damage;
    const damage = baseDamage + (Math.random() - 0.5) * baseDamage * 0.3;
    
    const actualDamage = this.enemy.takeDamage(damage);
    this.addLog(`你使用了${skill.name}，造成${Math.floor(actualDamage)}伤害`, 'damage');
    this.player.statistics.totalDamageDealt += actualDamage;
    
    return true;
  }
  
  playerUseSkill(skillKey) {
    if (!this.battleActive) return false;
    
    const skill = this.player.skills[skillKey];
    if (!skill) return false;
    
    if (this.player.currentMana < skill.manaCost) {
      this.addLog('灵力不足！', 'info');
      return false;
    }
    
    this.player.currentMana -= skill.manaCost;
    
    switch (skill.type) {
      case 'attack':
        const attrs = this.player.getTotalAttributes();
        const damage = (attrs.attack * skill.damage) + (Math.random() - 0.5) * 10;
        const actualDamage = this.enemy.takeDamage(damage);
        this.addLog(`使用${skill.name}，造成${Math.floor(actualDamage)}伤害`, 'damage');
        this.player.statistics.totalDamageDealt += actualDamage;
        break;
      case 'heal':
        const healed = this.player.heal(this.player.getTotalAttributes().health * skill.healing);
        this.addLog(`使用${skill.name}，恢复${Math.floor(healed)}生命值`, 'heal');
        break;
    }
    
    // 敌人回合
    if (this.enemy.isAlive()) {
      this.enemyTurn();
    }
    
    // 检查战斗结束
    if (!this.enemy.isAlive()) {
      this.addLog('敌人已被击败！', 'info');
      return this.end();
    }
    
    if (!this.player.isAlive()) {
      this.addLog('你已被击败！', 'info');
      return this.end();
    }
    
    return true;
  }
  
  enemyTurn() {
    const attrs = this.player.getTotalAttributes();
    const enemyDamage = this.enemy.getAttackDamage();
    const actualDamage = this.player.takeDamage(enemyDamage);
    this.addLog(`${this.enemy.name}发动攻击，你受到${Math.floor(actualDamage)}伤害`, 'damage');
  }
  
  end() {
    this.battleActive = false;
    if (!this.enemy.isAlive()) {
      return 'win';
    }
    return 'lose';
  }
  
  getRewards() {
    if (this.enemy.isAlive()) return { exp: 0, realmExp: 0 };
    return {
      exp: this.enemy.expReward,
      realmExp: this.enemy.realmExpReward
    };
  }
  
  addLog(message, type = 'info') {
    this.battleLog.push({
      round: this.round,
      message: message,
      type: type,
      timestamp: new Date().toLocaleTimeString()
    });
  }
  
  getLog() {
    return this.battleLog;
  }
}