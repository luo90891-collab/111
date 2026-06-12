// 角色创建UI
class CharacterUI {
  constructor() {
    this.selectedSchool = 'swordSchool';
    this.schools = {
      swordSchool: { name: '剑宗', desc: '攻击型，输出伤害高' },
      talismanSchool: { name: '符宗', desc: '防御型，防御能力强' },
      pillarSchool: { name: '丹宗', desc: '平衡型，生存能力强' }
    };
  }
  
  render() {
    const root = document.getElementById('root');
    root.innerHTML = `
      <div id="characterScreen" class="screen active">
        <div class="character-container">
          <h1 class="character-title">创建角色</h1>
          <form class="character-form" id="characterForm">
            <div class="form-group">
              <label>角色名称</label>
              <input type="text" id="characterName" placeholder="输入你的角色名" required>
            </div>
            
            <div class="form-group">
              <label>选择宗门</label>
              <div class="school-select">
                ${Object.entries(this.schools).map(([key, school]) => `
                  <div class="school-option ${key === this.selectedSchool ? 'selected' : ''}" data-school="${key}">
                    <div style="font-weight: bold; margin-bottom: 5px;">${school.name}</div>
                    <div style="font-size: 11px; color: var(--text-secondary);">${school.desc}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <div class="form-row">
              <button type="submit" class="btn success">创建角色</button>
              <button type="button" class="btn" id="viewPlayersBtn">查看角色</button>
            </div>
          </form>
        </div>
      </div>
    `;
    
    this.attachEvents();
  }
  
  attachEvents() {
    const schoolOptions = document.querySelectorAll('.school-option');
    const form = document.getElementById('characterForm');
    const viewPlayersBtn = document.getElementById('viewPlayersBtn');
    
    schoolOptions.forEach(option => {
      option.addEventListener('click', () => {
        document.querySelectorAll('.school-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
        this.selectedSchool = option.dataset.school;
      });
    });
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('characterName').value.trim();
      if (!name) return;
      this.createCharacter(name);
    });
    
    viewPlayersBtn.addEventListener('click', () => this.showPlayerList());
  }
  
  createCharacter(name) {
    const player = new Player(name, this.selectedSchool);
    player.save();
    
    const currentUser = StorageManager.getItem('currentUser');
    const users = StorageManager.getItem('users');
    users[currentUser].players.push(player.id);
    StorageManager.setItem('users', users);
    StorageManager.setItem('currentPlayer', player.id);
    
    app.showMainGame();
  }
  
  showPlayerList() {
    const currentUser = StorageManager.getItem('currentUser');
    const users = StorageManager.getItem('users');
    const playerIds = users[currentUser].players || [];
    
    if (playerIds.length === 0) {
      alert('还没有角色，请先创建一个角色！');
      return;
    }
    
    const players = playerIds.map(id => Player.load(id));
    const listHTML = players.map(p => {
      return `
        <div style="
          background: rgba(10, 14, 39, 0.8);
          border: 1px solid var(--border-color);
          padding: 10px;
          margin-bottom: 10px;
          border-radius: 5px;
          cursor: pointer;
          transition: all 0.3s ease;
        " onmouseover="this.style.borderColor='var(--primary-color)'" onmouseout="this.style.borderColor='var(--border-color)'" onclick="selectPlayer('${p.id}')">
          <div style="color: var(--primary-color); font-weight: bold;">${p.name}</div>
          <div style="font-size: 12px; color: var(--text-secondary); margin-top: 5px;">
            等级: ${p.level} | 境界: ${p.realmNames[p.realm]} | 宗门: ${['剑宗', '符宗', '丹宗'][['swordSchool', 'talismanSchool', 'pillarSchool'].indexOf(p.school)]}
          </div>
        </div>
      `;
    }).join('');
    
    const container = document.querySelector('.character-container');
    container.innerHTML = `
      <h1 class="character-title">选择角色</h1>
      <div style="max-height: 400px; overflow-y: auto;">
        ${listHTML}
      </div>
      <button class="btn" style="width: 100%; margin-top: 20px;" onclick="location.reload()">返回</button>
    `;
  }
}

function selectPlayer(playerId) {
  StorageManager.setItem('currentPlayer', playerId);
  app.showMainGame();
}