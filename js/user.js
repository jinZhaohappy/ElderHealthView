// 图表实例存储
let charts = {};

// 生成日期标签（从100天前到今天）
function generateDateLabels(days) {
    const labels = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        // 格式化日期为 MM-DD 格式
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        labels.push(`${month}-${day}`);
    }
    
    return labels;
}

// 生成随机数据（模拟真实数据的变化趋势）
function generateRandomData(days, min, max) {
    const data = [];
    let currentValue = (min + max) / 2; // 从中间值开始
    
    for (let i = 0; i < days; i++) {
        // 添加随机波动，但保持一定的连续性
        const change = (Math.random() - 0.5) * (max - min) * 0.1; // 最大变化幅度为范围的10%
        currentValue += change;
        
        // 确保值在合理范围内
        currentValue = Math.max(min, Math.min(max, currentValue));
        
        // 保留适当的小数位数
        const roundedValue = Math.round(currentValue * 10) / 10;
        data.push(roundedValue);
    }
    
    return data;
}

// 数据说明内容
const chartDescriptions = {
    'radar': {
        title: '健康雷达图说明',
        content: `
            <p>健康雷达图展示了用户在心血管、新陈代谢、肝功能、肾功能、睡眠质量、营养状况等六个维度的综合健康状况。</p>
            <p>每个维度的评分范围为0-100分，分数越高表示该方面的健康状况越好。</p>
            <p>通过雷达图可以直观地看出用户在哪些健康方面表现较好，哪些方面需要重点关注和改进。</p>
        `
    },
    'disease': {
        title: '慢性病趋势预测说明',
        content: `
            <p>慢性病趋势预测图展示了高血压、糖尿病、骨质疏松等慢性病的风险变化趋势。</p>
            <p>风险指数越高，表示患该慢性病的风险越大，需要及时采取预防措施。</p>
            <p>通过观察趋势变化，可以评估当前的健康管理措施是否有效，并及时调整健康策略。</p>
        `
    },
    'blood-pressure': {
        title: '血压趋势说明',
        content: `
            <p>血压趋势图展示了收缩压和舒张压的变化情况。</p>
            <p>正常血压范围：收缩压90-140mmHg，舒张压60-90mmHg。</p>
            <p>血压持续偏高会增加心血管疾病风险，建议定期监测并采取相应的健康管理措施。</p>
        `
    },
    'blood-sugar': {
        title: '血糖趋势说明',
        content: `
            <p>血糖趋势图展示了空腹血糖的变化情况。</p>
            <p>正常空腹血糖范围：3.9-6.1mmol/L。</p>
            <p>血糖异常可能提示糖尿病风险，建议控制饮食、增加运动，必要时咨询医生。</p>
        `
    },
    'bmi': {
        title: 'BMI趋势说明',
        content: `
            <p>BMI（身体质量指数）趋势图展示了体重变化情况。</p>
            <p>正常BMI范围：18.5-24.9，超重：25-29.9，肥胖：≥30。</p>
            <p>保持健康的BMI有助于降低多种慢性疾病的风险，建议通过合理饮食和运动来维持。</p>
        `
    },
    'sleep': {
        title: '睡眠时长说明',
        content: `
            <p>睡眠时长趋势图展示了每日睡眠时间的变化情况。</p>
            <p>成年人建议睡眠时长：7-9小时。</p>
            <p>充足的睡眠对身体健康至关重要，睡眠不足会影响免疫力和认知功能。</p>
        `
    },
    'heart-rate': {
        title: '心率变化说明',
        content: `
            <p>心率变化趋势图展示了静息心率的变化情况。</p>
            <p>正常静息心率范围：60-100次/分钟。</p>
            <p>心率异常可能提示心血管问题，建议定期监测并保持良好的生活习惯。</p>
        `
    }
};

