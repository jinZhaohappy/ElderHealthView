// 页面加载后执行
window.onload = function () {
    // 加载所有数据
    loadAllDashboardData();
    
    // 添加刷新功能
    addRefreshFunctionality();
};

// 加载所有大屏数据
async function loadAllDashboardData() {
    try {
        // 加载总览数据
        await loadOverviewData();
        
        // 从API获取所有图表数据
        const response = await fetch('http://127.0.0.1:5000/api/dashboard/all', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                // 初始化所有图表
                await initAllCharts(data.data);
            } else {
                console.error('API返回错误:', data.error);
                loadDefaultData();
            }
        } else {
            console.error('API请求失败:', response.status);
            loadDefaultData();
        }
    } catch (error) {
        console.error('加载数据失败:', error);
        loadDefaultData();
    }
}

// 初始化所有图表
async function initAllCharts(dashboardData) {
    // 初始化地图
    await initMapChart(dashboardData.map_data);
    
    // 初始化其他图表
    renderChart1(dashboardData.region_users);
    renderChart2(dashboardData.age_risk);
    renderChart3(dashboardData.region_risk);
    renderChart4(dashboardData.risk_distribution);
}

// 初始化地图图表
async function initMapChart(mapData) {
    const chart = echarts.init(document.getElementById('chart_map'));
    
    // 加载四川地图 GeoJSON
    try {
        const geoResponse = await fetch('data/sichuan.json');
        const geoJson = await geoResponse.json();
        echarts.registerMap('sichuan', geoJson);
        
        const option = {
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    const d = params.data || {};
                    return `
                        <b>${params.name}</b><br/>
                        健康风险评分：${d.value || '无'}<br/>
                        高风险人数：${d.high_risk_count || 0}<br/>
                        高血压率：${(d.hypertension_rate * 100 || 0).toFixed(1)}%<br/>
                        糖尿病率：${(d.diabetes_rate * 100 || 0).toFixed(1)}%<br/>
                        总用户数：${d.total_users || 0}
                    `;
                }
            },
            visualMap: {
                min: 0,
                max: 100,
                left: 'left',
                top: 'bottom',
                text: ['高', '低'],
                inRange: {
                    color: ['#e0ffff', '#006edd', '#ff0000']
                },
                calculable: true
            },
            geo: {
                map: 'sichuan',
                roam: true,
                zoom: 1.2,
                label: {
                    show: true,
                    color: '#4bf316',
                    fontSize: 12
                },
                itemStyle: {
                    areaColor: {
                        type: 'radial',
                        x: 0.5,
                        y: 0.5,
                        r: 0.8,
                        colorStops: [
                            {
                                offset: 0,
                                color: 'rgba(175,238,238, 0)' // 0%处
                            },
                            {
                                offset: 1,
                                color: 'rgba(47,79,79, 0.4)' // 100%处
                            }
                        ],
                        globalCoord: false
                    },
                    borderColor: 'rgba(147, 235, 248, 1)',
                    borderWidth: 2,
                    shadowColor: 'rgba(128, 217, 248, 1)',
                    shadowOffsetX: -2,
                    shadowOffsetY: 2,
                    shadowBlur: 10
                },
                emphasis: {
                    label: {
                        show: true,
                        color: '#fff'
                    },
                    itemStyle: {
                        areaColor: '#389BB7',
                        borderWidth: 0
                    }
                }
            },
            series: [
                {
                    name: '健康风险评分',
                    type: 'map',
                    map: 'sichuan',
                    geoIndex: 0,
                    data: mapData
                }
            ]
        };

        // 渲染图表
        chart.setOption(option);

        // 自适应大小
        window.addEventListener('resize', function () {
            chart.resize();
        });
    } catch (error) {
        console.error('加载地图数据失败:', error);
    }
}

// 加载默认数据（API失败时的降级方案）
function loadDefaultData() {
    console.log('使用默认数据');
    // 这里可以加载静态JSON文件作为备用
    renderChart1();
    renderChart2();
    renderChart3();
    renderChart4();
}

// 加载总览数据
async function loadOverviewData() {
    try {
        // 尝试从API获取数据
        const response = await fetch('http://127.0.0.1:5000/api/dashboard/all', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success && data.data.overview) {
                updateOverviewDisplay(data.data.overview);
                return;
            }
        }
    } catch (error) {
        console.log('API获取总览数据失败，使用默认数据');
    }
    
    // 如果API失败，使用默认数据
    const defaultOverview = {
        total_users: 25600,
        total_regions: 10,
        high_risk_users: 5870,
        avg_risk_score: 0.68,
        update_time: new Date().toLocaleString('zh-CN')
    };
    updateOverviewDisplay(defaultOverview);
}

