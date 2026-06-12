// 主游戏UI
class MainGameUI {
  constructor() {
    this.currentTab = 'stats';
    this.rightTab = 'quest';
    this.battle = null;
    this.questSystem = null;
    this.updateInterval = null;
    this.isAutoFighting = true;
  }
  
  render(player) {
    this.player = player;
    const root = document.getElementById('root');
    
    root.innerHTML = `
      <div id="mainScreen" class="screen active">
        <div class="game-header">
          <div class="player-info">
            <div class="player-name">${player.name}</div>
            <div class="player-level">等级 ${player.level} | 境界 ${player.realmNames[player.realm]} | 经验 ${player.exp}/${player.expRequired}</div>
          </div>
          <div class="user-menu">
            <button class="btn" id="saveBtn" style="font-size: 12px;">保存</button>
            <button class="btn" id="logoutBtn" style="font-size: 12px;">登出</button>
          </div>
        </div>
        
        <div class="game-content">
          <!-- 左侧面板 -->
          <div class="panel">
            <div class="panel-title">个人属性</div>
            <div class="stats-item">
              <span class="stats-label">等级</span>
              <span class="stats-value">${player.level}</span>
            </div>
            <div class="stats-item">
              <span class="stats-label">经验</span>
              <span class="stats-value">${player.exp}/${player.expRequired}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${(player.exp / player.expRequired * 100)}%"></div>
            </div>
            
            <div class="stats-item" style="margin-top: 15px;">
              <span class="stats-label">境界</span>
              <span class="stats-value">${player.realmNames[player.realm]}</span>
            </div>
            <div class="stats-item">
              <span class="stats-label">境界经验</span>
              <span class="stats-value">${player.realmExp}/${player.realmExpRequired}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${(player.realmExp / player.realmExpRequired * 100)}%"></div>
            </div>
            
            <div class="stats-item" style="margin-top: 15px;">
              <span class="stats-label">生命值</span>
              <span class="stats-value">${Math.floor(player.currentHealth)}/${player.getTotalAttributes().health}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${(player.currentHealth / player.getTotalAttributes().health * 100)}%; background: linear-gradient(90deg, #00ff88, #00aa44);"></div>
            </div>
            
            <div class="stats-item">
              <span class="stats-label">灵力</span>
              <span class="stats-value">${Math.floor(player.currentMana)}/${player.getTotalAttributes().mana}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${(player.currentMana / player.getTotalAttributes().mana * 100)}%; background: linear-gradient(90deg, #00d4ff, #0088ff);"></div>
            </div>
            
            <div class="stats-item">
              <span class="stats-label">攻击力</span>
              <span class="stats-value">${Math.floor(player.getTotalAttributes().attack)}</span>
            </div>
            <div class="stats-item">
              <span class="stats-label">防御力</span>
              <span class="stats-value">${Math.floor(player.getTotalAttributes().defense)}</span>
            </div>
            <div class="stats-item">
              <span class="stats-label">速度</span>
              <span class="stats-value">${Math.floor(player.getTotalAttributes().speed)}</span>
            </div>
            
            <!-- 修练按钮 -->
            <button class="btn cultivation-btn" id="cultivateBtn">开始修练</button>
            
            <!-- 突破按钮 -->
            <button class="btn breakthrough-btn" id="breakthroughBtn" ${player.realm >= 4 || player.realmExp < player.realmExpRequired ? 'disabled' : ''}>境界突破</button>
          </div>
          
          <!-- 中央战斗区域 -->
          <div class="panel">
            <div class="panel-title">战斗</div>
            <div class="battle-arena" id="battleArena"></div>
          </div>
          
          <!-- 右侧信息面板 -->
          <div class="panel">
            <div class="panel-title">信息</div>
            <div class="tabs">
              <button class="tab active" data-tab="quest">任务</button>
              <button class="tab" data-tab="achievement">成就</button>
              <button class="tab" data-tab="stat">统计</button>
            </div>
            
            <div class="tab-content active" id="questTab"></div>
            <div class="tab-content" id="achievementTab"></div>
            <div class="tab-content" id="statTab"></div>
          </div>
        </div>
      </div>
    `;
    
    this.attachEvents(player);
    this.initializeGame(player);
  }
  
