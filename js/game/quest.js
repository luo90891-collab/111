// 任务系统
class Quest {
  constructor(id, name, description, targetCount, reward) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.targetCount = targetCount;
    this.currentCount = 0;
    this.completed = false;
    this.reward = reward;
    this.createdAt = new Date();
  }
  
  progress(amount = 1) {
    if (this.completed) return false;
    this.currentCount += amount;
    if (this.currentCount >= this.targetCount) {
      this.completed = true;
      return true;
    }
    return false;
  }
  
  isCompleted() {
    return this.completed;
  }
  
  getProgress() {
    return Math.min(this.currentCount / this.targetCount, 1);
  }
}

class QuestSystem {
  constructor(player) {
    this.player = player;
    this.quests = new Map();
    this.completedQuests = [];
    this.initializeQuests();
  }
  
  initializeQuests() {
    const questTemplates = [
      {
        id: 'kill_10',
        name: '初战',
        description: '击杀10个敌人',
        targetCount: 10,
        reward: { exp: 200, realmExp: 50 }
      },
      {
        id: 'kill_50',
        name: '杀戮之手',
        description: '击杀50个敌人',
        targetCount: 50,
        reward: { exp: 500, realmExp: 100 }
      },
      {
        id: 'level_10',
        name: '小有成就',
        description: '升级至10级',
        targetCount: 10,
        reward: { exp: 300, realmExp: 75 }
      },
      {
        id: 'breakthrough_1',
        name: '境界提升',
        description: '完成1次境界突破',
        targetCount: 1,
        reward: { exp: 400, realmExp: 100 }
      },
      {
        id: 'level_30',
        name: '修行大成',
        description: '升级至30级',
        targetCount: 30,
        reward: { exp: 1000, realmExp: 200 }
      }
    ];
    
    questTemplates.forEach(template => {
      const quest = new Quest(template.id, template.name, template.description, template.targetCount, template.reward);
      this.quests.set(template.id, quest);
    });
  }
  
  updateEnemyDefeatedCount() {
    const killQuests = ['kill_10', 'kill_50'];
    killQuests.forEach(questId => {
      const quest = this.quests.get(questId);
      if (quest && !quest.completed) {
        if (quest.progress()) {
          this.completeQuest(questId);
        }
      }
    });
  }
  
  updateLevelQuests() {
    const levelQuests = ['level_10', 'level_30'];
    levelQuests.forEach(questId => {
      const quest = this.quests.get(questId);
      if (quest && !quest.completed) {
        quest.currentCount = this.player.level;
        if (quest.currentCount >= quest.targetCount) {
          if (quest.progress(0)) { // 直接完成
            quest.completed = true;
            this.completeQuest(questId);
          }
        }
      }
    });
  }
  
  updateBreakthroughQuests() {
    const btQuests = ['breakthrough_1'];
    btQuests.forEach(questId => {
      const quest = this.quests.get(questId);
      if (quest && !quest.completed) {
        quest.currentCount = Math.max(0, this.player.realm);
        if (quest.currentCount >= quest.targetCount) {
          quest.completed = true;
          this.completeQuest(questId);
        }
      }
    });
  }
  
  completeQuest(questId) {
    const quest = this.quests.get(questId);
    if (!quest) return false;
    
    this.completedQuests.push({
      id: questId,
      name: quest.name,
      completedAt: new Date()
    });
    
    this.player.statistics.questsCompleted++;
    return true;
  }
  
  getActiveQuests() {
    return Array.from(this.quests.values()).filter(q => !q.completed);
  }
  
  getCompletedQuests() {
    return this.completedQuests;
  }
  
  getAllQuests() {
    return Array.from(this.quests.values());
  }
}