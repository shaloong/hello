import { computed, ref } from 'vue';
import { defineStore } from 'pinia';
import type {
  ApplicationCategory,
  ApplicationCategoryGroup,
  ApplicationFilter,
  PortalApplication
} from '@/types/portal';

interface CategoryMeta {
  label: string;
  order: number;
}

const CATEGORY_META: Record<ApplicationCategory, CategoryMeta> = {
  intranet: { label: '🏠 内网服务', order: 0 },
  communication: { label: '💬 沟通协同', order: 1 },
  development: { label: '🛠️ 研发交付', order: 2 },
  design: { label: '🎨 设计创作', order: 3 },
  management: { label: '📊 运营管理', order: 4 },
  productivity: { label: '⚡ 效率工具', order: 5 },
  analytics: { label: '📈 数据分析', order: 6 }
};

const seedApplications: PortalApplication[] = [
  // 局域网服务（不对外开放）
  {
    id: 'ddns-go',
    name: 'DDNS-GO',
    description: '动态 DNS 管理服务',
    url: 'http://obsidian:9876/',
    category: 'intranet',
    tags: ['DDNS', '内网']
  },
  {
    id: 'autobangumi',
    name: 'AutoBangumi',
    description: '番剧下载管理',
    url: 'http://obsidian:7892/',
    category: 'intranet',
    tags: ['下载', '内网']
  },
  {
    id: 'qbittorrent',
    name: 'qBittorrent',
    description: 'BT 下载客户端 Web UI',
    url: 'http://obsidian:8080/',
    category: 'intranet',
    tags: ['torrent', '内网']
  },
  {
    id: 'nginx-ui',
    name: 'Nginx UI',
    description: 'Nginx 管理界面',
    url: 'http://obsidian:9000/',
    category: 'intranet',
    tags: ['nginx', '管理', '内网']
  },

  // 公开/云服务
  {
    id: 'feishu',
    name: '飞书',
    description: '企业级协作与办公平台。',
    url: 'https://applink.feishu.cn/client/chat/open',
    category: 'communication',
    tags: ['会议', '聊天']
  },
  {
    id: 'feishu-mail',
    name: '飞书邮箱',
    description: '企业邮件服务入口。',
    url: 'https://shaloong.feishu.cn/mail',
    category: 'communication',
    tags: ['邮件', '协作']
  },
  {
    id: 'feishu-docs',
    name: '飞书云文档',
    description: '飞书云文档与知识库首页。',
    url: 'https://shaloong.feishu.cn/drive/home/',
    category: 'communication',
    tags: ['文档', '协作']
  },
  {
    id: 'github',
    name: 'GitHub 仓库',
    description: '协作开发和代码托管仓库。',
    url: 'https://github.com/shaloong',
    category: 'development',
    tags: ['Git', 'CI/CD', 'DevOps']
  },
  {
    id: 'supabase',
    name: 'Supabase',
    description: '认证与数据库服务',
    url: 'https://auth.shaloong.com:8443/',
    category: 'development',
    tags: ['auth', 'db']
  },
  {
    id: 'figma',
    name: 'Figma',
    description: '多人实时协作的界面设计工具。',
    url: 'https://www.figma.com/',
    category: 'design',
    tags: ['UI', '原型']
  },
  {
    id: 'miro',
    name: 'Miro',
    description: '在线白板与头脑风暴协作平台。',
    url: 'https://miro.com/app/dashboard/',
    category: 'design',
    tags: ['白板', 'Workshop']
  },
  {
    id: 'okr-center',
    name: 'OKR 中心',
    description: '目标管理与跟踪平台。',
    url: 'https://shaloong.feishu.cn/okr',
    category: 'management',
    tags: ['目标', '绩效']
  },
  {
    id: 'notion',
    name: 'Notion',
    description: '知识管理与个人效率工具。',
    url: 'https://www.notion.so/',
    category: 'productivity',
    tags: ['知识库', '项目', '模板']
  },
  {
    id: 'metabase',
    name: 'Metabase',
    description: '开源数据可视化与查询平台。',
    url: 'http://obsidian:48080/',
    category: 'analytics',
    tags: ['SQL', '报表']
  }
];

const loadStaticApplications = async () => {
  await new Promise((resolve) => setTimeout(resolve, 80));
  return seedApplications;
};

export const useApplicationsStore = defineStore('applications', () => {
  const applications = ref<PortalApplication[]>([]);
  const isLoading = ref(false);
  const lastUpdated = ref<number | null>(null);

  const hasData = computed(() => applications.value.length > 0);
  const categoryOptions = computed(() =>
    Object.entries(CATEGORY_META)
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([key, meta]) => ({ key: key as ApplicationCategory, label: meta.label }))
  );

  const loadApplications = async () => {
    if (applications.value.length || isLoading.value) {
      return;
    }
    isLoading.value = true;
    try {
      applications.value = await loadStaticApplications();
      lastUpdated.value = Date.now();
    } finally {
      isLoading.value = false;
    }
  };

  const filterApplications = (filters: ApplicationFilter = {}) => {
    const search = filters.searchTerm?.trim().toLowerCase();
    const favorites = filters.favorites;
    const targetCategory = filters.category && filters.category !== 'all' ? filters.category : null;

    return applications.value.filter((app) => {
      const matchesCategory = targetCategory ? app.category === targetCategory : true;
      const matchesSearch = search
        ? app.name.toLowerCase().includes(search) ||
          app.description.toLowerCase().includes(search) ||
          app.tags.some((tag) => tag.toLowerCase().includes(search))
        : true;
      const matchesFavorites = favorites ? favorites.has(app.id) : true;
      return matchesCategory && matchesSearch && matchesFavorites;
    });
  };

  const groupApplications = (filters: ApplicationFilter = {}): ApplicationCategoryGroup[] => {
    const filtered = filterApplications(filters);
    const grouped = new Map<ApplicationCategory, PortalApplication[]>();

    for (const app of filtered) {
      const list = grouped.get(app.category) ?? [];
      list.push(app);
      grouped.set(app.category, list);
    }

    return Array.from(grouped.entries())
      .sort((a, b) => CATEGORY_META[a[0]].order - CATEGORY_META[b[0]].order)
      .map(([key, apps]) => ({
        key,
        label: CATEGORY_META[key].label,
        applications: apps.sort((x, y) => x.name.localeCompare(y.name, 'zh-Hans-CN'))
      }));
  };

  return {
    applications,
    isLoading,
    lastUpdated,
    hasData,
    categoryOptions,
    loadApplications,
    filterApplications,
    groupApplications
  };
});
