# 区域老年人健康大数据分析平台

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)]()

## 📋 项目简介

区域老年人健康大数据分析平台是一个基于Web的可视化数据分析系统，专门为老年人健康管理而设计。该平台通过直观的图表和数据分析，帮助医疗机构和政府部门更好地了解和管理区域老年人的健康状况。

## ✨ 主要功能

### 🏠 大屏展示页面
- **总览数据展示**：用户总数、覆盖地区、高风险用户、平均风险评分等关键指标
- **地区用户分布**：各地区用户数量统计和可视化
- **年龄风险分析**：不同年龄段的风险分布情况
- **地图数据展示**：基于地理位置的健康数据可视化
- **风险等级分布**：各地区的风险等级统计

### 👤 用户个人页面
- **个人信息展示**：用户基本信息、健康风险评估
- **健康数据图表**：
  - 雷达图：多维度健康指标分析
  - 慢性病趋势预测：高血压、糖尿病、骨质疏松等疾病趋势
  - 血压监测：收缩压和舒张压变化趋势
  - 血糖监测：血糖值变化趋势
  - BMI指数：体重指数变化
  - 睡眠质量：睡眠时长监测
  - 心率监测：心率变化趋势
- **健康建议**：基于用户健康状况的个性化建议

### 🔐 用户认证系统
- 登录页面和用户认证功能
- 安全的用户会话管理

## 🛠️ 技术栈

### 前端技术
- **HTML5** + **CSS3** + **JavaScript**
- **ECharts** - 数据可视化图表库
- **jQuery** - JavaScript库
- **响应式设计** - 适配不同屏幕尺寸

### 数据格式
- **JSON** - 数据交换格式
- **GeoJSON** - 地理数据格式（四川省地图数据）

### 开发工具
- **Visual Studio Code** - 代码编辑器
- **Git** - 版本控制

## 📁 项目结构

```
elderHealthShow/
├── css/                    # 样式文件
│   ├── index.css          # 大屏页面样式
│   ├── login.css          # 登录页面样式
│   └── user.css           # 用户页面样式
├── data/                   # 数据文件
│   ├── chart_1.json       # 图表数据1
│   ├── chart_2.json       # 图表数据2
│   ├── chart_3.json       # 图表数据3
│   ├── chart_4.json       # 图表数据4
│   ├── sichuan.json       # 四川省地图数据
│   └── sichuan_data.json  # 四川省健康数据
├── images/                 # 图片资源
│   ├── avatar.png         # 用户头像
│   ├── bg.jpg            # 背景图片
│   ├── title.png         # 标题图片
│   └── userPageDesign.png # 用户页面设计图
├── js/                    # JavaScript文件
│   ├── echarts.min.js    # ECharts库
│   ├── index.js          # 大屏页面逻辑
│   ├── jquery-2.2.1.min.js # jQuery库
│   └── user.js           # 用户页面逻辑
├── index.html             # 大屏展示页面
├── login.html             # 登录页面
├── user.html              # 用户个人页面
├── README.md              # 项目说明文档
├── 大屏数据接口设计文档.md    # 数据接口设计文档
└── 图表数据格式说明.md       # 图表数据格式说明
```

## 🚀 快速开始

### 环境要求
- 现代浏览器（Chrome、Firefox、Safari、Edge）
- 本地Web服务器（推荐）

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/your-username/elderHealthShow.git
   cd elderHealthShow
   ```

2. **启动本地服务器**
   
   使用Python（推荐）：
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   或使用Node.js：
   ```bash
   npx http-server -p 8000
   ```

3. **访问应用**
   
   在浏览器中打开：`http://localhost:8000`

### 页面说明

- **大屏展示页面** (`index.html`)：数据可视化大屏，适合在大屏幕上展示
- **登录页面** (`login.html`)：用户登录入口
- **用户个人页面** (`user.html`)：个人健康数据展示

## 📊 数据接口

项目支持与后端API集成，主要接口包括：

- `GET /api/dashboard/all` - 获取大屏展示数据
- `GET /api/user/userinfo` - 获取用户基本信息
- `GET /api/user/charts` - 获取用户图表数据

详细的接口文档请参考：
- [大屏数据接口设计文档.md](大屏数据接口设计文档.md)
- [图表数据格式说明.md](图表数据格式说明.md)

## 🎨 自定义配置

### 修改数据源
1. 编辑 `data/` 目录下的JSON文件
2. 或配置后端API接口地址

### 修改样式
1. 编辑 `css/` 目录下的CSS文件
2. 调整颜色主题和布局

### 添加新图表
1. 在 `js/` 目录下添加新的JavaScript文件
2. 在HTML页面中引入并初始化图表

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

### 贡献步骤
1. Fork 这个项目
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 📝 更新日志

### v1.0.0 (2024-01-15)
- ✨ 初始版本发布
- 🎯 实现大屏数据可视化
- 👤 添加用户个人健康页面
- 🔐 实现用户登录功能
- 📊 集成ECharts图表库

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目维护者：
- 邮箱：
- 项目地址：[https://github.com/your-username/elderHealthShow](https://github.com/your-username/elderHealthShow)

## 🙏 致谢

- [ECharts](https://echarts.apache.org/) - 数据可视化库
- [jQuery](https://jquery.com/) - JavaScript库
- 四川省地理数据提供方

---

⭐ 如果这个项目对您有帮助，请给我们一个星标！