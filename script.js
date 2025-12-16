(() => {
  // 币种信息数据
  const coinData = {
    BTC: {
      name: 'BTC（比特币）',
      description: '就是数字世界的"黄金"，最早的加密货币，像电子现金一样，可以直接转给别人，不用银行当中间人，大家都觉得它稀缺所以值钱。'
    },
    ETH: {
      name: 'ETH（以太坊）',
      description: '像一个超级智能平台，不光能转账，还能跑各种小程序、游戏和借贷啥的，很多新奇玩意儿都建在它上面。'
    },
    SOL: {
      name: 'SOL（Solana）',
      description: '超级快的"高速货币"，转账又快又便宜，适合玩游戏、买虚拟东西，像是以太坊的快速升级版。'
    },
    XRP: {
      name: 'XRP（Ripple）',
      description: '专门帮银行快速跨国转钱的"桥梁币"，几秒钟就把钱从中国转到美国，费用超低，主要给大机构用。'
    },
    DOGE: {
      name: 'DOGE（狗狗币）',
      description: '本来是开玩笑做的"萌狗币"，标志是一只可爱柴犬，因为大家喜欢玩梗和名人推，它就火了，现在也能转账买东西，超级接地气。'
    }
  };

  // 获取DOM元素
  const planetsOrbit = document.getElementById('planetsOrbit');
  const planets = document.querySelectorAll('.planet');
  const infoPanel = document.getElementById('infoPanel');
  const infoTitle = document.getElementById('infoTitle');
  const infoDescription = document.getElementById('infoDescription');
  const closeBtn = document.getElementById('closeBtn');

  // 计算星球在圆形轨道上的位置
  function positionPlanets() {
    const orbitWidth = planetsOrbit.offsetWidth;
    const orbitHeight = planetsOrbit.offsetHeight;
    const planetSize = planets[0]?.offsetWidth || 120;
    const radius = Math.min(orbitWidth, orbitHeight) / 2 - planetSize / 2 - 20;
    const centerX = orbitWidth / 2;
    const centerY = orbitHeight / 2;
    const totalPlanets = planets.length;
    const angleStep = (2 * Math.PI) / totalPlanets;
    const startAngle = -Math.PI / 2; // 从顶部开始

    planets.forEach((planet, index) => {
      const angle = startAngle + (angleStep * index);
      const x = centerX + radius * Math.cos(angle) - planetSize / 2;
      const y = centerY + radius * Math.sin(angle) - planetSize / 2;
      
      planet.style.left = `${x}px`;
      planet.style.top = `${y}px`;
    });
  }

  // 显示币种信息
  function showCoinInfo(coin) {
    const data = coinData[coin];
    if (!data) return;

    infoTitle.textContent = data.name;
    infoDescription.textContent = data.description;
    infoPanel.classList.add('show');

    // 高亮当前选中的星球
    planets.forEach(p => {
      if (p.dataset.coin === coin) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });
  }

  // 隐藏信息面板
  function hideCoinInfo() {
    infoPanel.classList.remove('show');
    planets.forEach(p => p.classList.remove('active'));
  }

  // 绑定事件
  planets.forEach(planet => {
    planet.addEventListener('click', () => {
      const coin = planet.dataset.coin;
      showCoinInfo(coin);
    });
  });

  closeBtn.addEventListener('click', hideCoinInfo);

  // 点击信息面板外部关闭
  infoPanel.addEventListener('click', (e) => {
    if (e.target === infoPanel) {
      hideCoinInfo();
    }
  });

  // 初始化位置
  window.addEventListener('load', () => {
    positionPlanets();
  });

  window.addEventListener('resize', () => {
    positionPlanets();
  });

  // 初始位置（如果窗口已加载）
  if (document.readyState === 'complete') {
    positionPlanets();
  } else {
    window.addEventListener('DOMContentLoaded', positionPlanets);
  }
})();

