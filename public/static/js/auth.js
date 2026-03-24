    // ==================== Auth ====================
    function switchAuthTab(tab) {
      const tl = document.getElementById('tabLogin'), tr = document.getElementById('tabRegister');
      const fl = document.getElementById('formLogin'), fr = document.getElementById('formRegister');
      if (tab === 'login') {
        tl.style.color = '#2EC4B6'; tl.style.borderBottom = '2px solid #2EC4B6';
        tr.style.color = '#86868b'; tr.style.borderBottom = 'none';
        fl.classList.remove('hidden'); fr.classList.add('hidden');
      } else {
        tr.style.color = '#2EC4B6'; tr.style.borderBottom = '2px solid #2EC4B6';
        tl.style.color = '#86868b'; tl.style.borderBottom = 'none';
        fr.classList.remove('hidden'); fl.classList.add('hidden');
      }
    }

    async function handleLogin() {
      const username = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value;
      if (!username || !password) { showToast('warning', '请填写完整', '用户名和密码不能为空'); return; }
      try {
        const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) });
        const data = await res.json();
        if (data.success) { currentUser = data.user; onLoginSuccess(); }
        else { showToast('error', '登录失败', data.message); }
      } catch (e) { showToast('error', '网络错误', '请检查网络连接'); }
    }

    async function handleRegister() {
      const username = document.getElementById('regUsername').value.trim();
      const email = document.getElementById('regEmail').value.trim();
      const password = document.getElementById('regPassword').value;
      const displayName = document.getElementById('regDisplayName').value.trim();
      const phone = document.getElementById('regPhone').value.trim();
      if (!username || !email || !password) { showToast('warning', '请填写必填项'); return; }
      if (password.length < 6) { showToast('warning', '密码过短', '密码至少6位'); return; }
      try {
        const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, email, password, displayName, phone, role: 'investor' }) });
        const data = await res.json();
        if (data.success) { showToast('success', '注册成功', '欢迎加入参与通！'); switchAuthTab('login'); document.getElementById('loginUsername').value = username; }
        else { showToast('error', '注册失败', data.message); }
      } catch (e) { showToast('error', '网络错误'); }
    }

    function handleGuestLogin() {
      currentUser = { id: 'guest', username: 'guest', displayName: '游客', email: 'guest@demo.com', role: 'investor' };
      loadDemoData();
      onLoginSuccess();
      showToast('info', '游客模式', '已加载 ' + allDeals.length + ' 个发起通项目');
    }

    function onLoginSuccess() {
      const name = currentUser?.displayName || currentUser?.username || '用户';
      const initial = name.charAt(0).toUpperCase();
      document.getElementById('navAvatar').textContent = initial;
      document.getElementById('navName').textContent = name;
      document.getElementById('ddAvatar').textContent = initial;
      document.getElementById('ddName').textContent = name;
      document.getElementById('ddRole').textContent = '投资者';
      document.getElementById('welcomeText').textContent = '欢迎回来，' + name;
      switchPage('pageDashboard');
      initMySieves();
      renderSieveSelector();
      setDashboardViewMode(dashboardViewMode);
      selectSieve('all');
      applyPerspective(currentPerspective, { animate: false, persist: false, toast: false });
      showToast('success', '登录成功', '欢迎回来，' + name);
      if (!localStorage.getItem('ec_onboarded')) { setTimeout(showOnboarding, 800); }
    }

    function handleLogout() { currentUser = null; switchPage('pageAuth'); showToast('info', '已退出', '您已安全退出账号'); }

    // ==================== User Dropdown ====================
    function toggleUserDD(e) { e.stopPropagation(); document.getElementById('userDropdown').classList.toggle('show'); }
    function closeUserDD() { document.getElementById('userDropdown').classList.remove('show'); }
    document.addEventListener('click', (e) => { if (!e.target.closest('#navUserBtn') && !e.target.closest('#userDropdown')) closeUserDD(); });

    // ==================== Demo Data (模拟发起通数据) ====================
    function loadDemoData() {
      const brandProfiles = [
        { brandName: '星巴克', industry: '餐饮', companyName: '杭州星巴克运营有限公司', originator: '杭州星巴克运营方', cities: ['杭州', '上海', '苏州'] },
        { brandName: '瑞幸', industry: '餐饮', companyName: '深圳瑞幸品牌管理有限公司', originator: '深圳瑞幸加盟商', cities: ['深圳', '广州', '东莞'] },
        { brandName: '杰威尔文化', industry: '演艺', companyName: '杰威尔演艺经纪有限公司', originator: '演艺经纪公司', cities: ['上海', '北京', '成都'] },
        { brandName: '新东方', industry: '教育', companyName: '新东方教育科技集团', originator: '新东方教育集团', cities: ['北京', '天津', '南京'] },
        { brandName: '美年健康', industry: '健康', companyName: '美年大健康产业集团', originator: '美年大健康集团', cities: ['上海', '杭州', '宁波'] },
        { brandName: '字节跳动', industry: '科技', companyName: '字节跳动科技有限公司', originator: '字节跳动投融部', cities: ['北京', '深圳', '上海'] },
        { brandName: '海底捞', industry: '餐饮', companyName: '海底捞餐饮管理集团', originator: '海底捞运营总部', cities: ['成都', '重庆', '西安'] },
        { brandName: '泡泡玛特', industry: '零售', companyName: '泡泡玛特文化创意有限公司', originator: '泡泡玛特品牌方', cities: ['北京', '上海', '深圳'] },
        { brandName: '喜茶', industry: '餐饮', companyName: '喜茶餐饮管理有限公司', originator: '喜茶(深圳)公司', cities: ['深圳', '上海', '广州'] },
        { brandName: '太二', industry: '餐饮', companyName: '太二餐饮管理有限公司', originator: '太二餐饮管理', cities: ['广州', '深圳', '武汉'] },
        { brandName: '猿辅导', industry: '教育', companyName: '猿辅导在线教育科技', originator: '猿辅导科技', cities: ['天津', '北京', '杭州'] },
        { brandName: '和睦家', industry: '健康', companyName: '和睦家医疗投资管理', originator: '和睦家医疗', cities: ['北京', '上海', '广州'] }
      ];

      const suffixByIndustry = {
        餐饮: ['旗舰店', '中心店', '社区店'],
        零售: ['旗舰店', '概念店', '体验店'],
        演艺: ['演出中心', '内容基地', '艺人工作室'],
        教育: ['学习中心', '校区', '教学点'],
        健康: ['体检中心', '诊疗中心', '门诊部'],
        科技: ['体验中心', '创新中心', '运营中心']
      };
      const riskCycle = ['A+', 'A', 'A-', 'B+'];
      const disclosureStates = ['disclosed', 'undisclosed', 'none'];

      allDeals = [];
      brandProfiles.forEach((profile, brandIdx) => {
        const suffixes = suffixByIndustry[profile.industry] || ['项目A', '项目B', '项目C'];
        profile.cities.forEach((city, branchIdx) => {
          const dealIdx = allDeals.length;
          const storeName = profile.brandName + city + suffixes[branchIdx % suffixes.length];
          allDeals.push({
            id: 'D_' + (1000 + dealIdx),
            name: storeName,
            companyName: profile.companyName,
            brandName: profile.brandName,
            storeName,
            industry: profile.industry,
            amount: (220 + Math.floor(Math.random() * 760)) * 10000,
            aiScore: (7.0 + Math.random() * 3.0).toFixed(1),
            status: 'open',
            skipped: false,
            revenueShare: (6 + Math.floor(Math.random() * 16)) + '%',
            period: (18 + Math.floor(Math.random() * 42)) + '个月',
            location: city,
            originator: profile.originator,
            kybVerified: branchIdx !== 2,
            historyDisclosure: disclosureStates[(brandIdx + branchIdx) % disclosureStates.length],
            originateDate: new Date(Date.now() - Math.random() * 45 * 86400000).toISOString().slice(0, 10),
            description: '由「' + profile.originator + '」通过发起通提交的' + profile.industry + '行业投资机会。已通过平台基础审核。',
            riskGrade: riskCycle[(brandIdx + branchIdx) % riskCycle.length],
            monthlyRevenue: (50 + Math.floor(Math.random() * 220)) + '万',
            employeeCount: (20 + Math.floor(Math.random() * 90)),
            operatingYears: (1 + Math.floor(Math.random() * 8)).toFixed(1)
          });
        });
      });
      localStorage.setItem('ec_allDeals', JSON.stringify(allDeals));
    }
