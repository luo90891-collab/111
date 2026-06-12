// 玩家类
class Player {
  constructor(name, school = 'swordSchool') {
    this.id = Date.now();
    this.name = name;
    this.school = school; // 剑宗/符宗/丹宗
    this.level = 1;
    this.exp = 0;
    this.expRequired = 100;
    
    // 基础属性
    this.baseAttributes = {
      health: 100,
      mana: 100,
      attack: 10,
      defense: 5,
      speed: 10
    };
    
    this.currentHealth = this.baseAttributes.health;
    this.currentMana = this.baseAttributes.mana;
    
    // 境界系统
    this.realm = 0; // 0=练气, 1=筑基, 2=结丹, 3=元婴, 4=化神
    this.realmNames = ['练气', '筑基', '结丹', '元婴', '化神'];
    this.realmExp = 0;
    this.realmExpRequired = 500;
    
    // 装备系统
    this.equipment = {
      weapon: null,
      armor: null,
      accessory: null,
      ring: null
    };
    
    // 技能
    this.skills = this.initializeSkills();
    
    // 统计数据
    this.statistics = {
      battlesWon: 0,
      questsCompleted: 0,
      enemiesDefeated: 0,
      totalDamageDealt: 0
    };
    
    // 成就
    this.achievements = {};
  }
  
  initializeSkills() {
    const baseSkills = {
      attack: {
        name: '基础剑法',
        type: 'attack',
        damage: 1.5,
        manaCost: 0,
        cooldown: 0,
        currentCooldown: 0
      },
      heavyAttack: {
        name: '重击',
        type: 'attack',
        damage: 2.0,
        manaCost: 20,
        cooldown: 2,
        currentCooldown: 0
      },
      heal: {
        name: '疗伤术',
        type: 'heal',
        healing: 0.3,
        manaCost: 30,
        cooldown: 3,
        currentCooldown: 0
      }
    };
    
    // 根据宗门添加特殊技能
    if (this.school === 'swordSchool') {
      baseSkills.swordStorm = {
        name: '剑气风暴',
        type: 'attack',
        damage: 1.8,
        manaCost: 40,
        cooldown: 4,
        currentCooldown: 0
      };
    } else if (this.school === 'talismanSchool') {
      baseSkills.talismanShield = {
        name: '符文护盾',
        type: 'defense',
        reduction: 0.4,
        manaCost: 35,
        cooldown: 5,
        currentCooldown: 0
      };
    } else if (this.school === 'pillarSchool') {
      baseSkills.pillRefine = {
        name: '丹火锤炼',
        type: 'buff',
        damageBoost: 1.3,
        manaCost: 45,
        cooldown: 4,
        currentCooldown: 0
      };
    }
    
    return baseSkills;
  }
  
  addExp(amount) {
    this.exp += amount;
    let levelUp = false;
    
    while (this.exp >= this.expRequired) {
      this.exp -= this.expRequired;
      this.level++;
      this.expRequired = Math.floor(this.expRequired * 1.1);
      this.baseAttributes.health += 10;
      this.baseAttributes.mana += 10;
      this.baseAttributes.attack += 2;
      this.baseAttributes.defense += 1;
      this.currentHealth = this.baseAttributes.health;
      this.currentMana = this.baseAttributes.mana;
      levelUp = true;
      this.checkAchievements('levelUp', { level: this.level });
    }
    
    return levelUp;
  }
  
  addRealmExp(amount) {
    this.realmExp += amount;
    
    if (this.realmExp >= this.realmExpRequired && this.realm < 4) {
      return true; // 可以突破
    }
    return false;
  }
  
  breakthrough() {
    if (this.realm >= 4 || this.realmExp < this.realmExpRequired) {
      return false;
    }
    
    this.realmExp = 0;
    this.realm++;
    this.realmExpRequired = Math.floor(this.realmExpRequired * 1.5);
    
    // 属性提升
    this.baseAttributes.health += 50 + this.realm * 20;
    this.baseAttributes.mana += 50 + this.realm * 20;
    this.baseAttributes.attack += 10 + this.realm * 5;
    this.baseAttributes.defense += 5 + this.realm * 3;
    
    this.currentHealth = this.baseAttributes.health;
    this.currentMana = this.baseAttributes.mana;
    
    this.checkAchievements('breakthrough', { realm: this.realm });
    return true;
  }
  
  takeDamage(damage) {
    const actualDamage = Math.max(1, damage - this.baseAttributes.defense / 2);
    this.currentHealth -= actualDamage;
    return actualDamage;
  }
  
  heal(amount) {
    const healed = Math.min(amount, this.baseAttributes.health - this.currentHealth);
    this.currentHealth += healed;
    return healed;
  }
  
  isAlive() {
    return this.currentHealth > 0;
  }
  
  equip(slot, item) {
    if (slot in this.equipment) {
      this.equipment[slot] = item;
      return true;
    }
    return false;
  }
  
  getEquippedStats() {
    let stats = { attack: 0, defense: 0, health: 0 };
    
    Object.values(this.equipment).forEach(item => {
      if (item) {
        stats.attack += item.attack || 0;
        stats.defense += item.defense || 0;
        stats.health += item.health || 0;
      }
    });
    
    return stats;
  }
  
  getTotalAttributes() {
    const equipped = this.getEquippedStats();
    return {
      health: this.baseAttributes.health + equipped.health,
      mana: this.baseAttributes.mana,
      attack: this.baseAttributes.attack + equipped.attack,
      defense: this.baseAttributes.defense + equipped.defense,
      speed: this.baseAttributes.speed
    };
  }
  
  checkAchievements(type, data) {
    // 简单的成就检查
    const achievements = {
      'levelUp_10': { type: 'levelUp', condition: (d) => d.level >= 10, name: '初入修行' },
      'levelUp_30': { type: 'levelUp', condition: (d) => d.level >= 30, name: '小有成就' },
      'breakthrough_1': { type: 'breakthrough', condition: (d) => d.realm >= 1, name: '筑基成功' },
      'breakthrough_3': { type: 'breakthrough', condition: (d) => d.realm >= 3, name: '元婴大成' }
    };
    
    Object.entries(achievements).forEach(([key, ach]) => {
      if (ach.type === type && !this.achievements[key] && ach.condition(data)) {
        this.achievements[key] = { name: ach.name, unlockedAt: new Date().toISOString() };
      }
    });
  }
  
  save() {
    StorageManager.setItem('player_' + this.id, this);
  }
  
  static load(id) {
    const data = StorageManager.getItem('player_' + id);
    if (!data) return null;
    
    const player = new Player(data.name, data.school);
    Object.assign(player, data);
    return player;
  }
}