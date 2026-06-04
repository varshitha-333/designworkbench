import { BookOpen, Search, ArrowLeft, Clock, Eye, MessageSquare, Tag, Bookmark, ArrowRight, Sparkles, Brain, Compass } from 'lucide-react';

const mockArticles = [
  {
    id: 1,
    title: 'SQL vs NoSQL: A Data Modeling Playbook',
    excerpt: 'Understand when to pick ACID consistency over horizontal key scaling. Analyze read/write patterns for high throughput architectures.',
    content: `## SQL vs NoSQL: A Data Modeling Playbook

Picking the right database tier is critical in L5+ system design loops. Here is the direct playbook to make architectural decisions.

### 1. The Core Trade-offs
*   **SQL (RDBMS):** Focuses on strict schemas, ACID compliance, and complex multi-table joins. Perfect for financial transactions, user authentication, or structured relational models.
*   **NoSQL (Non-Relational):** Sacrifices relational safety to offer massive write speed and horizontal clustering. Best for clickstreams, time-series metrics, chat history, and key-value lookups.

### 2. High-Throughput Scenarios
If your target write TPS is **> 50,000 requests/sec**, standard single SQL DB instances will fail. You must choose:
1.  **Cassandra / DynamoDB:** Highly horizontal partitioning with hash tokens, scaling write throughput linearly as you add database replica slots.
2.  **MongoDB:** Good for fast JSON document queries and nesting arrays.
`,
    tag: 'Databases',
    readTime: '6 min read',
    views: '1,420',
    date: 'May 12, 2026'
  },
  {
    id: 2,
    title: 'Implementing Scale: Token Bucket vs Leaky Bucket',
    excerpt: 'Detailed comparison of rate limiting algorithms. Code implementations of sliding window counters in Redis clusters.',
    content: `## Rate Limiting: Token Bucket vs Leaky Bucket

Rate limiting protects APIs from DDoS spikes, rogue clients, and brute force requests. Here is the low-down on the two major algorithms.

### 1. Token Bucket
*   **Concept:** A bucket has a maximum capacity $N$. It fills up with tokens at a rate $R$ per second. Each request consumes one token. If no tokens exist, the request is rejected.
*   **Benefit:** Allows bursts of traffic up to the bucket capacity $N$. Very simple to implement using Redis hashes.

### 2. Leaky Bucket
*   **Concept:** Requests enter a queue. The queue drains at a constant rate $R$. If the queue is full, incoming requests leak out (are rejected).
*   **Benefit:** Smooths out traffic bursts, outputting requests at an exact constant speed. Great for queuing background jobs.
`,
    tag: 'API Gateway',
    readTime: '8 min read',
    views: '920',
    date: 'Apr 28, 2026'
  },
  {
    id: 3,
    title: 'Database Indexing under the Hood: B-Trees Explained',
    excerpt: 'Deep dive into binary trees, B-Trees, and LSM trees. Learn how database read optimizations trade off write penalties.',
    content: `## Database Indexing: B-Trees vs LSM Trees

Why does an index speed up queries? We analyze B-Tree structures and why writes get slower when adding indexes.

### 1. B-Tree Indexes (Standard SQL)
*   **Structure:** Balanced multi-way search tree.
*   **Read Latency:** $O(\\log N)$. Since tree depth is small, reads only require 3-4 disk hits.
*   **Write Penalty:** Each insert must rebalance the tree and write to random sectors of the disk.

### 2. LSM Trees (Standard NoSQL / Cassandra)
*   **Structure:** Writes are written to sequential log file buffers (MemTable) in memory and then flushed to sequential SSTable files on disk.
*   **Benefit:** Extremely fast write rates because it avoids random disk writes.
`,
    tag: 'Databases',
    readTime: '10 min read',
    views: '1,890',
    date: 'Apr 15, 2026'
  }
];

