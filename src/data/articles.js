export const articlesData = [
  {
    id: 9,
    title: "Syncing State Across Browser Tabs with the Storage Event",
    description: "Learn how to sync state between browser tabs using the storage event. A simple built-in way to keep your app state synchronized across multiple tabs without complex setup.",
    image: "/blogs/images/localstorage-sync-between-tabs.png",
    date: "2026-01-24",
    slug: "syncing-state-across-tabs-storage-event",
    contentPath: "/blogs/syncing-state-across-tabs-storage-event.md",
    tags: ["javascript", "localStorage"],
    showCoverImage: false,
    featured: true
  },
  {
    id: 1,
    title: "Beyond React.memo: Strategic Performance Optimization in Complex React Applications",
    description: "Most React developers know about React.memo(), but treating it as a silver bullet for performance issues is a common mistake. Learn strategic optimization techniques that go beyond memoization.",
    image: "/blogs/images/Strategic-Performance-Optimization-in-Complex-React.webp",
    date: "2025-05-19",
    slug: "beyond-react-memo",
    contentPath: "/blogs/beyond-react-memo.md",
    tags: ["react", "performance"],
    showCoverImage: false,
    featured: true
  },
  {
    id: 2,
    title: "React Keys: A Fundamental Often Overlooked",
    description: "Using random IDs or array indices as React keys is a common mistake that breaks reconciliation. Learn why stable, unique keys matter and how to implement them correctly.",
    image: "/blogs/images/React-Keys-A-Fundamental-Often-Overlooked.webp",
    date: "2025-05-08",
    slug: "react-keys-fundamental",
    contentPath: "/blogs/react-keys-fundamental.md",
    tags: ["react", "fundamentals"],
    showCoverImage: false,
    featured: false
  },
  {
    id: 3,
    title: "Solving Modal Focus Trapping with YouTube iframes",
    description: "A practical solution for maintaining keyboard accessibility in modals containing YouTube iframes. Learn how to handle focus trapping when iframes break the focus flow.",
    image: "/blogs/images/Solving-Modal-Focus-Trapping-with-YouTube-iframes.webp",
    date: "2025-04-29",
    slug: "modal-focus-trapping-youtube-iframe",
    contentPath: "/blogs/modal-focus-trapping-youtube-iframe.md",
    tags: ["react", "accessibility"],
    showCoverImage: false,
    featured: false
  },
  {
    id: 4,
    title: "How to Validate JWT Tokens with Public Keys in Go: A Step-by-Step Guide",
    description: "Learn how to implement a reusable Go function to validate JWT tokens using public keys. A comprehensive guide covering JWT validation, RSA key parsing, and best practices.",
    image: "/blogs/images/How-to-Validate-JWT-Tokens-with-Public-Keys-in-Go-A-Step-by-Step-Guide.webp",
    date: "2025-01-03",
    slug: "jwt-validation-go-public-keys",
    contentPath: "/blogs/jwt-validation-go-public-keys.md",
    tags: ["go", "jwt", "security"],
    showCoverImage: false,
    featured: true
  },
  {
    id: 5,
    title: "Sharding vs Partitioning: The Key Difference You Need to Know!",
    description: "Exploring the key differences between sharding and partitioning in database management, their advantages, disadvantages, and when to use each approach for optimal performance and scalability.",
    image: "/blogs/images/sharding-partitioning.png",
    date: "2024-11-12",
    slug: "sharding-vs-partitioning",
    contentPath: "/blogs/sharding-vs-partitioning.md",
    tags: ["database", "system-design"],
    featured: true
  },
  {
    id: 6,
    title: "Understanding Async and Defer in JavaScript",
    description: "Learn how async and defer attributes work in HTML script tags, their performance implications, and when to use each for optimal page loading speed.",
    image: "/blogs/images/async-defer-head-no-attr.png",
    date: "2021-11-11",
    slug: "async-and-defer",
    contentPath: "/blogs/async-and-defer.md",
    tags: ["javascript", "performance"],
    featured: false
  },
  {
    id: 7,
    title: "Type of Analysis and Asymptotic Notations",
    description: "Understanding types of algorithm analysis (Worst case, Best case, Average case) and asymptotic notations (Big-O, Omega, Theta) for analyzing algorithm performance.",
    image: "/blogs/images/analysis-cover.png",
    date: "2021-06-19",
    slug: "algorithm-analysis-asymptotic-notations",
    contentPath: "/blogs/algorithm-analysis-asymptotic-notations.md",
    tags: ["algorithms", "computer-science"],
    featured: false
  },
  {
    id: 8,
    title: "Algorithms - A Deep Dive",
    description: "Learn what algorithms are, why we analyze them, and how to compare algorithms using rate of growth. Understanding the fundamentals of algorithm analysis in computer science.",
    image: "/blogs/images/Algorithms-A-Deep-Dive-cover.png",
    date: "2021-06-15",
    slug: "introduction-to-algorithms",
    contentPath: "/blogs/introduction-to-algorithms.md",
    tags: ["algorithms", "computer-science"],
    featured: false
  },
]

export const curatedArticles = articlesData.filter(article => article.featured === true)