// 更新总览数据显示
function updateOverviewDisplay(overview) {
    // 格式化数字显示
    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };
    
    // 格式化百分比
    const formatPercentage = (score) => {
        return Math.round(score * 100) + '%';
    };
    
    // 格式化时间
    const formatTime = (timeStr) => {
        const date = new Date(timeStr);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    // 更新DOM元素
    document.getElementById('total_users').textContent = formatNumber(overview.total_users);
    document.getElementById('total_regions').textContent = formatNumber(overview.total_regions);
    document.getElementById('high_risk_users').textContent = formatNumber(overview.high_risk_users);
    document.getElementById('avg_risk_score').textContent = formatPercentage(overview.avg_risk_score);
    document.getElementById('update_time').textContent = '更新时间: ' + formatTime(overview.update_time);
}

// 添加数据刷新功能
function addRefreshFunctionality() {
    // 添加刷新按钮到总览区域
    const overviewSection = document.querySelector('.overview_section');
    if (overviewSection) {
        const refreshBtn = document.createElement('div');
        refreshBtn.className = 'overview_item';
        refreshBtn.innerHTML = `
            <div class="refresh-btn" onclick="refreshAllData()" title="刷新数据">
                <span style="font-size: 24px;">🔄</span>
            </div>
            <div class="overview_label">刷新数据</div>
        `;
        overviewSection.appendChild(refreshBtn);
    }
}

// 刷新所有数据
async function refreshAllData() {
    console.log('开始刷新数据...');
    
    // 显示加载状态
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.style.transform = 'rotate(360deg)';
        refreshBtn.style.transition = 'transform 1s';
    }
    
    try {
        // 重新加载所有数据
        await loadAllDashboardData();
        console.log('数据刷新成功');
    } catch (error) {
        console.error('数据刷新失败:', error);
    } finally {
        // 恢复按钮状态
        if (refreshBtn) {
            setTimeout(() => {
                refreshBtn.style.transform = 'rotate(0deg)';
            }, 1000);
        }
    }
}

function renderChart1(data = null) {
  const loadData = async () => {
    let chartData = data;
    
    if (!chartData) {
      // 如果没有传入数据，尝试从API获取
      try {
        const response = await fetch('http://127.0.0.1:5000/api/dashboard/all', {
          method: 'GET',
          credentials: 'include'
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            chartData = result.data.region_users;
          }
        }
      } catch (error) {
        console.log('API获取失败，使用默认数据');
      }
      
      // 如果API也失败了，使用静态文件
      if (!chartData) {
        const res = await fetch('data/chart_1.json');
        chartData = await res.json();
      }
    }

    const chart = echarts.init(document.getElementById('chart_1'));

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>用户数：{c} 人 ({d}%)'
      },
      series: [{
        type: 'pie',
        radius: ['40%', '65%'], // 环形图
        center: ['50%', '50%'],
        data: chartData,
        label: {
          color: '#fff',
          fontSize: 12,
          formatter: '{b}: {d}%'
        },
        labelLine: {
          length: 10,
          length2: 10,
          lineStyle: {
            color: '#00e5ff'
          }
        },
        itemStyle: {
          borderRadius: 4,
          borderColor: '#000',
          borderWidth: 1
        }
      }]
    };

    chart.setOption(option);
    window.addEventListener('resize', function () {
      chart.resize();
    });
  };

  loadData();
}