// 初始化所有图表
function initCharts(userData = null) {
    // 只初始化当前显示的图表（雷达图）
    charts.radar = echarts.init(document.getElementById('radarChart'));
    charts.radar.setOption({
        tooltip: { trigger: 'item' },
        radar: {
            indicator: [
                { name: '心血管', max: 100 },
                { name: '新陈代谢', max: 100 },
                { name: '骨骼健康', max: 100 },
                { name: '肾功能', max: 100 },
                { name: '睡眠质量', max: 100 },
                { name: '呼吸功能', max: 100 }
            ],
            radius: '65%'
        },
        series: [{
            type: 'radar',
            data: [{
                value: [85, 72, 68, 60, 78, 65],
                name: '当前健康状态',
                areaStyle: { color: 'rgba(0, 123, 255, 0.4)' }
            }]
        }]
    });

    // 其他图表将在切换时延迟初始化

    // 目录切换功能
    const catalogItems = document.querySelectorAll('.catalog-item');
    catalogItems.forEach(function(item) {
        item.addEventListener('click', function() {
            const chartType = this.getAttribute('data-chart');
            
            // 更新导航状态
            catalogItems.forEach(i => i.classList.remove('active'));
            this.classList.add('active');
            
            // 切换图表显示
            const chartCards = document.querySelectorAll('.chart-card');
            chartCards.forEach(card => card.style.display = 'none');
            document.getElementById(`chart-card-${chartType}`).style.display = '';
            
            // 更新数据说明
            updateDescription(chartType);
            
            // 延迟初始化图表（如果还没初始化）
            setTimeout(() => {
                initChartIfNeeded(chartType);
                if (charts[chartType]) {
                    charts[chartType].resize();
                }
            }, 100);
        });
    });

    // 窗口大小变化时重置所有图表大小
    window.addEventListener('resize', function() {
        // 使用防抖，避免频繁resize
        clearTimeout(window.resizeTimer);
        window.resizeTimer = setTimeout(() => {
            Object.values(charts).forEach(chart => {
                if (chart) {
                    chart.resize();
                }
            });
        }, 200);
    });
}

// 更新数据说明
function updateDescription(chartType) {
    const descTitle = document.getElementById('desc-title');
    const descContent = document.getElementById('desc-content');
    
    if (chartDescriptions[chartType]) {
        descTitle.textContent = chartDescriptions[chartType].title;
        descContent.innerHTML = chartDescriptions[chartType].content;
    }
}