  attachEvents(player) {
    const cultivateBtn = document.getElementById('cultivateBtn');
    const breakthroughBtn = document.getElementById('breakthroughBtn');
    const saveBtn = document.getElementById('saveBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const tabs = document.querySelectorAll('.tab');
    
    cultivateBtn.addEventListener('click', () => {
      cultivateBtn.classList.toggle('active');
      if (cultivateBtn.classList.contains('active')) {
        cultivateBtn.textContent = '停止修练';
        this.startCultivation(player);
      } else {
        cultivateBtn.textContent = '开始修练';
        this.stopCultivation();
      }
    });
    
    breakthroughBtn.addEventListener('click', () => {
      if (player.realm < 4 && player.realmExp >= player.realmExpRequired) {
        if (confirm(`确定要突破到${player.realmNames[player.realm + 1]}吗？`)) {
          player.breakthrough();
          player.save();
          this.render(player);
        }
      }
    });
    
    saveBtn.addEventListener('click', () => {
      player.save();
      saveBtn.textContent = '已保存';
      setTimeout(() => saveBtn.textContent = '保存', 2000);
    });
    
    logoutBtn.addEventListener('click', () => {
      if (confirm('确定要登出吗？')) {
        StorageManager.removeItem('currentPlayer');
        StorageManager.removeItem('currentUser');
        app.showCharacterScreen();
      }
    });
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const tabName = tab.dataset.tab;
        document.getElementById(tabName + 'Tab').classList.add('active');
        this.updateTabContent(tabName, player);
      });
    });
  }
  
  initializeGame(player) {
    this.questSystem = new QuestSystem(player);
    this.startNewBattle(player);
    this.updateTabContent('quest', player);
    this.updateStats(player);
  }
  
  startNewBattle(player) {
    const enemy = Enemy.generateForLevel(player.level);
    this.battle = new BattleSystem(player, enemy);
    this.battle.start();
    this.renderBattle(player);
  }
  
  renderBattle(player) {
    const arena = document.getElementById('battleArena');
    if (!this.battle) {
      arena.innerHTML = '<div style="color: var(--text-secondary); text-align: center;">准备战斗中...</div>';
      return;
    }
    
    const attrs = player.getTotalAttributes();
    arena.innerHTML = `
      <div class="enemy-display">
        <div class="enemy-name">${this.battle.enemy.name}</div>
        <div class="enemy-hp">${Math.floor(this.battle.enemy.currentHealth)}/${this.battle.enemy.baseHealth}</div>
        <div class="enemy-hp-bar">
          <div class="enemy-hp-fill" style="width: ${(this.battle.enemy.currentHealth / this.battle.enemy.baseHealth * 100)}%"></div>
        </div>
      </div>
      
      <div class="battle-log" id="battleLog"></div>
      
      <div class="battle-buttons" ${!this.battle.battleActive ? 'style="opacity: 0.5;"' : ''}>
        <button class="btn" id="attackBtn" ${!this.battle.battleActive ? 'disabled' : ''}>进攻</button>
        <button class="btn" id="skillBtn" ${!this.battle.battleActive ? 'disabled' : ''}>技能</button>
        <button class="btn success" id="newBattleBtn" ${this.battle.battleActive ? 'style="display: none;"' : ''}>新战斗</button>
      </div>
    `;
    
    this.renderBattleLog();
    this.attachBattleEvents(player);
  }
  
  renderBattleLog() {
    const logContainer = document.getElementById('battleLog');
    if (!logContainer) return;
    
    logContainer.innerHTML = this.battle.getLog().map(entry => `
      <div class="log-entry log-${entry.type}">[${entry.timestamp}] ${entry.message}</div>
    `).join('');
    
    logContainer.scrollTop = logContainer.scrollHeight;
  }
  
  attachBattleEvents(player) {
    const attackBtn = document.getElementById('attackBtn');
    const skillBtn = document.getElementById('skillBtn');
    const newBattleBtn = document.getElementById('newBattleBtn');
    
    if (attackBtn) {
      attackBtn.addEventListener('click', () => {
        if (this.battle.battleActive) {
          this.battle.playerTurn();
          if (!this.battle.playerUseSkill('attack')) {
            this.battle.nextRound();
          }
          this.renderBattle(player);
          this.questSystem.updateEnemyDefeatedCount();
          this.updateTabContent('quest', player);
          
          if (!this.battle.battleActive) {
            const result = this.battle.end();
            if (result === 'win') {
              const rewards = this.battle.getRewards();
              player.addExp(rewards.exp);
              player.addRealmExp(rewards.realmExp);
              player.statistics.enemiesDefeated++;
              player.statistics.battlesWon++;
              player.save();
              this.updateStats(player);
            }
          }
        }
      });
    }
    
    if (newBattleBtn) {
      newBattleBtn.addEventListener('click', () => {
        this.startNewBattle(player);
      });
    }
  }
  
  startCultivation(player) {
    this.updateInterval = setInterval(() => {
      player.addRealmExp(1);
      player.addExp(2);
      this.updateStats(player);
    }, 1000);
  }
  
  stopCultivation() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
  
  updateStats(player) {
    const statsPanel = document.querySelector('.stats-item');
    if (!statsPanel) return;
    
    this.render(player); // 重新渲染所有内容
  }
  
  updateTabContent(tabName, player) {
    if (tabName === 'quest') {
      this.questSystem.updateLevelQuests();
      this.questSystem.updateBreakthroughQuests();
      const quests = this.questSystem.getAllQuests();
      const questHTML = quests.map(q => `
        <div class="quest-item ${q.completed ? 'completed' : ''}">
          <div class="quest-name">${q.name}</div>
          <div style="font-size: 11px; color: var(--text-secondary); margin: 5px 0;">${q.description}</div>
          <div class="progress-bar" style="margin: 5px 0;">
            <div class="progress-fill" style="width: ${q.getProgress() * 100}%"></div>
          </div>
          <div class="quest-reward">${q.completed ? '已完成' : `${Math.floor(q.currentCount)}/${q.targetCount}`}</div>
        </div>
      `).join('');
      document.getElementById('questTab').innerHTML = questHTML || '<div style="color: var(--text-secondary);">暂无任务</div>';
    } else if (tabName === 'achievement') {
      const achievements = player.achievements;
      if (Object.keys(achievements).length === 0) {
        document.getElementById('achievementTab').innerHTML = '<div style="color: var(--text-secondary);">暂无解锁成就</div>';
        return;
      }
      const achHTML = Object.entries(achievements).map(([key, ach]) => `
        <div class="achievement-item unlocked">
          <div class="achievement-icon">⭐</div>
          <div class="achievement-name">${ach.name}</div>
        </div>
      `).join('');
      document.getElementById('achievementTab').innerHTML = achHTML;
    } else if (tabName === 'stat') {
      const stats = player.statistics;
      const statHTML = `
        <div style="font-size: 12px;">
          <div class="stats-item">
            <span>战斗胜利</span>
            <span style="color: var(--success-color);">${stats.battlesWon}</span>
          </div>
          <div class="stats-item">
            <span>击败敌人</span>
            <span style="color: var(--success-color);">${stats.enemiesDefeated}</span>
          </div>
          <div class="stats-item">
            <span>完成任务</span>
            <span style="color: var(--success-color);">${stats.questsCompleted}</span>
          </div>
          <div class="stats-item">
            <span>总伤害输出</span>
            <span style="color: var(--warning-color);">${Math.floor(stats.totalDamageDealt)}</span>
          </div>
        </div>
      `;
      document.getElementById('statTab').innerHTML = statHTML;
    }
  }
}