const articleQuizzes = {
  1: {
    question: "For a chat application expecting 100K message writes/sec, which database write mechanic is preferred?",
    options: [
      "B-Tree indexing to ensure message order consistency",
      "LSM-Tree memtable buffers to bypass random disk seek latency",
      "Strict ACID transactions to block concurrent message insert collisions"
    ],
    answerIndex: 1,
    feedback: {
      0: "AI Coach: A B-Tree index requires random sector disk writes to rebalance. Under 100K writes/sec, this creates major write amplification. Think about LSM trees instead.",
      1: "AI Coach: Excellent! LSM-trees (used in NoSQL Columnar stores like Cassandra) buffer writes sequentially in memory (MemTable) before flushing to disk SSTables, avoiding random disk seeking.",
      2: "AI Coach: ACID transactions require write locking constraints which reduce write throughput significantly. NoSQL structures relax ACID constraints to scale horizontally."
    }
  },
  2: {
    question: "Which algorithm should you select if your API Gateway needs to handle burst traffic spikes gracefully?",
    options: [
      "Leaky Bucket, since it queue-drains at a constant rate",
      "Token Bucket, since requests can consume tokens up to the maximum capacity instantly",
      "Sliding Window Counter, as it blocks all bursts completely"
    ],
    answerIndex: 1,
    feedback: {
      0: "AI Coach: Leaky Bucket smooths out spikes to an absolute constant rate, which actually drops bursty traffic that could otherwise be handled. Try again.",
      1: "AI Coach: Correct! Token Bucket stores up to capacity N tokens, allowing immediate burst processing if tokens are accumulated, which aligns with modern API gateway policies.",
      2: "AI Coach: Sliding Window Counter smooths boundaries but does not allow clean capacity burst allocation like Token Bucket does."
    }
  },
  3: {
    question: "Why does adding an index to a SQL column speed up reads but slow down write operations?",
    options: [
      "An index forces the disk platter to spin faster during reads",
      "Reads lookup pre-sorted pointer paths in log(N) time; writes must rebalance the tree and update disk nodes",
      "Indexes duplicate raw database storage, exhausting RAM allocations"
    ],
    answerIndex: 1,
    feedback: {
      0: "AI Coach: Platters spin at constant RPMs. The index speeds up operations mathematically, not mechanically!",
      1: "AI Coach: Exactly! B-Tree indexes offer logarithmic lookups by keeping keys sorted, but each write penalty triggers node split checks and structural balancing.",
      2: "AI Coach: While indexes consume disk space, the write slowdown is caused by balancing algorithms and random write cycles, not RAM depletion."
    }
  }
};