// 延迟初始化图表
function initChartIfNeeded(chartType) {
    console.log('初始化图表:', chartType); // 调试信息
    if (charts[chartType]) {
        console.log('图表已存在，跳过初始化'); // 调试信息
        return; // 已经初始化过了
    }
    
    const container = document.getElementById(`${chartType}Chart`);
    console.log('查找容器:', `${chartType}Chart`, container); // 调试信息
    if (!container) {
        console.log('容器未找到'); // 调试信息
        return;
    }
    
    // 确保容器可见
    const chartCard = container.closest('.chart-card');
    if (chartCard && chartCard.style.display === 'none') {
        chartCard.style.display = '';
    }
    
    // 初始化对应的图表
    switch(chartType) {
        case 'disease':
            charts.disease = echarts.init(container);
            charts.disease.setOption({
                tooltip: { trigger: 'axis' },
                legend: { data: ['高血压风险', '糖尿病风险', '骨质疏松风险'] },
                grid: { bottom: '15%' },
                xAxis: {
                    type: 'category',
                    data: generateDateLabels(100),
                    axisLabel: {
                        interval: 9,
                        fontSize: 11
                    }
                },
                yAxis: { type: 'value', name: '风险指数' },
                series: [
                    {
                        name: '高血压风险',
                        type: 'line',
                        data: generateRandomData(100, 30, 70),
                        smooth: true,
                        lineStyle: { color: '#dc3545' }
                    },
                    {
                        name: '糖尿病风险',
                        type: 'line',
                        data: generateRandomData(100, 40, 80),
                        smooth: true,
                        lineStyle: { color: '#ffc107' }
                    },
                    {
                        name: '骨质疏松风险',
                        type: 'line',
                        data: generateRandomData(100, 50, 90),
                        smooth: true,
                        lineStyle: { color: '#6f42c1' }
                    }
                ]
            });
            break;
            
        case 'blood-pressure':
            charts['blood-pressure'] = echarts.init(container);
            charts['blood-pressure'].setOption({
                tooltip: { trigger: 'axis' },
                legend: { data: ['收缩压', '舒张压'] },
                grid: { bottom: '15%' },
                xAxis: {
                    type: 'category',
                    data: generateDateLabels(100),
                    axisLabel: {
                        interval: 9,
                        fontSize: 11
                    }
                },
                yAxis: { type: 'value', name: '血压(mmHg)' },
                series: [
                    {
                        name: '收缩压',
                        type: 'line',
                        data: generateRandomData(100, 110, 150),
                        smooth: true,
                        lineStyle: { color: '#e63946' },
                        itemStyle: { color: '#e63946' }
                    },
                    {
                        name: '舒张压',
                        type: 'line',
                        data: generateRandomData(100, 70, 100),
                        smooth: true,
                        lineStyle: { color: '#f4a261' },
                        itemStyle: { color: '#f4a261' }
                    }
                ]
            });
            break;
            
        case 'blood-sugar':
            charts['blood-sugar'] = echarts.init(container);
            charts['blood-sugar'].setOption({
                tooltip: { trigger: 'axis' },
                legend: { data: ['空腹血糖'] },
                grid: { bottom: '15%' },
                xAxis: {
                    type: 'category',
                    data: generateDateLabels(100),
                    axisLabel: {
                        interval: 9,
                        fontSize: 11
                    }
                },
                yAxis: { type: 'value', name: '血糖(mmol/L)' },
                series: [
                    {
                        name: '空腹血糖',
                        type: 'line',
                        data: generateRandomData(100, 4.5, 7.0),
                        smooth: true,
                        lineStyle: { color: '#2a9d8f' },
                        itemStyle: { color: '#2a9d8f' }
                    }
                ]
            });
            break;
            
        case 'bmi':
            charts.bmi = echarts.init(container);
            charts.bmi.setOption({
                tooltip: { trigger: 'axis' },
                legend: { data: ['BMI'] },
                grid: { bottom: '15%' },
                xAxis: {
                    type: 'category',
                    data: generateDateLabels(100),
                    axisLabel: {
                        interval: 9,
                        fontSize: 11
                    }
                },
                yAxis: { type: 'value', name: 'BMI' },
                series: [
                    {
                        name: 'BMI',
                        type: 'line',
                        data: generateRandomData(100, 22, 28),
                        smooth: true,
                        lineStyle: { color: '#264653' },
                        itemStyle: { color: '#264653' }
                    }
                ]
            });
            break;
            
        case 'sleep':
            charts.sleep = echarts.init(container);
            charts.sleep.setOption({
                tooltip: { trigger: 'axis' },
                legend: { data: ['睡眠时长'] },
                grid: { bottom: '15%' },
                xAxis: {
                    type: 'category',
                    data: generateDateLabels(100),
                    axisLabel: {
                        interval: 9,
                        fontSize: 11
                    }
                },
                yAxis: { type: 'value', name: '睡眠时长(小时)' },
                series: [
                    {
                        name: '睡眠时长',
                        type: 'line',
                        data: generateRandomData(100, 5.0, 8.5),
                        smooth: true,
                        lineStyle: { color: '#457b9d' },
                        itemStyle: { color: '#457b9d' }
                    }
                ]
            });
            break;
            
        case 'heart-rate':
            charts['heart-rate'] = echarts.init(container);
            charts['heart-rate'].setOption({
                tooltip: { trigger: 'axis' },
                legend: { data: ['静息心率'] },
                grid: { bottom: '15%' },
                xAxis: {
                    type: 'category',
                    data: generateDateLabels(100),
                    axisLabel: {
                        interval: 9,
                        fontSize: 11
                    }
                },
                yAxis: { type: 'value', name: '心率(次/分钟)' },
                series: [
                    {
                        name: '静息心率',
                        type: 'line',
                        data: generateRandomData(100, 60, 100),
                        smooth: true,
                        lineStyle: { color: '#e76f51' },
                        itemStyle: { color: '#e76f51' }
                    }
                ]
            });
            break;
    }
}