function renderChart2(data = null) {
  const loadData = async () => {
    let chartData = data;
    
    if (!chartData) {
      // 如果没有传入数据，尝试从API获取
      try {
        const response = await fetch('http://127.0.0.1:5000/api/dashboard/all', {
          method: 'GET',
          credentials: 'include'
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            chartData = result.data.age_risk;
          }
        }
      } catch (error) {
        console.log('API获取失败，使用默认数据');
      }
      
      // 如果API也失败了，使用静态文件
      if (!chartData) {
        const res = await fetch('data/chart_2.json');
        chartData = await res.json();
      }
    }

    const chart = echarts.init(document.getElementById('chart_2'));

    const ageGroups = chartData.map(item => item.age_group);
    const lowRisk = chartData.map(item => item.low);
    const midRisk = chartData.map(item => item.medium);
    const highRisk = chartData.map(item => item.high);

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: {
        top: '5%',
        data: ['低风险', '中风险', '高风险'],
        textStyle: { color: '#fff' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '5%',
        top: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: ageGroups,
        axisLabel: { color: '#fff' },
        axisLine: { lineStyle: { color: '#fff' } }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#fff' },
        axisLine: { lineStyle: { color: '#fff' } },
        splitLine: { lineStyle: { color: '#444' } }
      },
      series: [
        {
          name: '低风险',
          type: 'bar',
          data: lowRisk,
          itemStyle: { color: '#5bc0de' }
        },
        {
          name: '中风险',
          type: 'bar',
          data: midRisk,
          itemStyle: { color: '#f0ad4e' }
        },
        {
          name: '高风险',
          type: 'bar',
          data: highRisk,
          itemStyle: { color: '#d9534f' }
        }
      ]
    };

    chart.setOption(option);
    window.addEventListener('resize', function () {
      chart.resize();
    });
  };

  loadData();
}

function renderChart3(data = null) {
  const loadData = async () => {
    let chartData = data;
    
    if (!chartData) {
      // 如果没有传入数据，尝试从API获取
      try {
        const response = await fetch('http://127.0.0.1:5000/api/dashboard/all', {
          method: 'GET',
          credentials: 'include'
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            chartData = result.data.region_risk;
          }
        }
      } catch (error) {
        console.log('API获取失败，使用默认数据');
      }
      
      // 如果API也失败了，使用静态文件
      if (!chartData) {
        const res = await fetch('data/chart_3.json');
        chartData = await res.json();
      }
    }

    const chart = echarts.init(document.getElementById('chart_3'));

    const regions = chartData.map(item => item.region);
    const lowRisk = chartData.map(item => item.low);
    const midRisk = chartData.map(item => item.medium);
    const highRisk = chartData.map(item => item.high);

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: {
        top:'5%',
        data: ['低风险', '中风险', '高风险'],
        textStyle: { color: '#fff' },
        top: '5%'
      },
      grid: {
        top: '15%',
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: regions,
        axisLabel: { color: '#fff', interval: 0, rotate: 30 },
        axisLine: { lineStyle: { color: '#fff' } }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#fff' },
        axisLine: { lineStyle: { color: '#fff' } },
        splitLine: { lineStyle: { color: '#444' } }
      },
      series: [
        {
          name: '低风险',
          type: 'bar',
          data: lowRisk,
          itemStyle: { color: '#5bc0de' }
        },
        {
          name: '中风险',
          type: 'bar',
          data: midRisk,
          itemStyle: { color: '#f0ad4e' }
        },
        {
          name: '高风险',
          type: 'bar',
          data: highRisk,
          itemStyle: { color: '#d9534f' }
        }
      ]
    };

    chart.setOption(option);
    window.addEventListener('resize', function () {
      chart.resize();
    });
  };

  loadData();
}

function renderChart4(data = null) {
  const loadData = async () => {
    let chartData = data;
    
    if (!chartData) {
      // 如果没有传入数据，尝试从API获取
      try {
        const response = await fetch('http://127.0.0.1:5000/api/dashboard/all', {
          method: 'GET',
          credentials: 'include'
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            chartData = result.data.risk_distribution;
          }
        }
      } catch (error) {
        console.log('API获取失败，使用默认数据');
      }
      
      // 如果API也失败了，使用静态文件
      if (!chartData) {
        const res = await fetch('data/chart_4.json');
        chartData = await res.json();
      }
    }

    const chart = echarts.init(document.getElementById('chart_4'));

    const regionNames = chartData.map(d => d.region);
    const scores = chartData.map(d => d.score);

    const option = {
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
          return `${params.name}<br/>风险评分：${params.value}`;
        }
      },
      angleAxis: {
        type: 'category',
        data: regionNames,
        axisLabel: {
          color: '#fff',
          rotate: 45
        },
        axisLine: {
          lineStyle: { color: '#fff' }
        }
      },
      radiusAxis: {
        axisLabel: {
          color: '#fff'
        },
        splitLine: {
          lineStyle: {
            color: '#444'
          }
        }
      },
      polar: {},
      series: [{
        type: 'bar',
        data: scores,
        coordinateSystem: 'polar',
        name: '风险评分',
        itemStyle: {
          color: '#ff7043'
        }
      }],
      legend: {
        show: false
      }
    };

    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
  };

  loadData();
}
