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
    },
    BNB: {
      name: 'BNB（币安币）',
      description: '币安交易所的"自家会员卡币"，用它在平台上交易能打折手续费，还能参与各种活动，超级实用。'
    },
    OKB: {
      name: 'OKB（OKX币）',
      description: 'OKX交易所的"专属优惠币"，拿着它能挖矿和理财，像是平台的VIP积分。'
    },
    HYPE: {
      name: 'HYPE（Hyperliquid）',
      description: '一个超级快永续合约交易平台的"平台币"，用来治理和激励，专为高手炒合约设计的，速度飞起。'
    },
    PEPE: {
      name: 'PEPE（佩佩币）',
      description: '一只经典青蛙表情包做的"纯玩梗 meme 币"，没啥实际功能，全靠社区大家炒着玩，火起来全看心情和热梗。'
    }
  };

  // 获取DOM元素
  const planetsOrbit = document.getElementById('planetsOrbit');
  const planets = document.querySelectorAll('.planet');
  const infoPanel = document.getElementById('infoPanel');
  const infoTitle = document.getElementById('infoTitle');
  const infoDescription = document.getElementById('infoDescription');
  const closeBtn = document.getElementById('closeBtn');

  // 星球位置和动画相关变量
  let orbitRadius = 0;
  let crossRadius = 0; // 十字轨道半径
  let centerX = 0;
  let centerY = 0;
  let planetSize = 120;
  let rotationAngle = 0;
  let crossAngle = 0; // 十字轨道角度
  let animationId = null;

  // 定义哪些星球在环形轨道，哪些在十字轨道
  // 前5个在环形轨道，后4个在十字轨道
  const CIRCULAR_PLANETS = [0, 1, 2, 3, 4]; // BTC, ETH, SOL, XRP, DOGE
  const CROSS_PLANETS = [5, 6, 7, 8]; // BNB, OKB, HYPE, PEPE

  // 计算星球位置（环形轨道）
  function positionCircularPlanet(planet, index, angleOffset) {
    const totalCircular = CIRCULAR_PLANETS.length;
    const angleStep = (2 * Math.PI) / totalCircular;
    const startAngle = -Math.PI / 2; // 从顶部开始
    const positionInCircle = CIRCULAR_PLANETS.indexOf(index);
    const angle = startAngle + (angleStep * positionInCircle) + angleOffset;
    const x = centerX + orbitRadius * Math.cos(angle) - planetSize / 2;
    const y = centerY + orbitRadius * Math.sin(angle) - planetSize / 2;
    return { x, y };
  }

  // 计算星球位置（十字轨道）
  function positionCrossPlanet(planet, index, angleOffset) {
    const totalCross = CROSS_PLANETS.length;
    const positionInCross = CROSS_PLANETS.indexOf(index);
    
    // 十字轨道的4个位置：上、右、下、左
    const positions = [
      { angle: -Math.PI / 2 }, // 上
      { angle: 0 },            // 右
      { angle: Math.PI / 2 },   // 下
      { angle: Math.PI }        // 左
    ];
    
    const baseAngle = positions[positionInCross].angle;
    const angle = baseAngle + angleOffset;
    
    // 在十字轨道上移动
    const x = centerX + crossRadius * Math.cos(angle) - planetSize / 2;
    const y = centerY + crossRadius * Math.sin(angle) - planetSize / 2;
    return { x, y };
  }

  // 计算所有星球的位置
  function positionPlanets(angleOffset = 0, crossOffset = 0) {
    const orbitWidth = planetsOrbit.offsetWidth;
    const orbitHeight = planetsOrbit.offsetHeight;
    planetSize = planets[0]?.offsetWidth || 120;
    orbitRadius = Math.min(orbitWidth, orbitHeight) / 2 - planetSize / 2 - 20;
    crossRadius = orbitRadius * 0.6; // 十字轨道半径，让中间更饱满
    centerX = orbitWidth / 2;
    centerY = orbitHeight / 2;

    planets.forEach((planet, index) => {
      let pos;
      if (CIRCULAR_PLANETS.includes(index)) {
        // 环形轨道
        pos = positionCircularPlanet(planet, index, angleOffset);
      } else if (CROSS_PLANETS.includes(index)) {
        // 十字轨道
        pos = positionCrossPlanet(planet, index, crossOffset);
      } else {
        // 默认位置（不应该发生）
        pos = { x: centerX - planetSize / 2, y: centerY - planetSize / 2 };
      }
      
      planet.style.left = `${pos.x}px`;
      planet.style.top = `${pos.y}px`;
    });
  }

  // 启动星球旋转动画（环形和十字交叉）
  function startOrbitAnimation() {
    if (animationId) return; // 如果已经在运行，不重复启动
    
    const rotationSpeed = 0.0015; // 环形轨道旋转速度（弧度/帧）
    const crossSpeed = -0.002; // 十字轨道旋转速度（反向，更慢）
    
    function animate() {
      rotationAngle += rotationSpeed;
      crossAngle += crossSpeed;
      
      // 防止角度过大，保持数值稳定
      if (rotationAngle > Math.PI * 2) {
        rotationAngle -= Math.PI * 2;
      }
      if (crossAngle > Math.PI * 2) {
        crossAngle -= Math.PI * 2;
      }
      if (crossAngle < -Math.PI * 2) {
        crossAngle += Math.PI * 2;
      }
      
      positionPlanets(rotationAngle, crossAngle);
      animationId = requestAnimationFrame(animate);
    }
    
    animationId = requestAnimationFrame(animate);
  }

  // 停止动画（当窗口失去焦点时）
  function stopOrbitAnimation() {
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = null;
    }
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

  // 初始化位置和动画
  function init() {
    positionPlanets();
    startOrbitAnimation();
  }

  window.addEventListener('load', init);
  window.addEventListener('resize', () => {
    positionPlanets(rotationAngle, crossAngle);
  });

  // 当窗口失去焦点时暂停动画，获得焦点时恢复
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopOrbitAnimation();
    } else {
      startOrbitAnimation();
    }
  });

  // 初始位置（如果窗口已加载）
  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('DOMContentLoaded', init);
  }
})();