// 获取图表数据
async function loadChartsData() {
    try {
        const res = await fetch('http://127.0.0.1:5000/api/user/charts', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (res.status === 401) {
            console.log('未登录，无法获取图表数据');
            return;
        }
        
        if (res.status === 404) {
            console.log('图表数据接口尚未实现，使用默认数据');
            return;
        }
        
        if (!res.ok) {
            console.log(`图表数据接口错误: ${res.status}`);
            return;
        }
        
        const data = await res.json();
        console.log('图表数据响应:', data);
        
        if (data.success && data.charts) {
            updateChartsData(data.charts);
        } else {
            console.log('图表数据获取失败');
        }
    } catch (err) {
        console.error('获取图表数据时出错:', err);
        console.log('使用默认图表数据');
    }
}

// 更新图表数据
function updateChartsData(chartsData) {
    if (!chartsData) return;
    
    // 更新雷达图数据
    if (chartsData.radar && charts.radar) {
        charts.radar.setOption({
            radar: {
                indicator: chartsData.radar.indicators || [
                    { name: '心血管', max: 100 },
                    { name: '新陈代谢', max: 100 },
                    { name: '肝功能', max: 100 },
                    { name: '肾功能', max: 100 },
                    { name: '睡眠质量', max: 100 },
                    { name: '营养状况', max: 100 }
                ]
            },
            series: [{
                data: [{
                    value: chartsData.radar.values || [85, 72, 68, 60, 78, 65],
                    name: '当前健康状态',
                    areaStyle: { color: 'rgba(0, 123, 255, 0.4)' }
                }]
            }]
        });
    }
    
    // 更新慢性病趋势预测图
    if (chartsData.disease && charts.disease) {
        charts.disease.setOption({
            xAxis: {
                data: chartsData.disease.dates || generateDateLabels(100),
                axisLabel: {
                    interval: 9,
                    fontSize: 11
                }
            },
            series: chartsData.disease.series || [
                {
                    name: '高血压风险',
                    data: chartsData.disease.hypertension || generateRandomData(100, 30, 70)
                },
                {
                    name: '糖尿病风险',
                    data: chartsData.disease.diabetes || generateRandomData(100, 40, 80)
                },
                {
                    name: '骨质疏松风险',
                    data: chartsData.disease.osteoporosis || generateRandomData(100, 50, 90)
                }
            ]
        });
    }
    
    // 更新血压趋势图
    if (chartsData['blood-pressure'] && charts['blood-pressure']) {
        charts['blood-pressure'].setOption({
            xAxis: {
                data: chartsData['blood-pressure'].dates || generateDateLabels(100),
                axisLabel: {
                    interval: 9,
                    fontSize: 11
                }
            },
            series: [
                {
                    name: '收缩压',
                    data: chartsData['blood-pressure'].systolic || generateRandomData(100, 110, 150)
                },
                {
                    name: '舒张压',
                    data: chartsData['blood-pressure'].diastolic || generateRandomData(100, 70, 100)
                }
            ]
        });
    }
    
    // 更新血糖趋势图
    if (chartsData['blood-sugar'] && charts['blood-sugar']) {
        charts['blood-sugar'].setOption({
            xAxis: {
                data: chartsData['blood-sugar'].dates || generateDateLabels(100),
                axisLabel: {
                    interval: 9,
                    fontSize: 11
                }
            },
            series: [{
                name: '空腹血糖',
                data: chartsData['blood-sugar'].values || generateRandomData(100, 4.5, 7.0)
            }]
        });
    }
    
    // 更新BMI趋势图
    if (chartsData.bmi && charts.bmi) {
        charts.bmi.setOption({
            xAxis: {
                data: chartsData.bmi.dates || generateDateLabels(100),
                axisLabel: {
                    interval: 9,
                    fontSize: 11
                }
            },
            series: [{
                name: 'BMI',
                data: chartsData.bmi.values || generateRandomData(100, 22, 28)
            }]
        });
    }
    
    // 更新睡眠时长趋势图
    if (chartsData.sleep && charts.sleep) {
        charts.sleep.setOption({
            xAxis: {
                data: chartsData.sleep.dates || generateDateLabels(100),
                axisLabel: {
                    interval: 9,
                    fontSize: 11
                }
            },
            series: [{
                name: '睡眠时长',
                data: chartsData.sleep.values || generateRandomData(100, 5.0, 8.5)
            }]
        });
    }
    
    // 更新心率变化趋势图
    if (chartsData['heart-rate'] && charts['heart-rate']) {
        charts['heart-rate'].setOption({
            xAxis: {
                data: chartsData['heart-rate'].dates || generateDateLabels(100),
                axisLabel: {
                    interval: 9,
                    fontSize: 11
                }
            },
            series: [{
                name: '静息心率',
                data: chartsData['heart-rate'].values || generateRandomData(100, 60, 100)
            }]
        });
    }
}

// 获取当前用户信息并渲染页面
async function loadUserInfo() {
    try {
        const res = await fetch('http://127.0.0.1:5000/api/user/userinfo', {
            method: 'GET',
            credentials: 'include' // 保证带上cookie/session
        });
        if (res.status === 401) {
            // 处理未登录情况
            return { shouldLogin: true };
        }
        const data = await res.json();
        console.log('API响应:', data);  // 调试用
        if (data.success) {
            // 个人信息
            document.querySelector('.user-name').textContent = data.user.name;
            document.querySelector('.user-meta').textContent = `${data.user.gender} | ${data.user.age}岁 | ${data.user.region}`;
            // 健康风险评估
            const riskList = document.querySelector('.user-risk-list');
            riskList.innerHTML = '';

            if (data.user.risks.length > 0) {
                const risk = data.user.risks[0];

                // 风险分数
                const scoreDiv = document.createElement('div');
                scoreDiv.className = 'user-risk-item';
                scoreDiv.textContent = risk.label;  // 例如 “风险分数: 0.01”

                // 风险等级
                const levelMap = { '低': 'low', '中': 'medium', '高': 'high' };
                const badge = document.createElement('span');
                badge.className = 'risk-badge badge-' + (levelMap[risk.level] || 'default');
                badge.textContent = risk.level;

                const levelDiv = document.createElement('div');
                levelDiv.className = 'user-risk-item';
                levelDiv.textContent = '风险等级：';
                levelDiv.appendChild(badge);

                // 添加到列表
                riskList.appendChild(scoreDiv);
                riskList.appendChild(levelDiv);
            }


            // 个性化建议
            const suggestList = document.querySelector('.suggest-list');
            suggestList.innerHTML = '';
            data.user.suggestions.forEach(s => {
                const div = document.createElement('div');
                div.className = 'suggest-item';
                div.textContent = s;
                suggestList.appendChild(div);
            });
        } else {
            alert('未登录或用户信息获取失败');
        }

    } catch (err) {
        alert('网络错误，无法获取用户信息');
    }
}

// 语音播报功能
let speechSynthesis = null;
let currentUtterance = null;
let isPaused = false;
let fullText = '';

function initSpeechSynthesis() {
    // 检查浏览器是否支持语音合成
    if ('speechSynthesis' in window) {
        speechSynthesis = window.speechSynthesis;
        return true;
    } else {
        console.warn('浏览器不支持语音合成功能');
        return false;
    }
}

function speakSuggestions() {
    if (!speechSynthesis) {
        if (!initSpeechSynthesis()) {
            alert('您的浏览器不支持语音播报功能');
            return;
        }
    }

    // 如果正在播放，暂停播放
    if (speechSynthesis.speaking && !isPaused) {
        speechSynthesis.pause();
        isPaused = true;
        updateSpeakButton(true, true); // true表示正在播放，第二个true表示已暂停
        return;
    }

    // 如果已暂停，继续播放
    if (isPaused) {
        speechSynthesis.resume();
        isPaused = false;
        updateSpeakButton(true, false); // true表示正在播放，false表示未暂停
        return;
    }

    // 如果完全停止，重新开始播放
    if (!speechSynthesis.speaking) {
        // 获取所有建议内容
        const suggestItems = document.querySelectorAll('.suggest-item');
        const suggestions = Array.from(suggestItems).map(item => item.textContent);
        
        if (suggestions.length === 0) {
            alert('没有找到健康建议内容');
            return;
        }

        // 合并所有建议为一个文本
        fullText = `个性化健康建议：${suggestions.join('。')}`;

        // 创建语音合成对象
        currentUtterance = new SpeechSynthesisUtterance(fullText);
        
        // 设置语音参数
        currentUtterance.lang = 'zh-CN'; // 中文
        currentUtterance.rate = 0.9; // 语速稍慢
        currentUtterance.pitch = 1.0; // 音调
        currentUtterance.volume = 1.0; // 音量

        // 事件监听
        currentUtterance.onstart = () => {
            isPaused = false;
            updateSpeakButton(true, false);
            console.log('开始语音播报');
        };

        currentUtterance.onend = () => {
            isPaused = false;
            updateSpeakButton(false, false);
            console.log('语音播报结束');
        };

        currentUtterance.onerror = (event) => {
            // 只有在真正的错误时才显示提示，暂停不算错误
            if (event.error !== 'interrupted') {
                isPaused = false;
                updateSpeakButton(false, false);
                console.error('语音播报错误:', event.error);
                alert('语音播报出现错误，请重试');
            }
        };

        // 开始播报
        speechSynthesis.speak(currentUtterance);
    }
}

function updateSpeakButton(isSpeaking, isPaused = false) {
    const speakBtn = document.getElementById('speakBtn');
    if (speakBtn) {
        if (isSpeaking) {
            speakBtn.classList.add('speaking');
            if (isPaused) {
                speakBtn.classList.add('paused');
                speakBtn.querySelector('.speak-icon').textContent = '▶️';
                speakBtn.title = '继续播报';
            } else {
                speakBtn.classList.remove('paused');
                speakBtn.querySelector('.speak-icon').textContent = '⏸️';
                speakBtn.title = '暂停播报';
            }
        } else {
            speakBtn.classList.remove('speaking', 'paused');
            speakBtn.querySelector('.speak-icon').textContent = '🔊';
            speakBtn.title = '语音播报';
        }
    }
}

// 退出登录功能
async function logout() {
    try {
        const response = await fetch('http://127.0.0.1:5000//api/auth/api/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                alert('退出登录成功');
                // 跳转到登录页面
                window.location.href = 'login.html';
            } else {
                alert('退出登录失败');
            }
        } else {
            alert('退出登录失败，请重试');
        }
    } catch (error) {
        console.error('退出登录错误:', error);
        alert('网络错误，退出登录失败');
    }
}

// 页面加载时自动请求用户信息和初始化图表
if (window.location.pathname.endsWith('user.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        // 先初始化图表（使用默认数据）
        initCharts();
        // 然后加载用户信息
        loadUserInfo();
        // 最后加载图表数据
        loadChartsData();
        
        // 绑定退出登录按钮事件
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
        
        // 绑定语音播报按钮事件
        const speakBtn = document.getElementById('speakBtn');
        if (speakBtn) {
            // 单击暂停/继续，双击完全停止
            let clickCount = 0;
            let clickTimer = null;
            
            speakBtn.addEventListener('click', function() {
                clickCount++;
                if (clickCount === 1) {
                    clickTimer = setTimeout(() => {
                        // 单击：暂停/继续播报
                        speakSuggestions();
                        clickCount = 0;
                    }, 300);
                } else if (clickCount === 2) {
                    clearTimeout(clickTimer);
                    clickCount = 0;
                    // 双击：完全停止播报
                    if (speechSynthesis && (speechSynthesis.speaking || isPaused)) {
                        speechSynthesis.cancel();
                        isPaused = false;
                        updateSpeakButton(false, false);
                    }
                }
            });
        }
        
        // 初始化语音合成
        initSpeechSynthesis();
    });
}