export default function KnowledgeHub({ setCurrentTab, sidebarComponent }) {
  const [selectedTag, setSelectedTag] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [readingArticle, setReadingArticle] = useState(null);
  
  // Interactive AI Quiz states
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Reset quiz states on article change
  React.useEffect(() => {
    setSelectedQuizAnswer(null);
    setShowFeedback(false);
  }, [readingArticle]);

  const filteredArticles = mockArticles.filter(art => {
    const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          art.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === 'All' || art.tag === selectedTag;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      
      {/* Sidebar navigation */}
      {sidebarComponent}

      {/* Main viewport */}
      <div className="flex-1 overflow-y-auto px-4 py-8 md:px-8 max-w-7xl mx-auto w-full lg:pl-20 text-left">
        
        {/* LIST VIEW */}
        {!readingArticle ? (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center space-x-2">
                  <span>Knowledge Hub</span>
                  <Sparkles className="w-5 h-5 text-violet-400 animate-pulse" />
                </h1>
                <p className="text-slate-400 text-xs mt-1">Read technical articles, scalability systems, and system design playbooks with interactive AI quizzing.</p>
              </div>
            </div>

            {/* Filter controls */}
            <div className="grid md:grid-cols-3 gap-3 bg-slate-900/40 p-4 border border-slate-800 rounded-2xl">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search articles (e.g. database, token bucket)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-violet-500 placeholder-slate-500"
                />
              </div>
              <div className="flex gap-2">
                {['All', 'Databases', 'API Gateway'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      selectedTag === tag 
                        ? 'bg-violet-600/20 border-violet-500 text-violet-400 font-bold' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Articles Grid list */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map(art => (
                <div 
                  key={art.id}
                  className="p-6 rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-slate-750 flex flex-col justify-between space-y-4 hover:-translate-y-0.5 transition-all group"
                >
                  <div className="space-y-3">
                    {/* Header tags */}
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span className="flex items-center space-x-1 font-semibold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded">
                        <Tag className="w-2.5 h-2.5" />
                        <span>{art.tag}</span>
                      </span>
                      <span>{art.date}</span>
                    </div>
                    {/* Title */}
                    <h3 
                      onClick={() => setReadingArticle(art)}
                      className="text-base font-bold text-white group-hover:text-violet-400 cursor-pointer transition-colors"
                    >
                      {art.title}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                      {art.excerpt}
                    </p>
                  </div>

                  {/* Footer details */}
                  <div className="flex justify-between items-center text-[10px] text-slate-500 pt-3 border-t border-slate-800/60 font-mono">
                    <span className="flex items-center space-x-1"><Clock className="w-3.5 h-3.5" /> <span>{art.readTime}</span></span>
                    <span className="flex items-center space-x-1"><Eye className="w-3.5 h-3.5" /> <span>{art.views} views</span></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* READ VIEW MODE WITH TWO-COLUMN AI SPLIT PANEL */
          <div className="max-w-6xl mx-auto space-y-6">
            <button
              onClick={() => setReadingArticle(null)}
              className="flex items-center space-x-2 py-1.5 px-3.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Articles</span>
            </button>

            {/* Split layout: Article content vs AI interactive widgets */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              
              {/* Left Column: Article content body */}
              <article className="w-full lg:w-2/3 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-850 space-y-6">
                {/* Header metrics */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-slate-500 border-b border-slate-850 pb-4">
                  <span className="font-bold text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 rounded">{readingArticle.tag}</span>
                  <span>•</span>
                  <span>{readingArticle.date}</span>
                  <span>•</span>
                  <span>{readingArticle.readTime}</span>
                </div>

                {/* Title */}
                <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                  {readingArticle.title}
                </h1>

                {/* Text content */}
                <div className="prose prose-invert prose-xs text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap font-sans">
                  {readingArticle.content}
                </div>
              </article>

              {/* Right Column: AI summary sheet and AI Quiz widget */}
              <aside className="w-full lg:w-1/3 space-y-6">
                
                {/* AI Summary card */}
                <div className="p-5 rounded-3xl bg-[#090d16] border border-slate-850 space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 blur-2xl pointer-events-none rounded-full" />
                  <div className="flex items-center space-x-2 text-violet-400 font-bold">
                    <Sparkles className="w-4 h-4" />
                    <h4 className="text-xs uppercase tracking-wider font-mono">AI Architect Cheat Sheet</h4>
                  </div>
                  
                  <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
                    {readingArticle.id === 1 && (
                      <ul className="list-disc pl-4 space-y-1">
                        <li><strong>SQL indexes (B-Tree):</strong> logarithmic reads $O(\log N)$ but slows write throughput.</li>
                        <li><strong>NoSQL LSM trees:</strong> sequential memory buffer (MemTable) dumps, bypassing write disk latency.</li>
                        <li><strong>Rule of thumb:</strong> use NoSQL if write TPS is &gt; 50K.</li>
                      </ul>
                    )}
                    {readingArticle.id === 2 && (
                      <ul className="list-disc pl-4 space-y-1">
                        <li><strong>Token Bucket:</strong> stores tokens to support spikes instantly. Best for API Gateways.</li>
                        <li><strong>Leaky Bucket:</strong> buffers requests to output at constant speeds. Best for background worker threads.</li>
                        <li><strong>Eviction:</strong> drop requests once buffers/tokens hit zero.</li>
                      </ul>
                    )}
                    {readingArticle.id === 3 && (
                      <ul className="list-disc pl-4 space-y-1">
                        <li><strong>B-Tree depth:</strong> logarithmic depth lets database read index fields in 3-4 random hops.</li>
                        <li><strong>Balance penalty:</strong> updates trigger node pointer stitching and splitting.</li>
                        <li><strong>LSM sequential logs:</strong> Cassandra skips node balances entirely by appending logs.</li>
                      </ul>
                    )}
                  </div>
                </div>

                {/* AI micro-quiz card */}
                <div className="p-5 rounded-3xl bg-[#090d16] border-2 border-violet-500/20 space-y-4">
                  <div className="flex items-center space-x-2 text-violet-400 font-bold">
                    <Brain className="w-4 h-4 animate-pulse" />
                    <h4 className="text-xs uppercase tracking-wider font-mono">AI Quick Check</h4>
                  </div>

                  <p className="text-xs text-slate-200 font-semibold leading-relaxed">
                    {articleQuizzes[readingArticle.id]?.question}
                  </p>

                  <div className="space-y-2">
                    {articleQuizzes[readingArticle.id]?.options.map((opt, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedQuizAnswer(idx);
                          setShowFeedback(true);
                        }}
                        className={`w-full p-3 rounded-xl border text-left text-xs transition-all cursor-pointer ${
                          selectedQuizAnswer === idx 
                            ? 'bg-violet-600/10 border-violet-500 text-white font-semibold' 
                            : 'bg-slate-950 border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-350'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  {showFeedback && selectedQuizAnswer !== null && (
                    <div className={`p-3.5 rounded-xl text-[11px] leading-relaxed ${
                      selectedQuizAnswer === articleQuizzes[readingArticle.id]?.answerIndex
                        ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium'
                        : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
                    }`}>
                      {articleQuizzes[readingArticle.id]?.feedback[selectedQuizAnswer]}
                    </div>
                  )}
                </div>

                {/* AI Coach practice recommendation */}
                <div className="p-5 rounded-3xl bg-[#090d16] border border-slate-850 space-y-3 text-left">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold">
                    <Compass className="w-4 h-4 animate-spin-slow" />
                    <h4 className="text-xs uppercase tracking-wider font-mono">Coach Practice Link</h4>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">
                    Ground what you just read in real architectures. Design the connections and verify your trade-offs:
                  </p>
                  <button 
                    onClick={() => setCurrentTab('workspace')}
                    className="w-full py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer flex items-center justify-center space-x-1.5"
                  >
                    <span>Practice Sandbox Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </aside>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
