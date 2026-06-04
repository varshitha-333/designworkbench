import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as Icons from 'lucide-react';

const { 
  ArrowLeft, Sparkles, RefreshCw, Trash2, Send, CheckCircle2, AlertCircle, 
  Compass, Brain, Award, Play, ChevronLeft, ChevronRight, ChevronDown, Copy, Plus, X, Edit3, Settings
} = Icons;

const PaletteIconMap = {
  // Generic
  square: Icons.Square,
  rectangle: Icons.Square,
  circle: Icons.Circle,
  diamond: Icons.Activity,
  cylinder: Icons.Database,
  hexagon: Icons.Hexagon,
  cloud: Icons.Cloud,
  document: Icons.FileText,
  triangle: Icons.Triangle,
  pentagon: Icons.Hexagon,
  octagon: Icons.Octagon,
  container: Icons.Box,
  group: Icons.FolderOpen,
  swimlane: Icons.Columns,
  actor: Icons.User,
  process: Icons.Play,
  decision: Icons.GitFork,
  datastore: Icons.Folder,
  api: Icons.Link,

  // System Design
  user: Icons.Users,
  cdn: Icons.Globe,
  lb: Icons.Sliders,
  gateway: Icons.Radio,
  server: Icons.Server,
  microservice: Icons.Network,
  cache: Icons.Cpu,
  queue: Icons.Layers,
  database: Icons.Database,
  storage: Icons.HardDrive,
  
  // AI Agents
  agent: Icons.Bot,
  planner: Icons.Compass,
  tool: Icons.Wrench,
  memory: Icons.Brain,
  llm: Icons.Sparkles,
  kb: Icons.BookOpen,
  router: Icons.Route,
  
  // OOP
  class: Icons.Boxes,
  interface: Icons.FileCode,
  abstract: Icons.Binary,
  object: Icons.Box,
  package: Icons.Package
};
import { useDiagramStore, DiagramStore } from '../store/DiagramStore';
import { ShapeRegistry } from '../canvas/ShapeRegistry';
import { ModeManager } from '../canvas/ModeManager';
import { Serializer } from '../services/Serializer';
import ArchitectureCanvas from '../canvas/ArchitectureCanvas';
import { AutoLayoutEngine } from '../layout/AutoLayoutEngine';

const mapTopicNodeTypeToShapeType = (mode, nodeType) => {
  if (mode === 'oop') {
    if (nodeType === 'client') return 'object';
    if (nodeType === 'server') return 'class';
    if (nodeType === 'database') return 'interface';
    return 'class';
  } else if (mode === 'dsa') {
    if (nodeType === 'client') return 'array';
    if (nodeType === 'server') return 'tree_node';
    if (nodeType === 'database') return 'graph_node';
    return 'tree_node';
  } else { // system_design
    if (nodeType === 'client') return 'user';
    if (nodeType === 'server') return 'server';
    if (nodeType === 'database') return 'database';
    if (nodeType === 'cache') return 'cache';
    if (nodeType === 'queue') return 'queue';
    if (nodeType === 'lb') return 'lb';
    return 'server';
  }
};

const calculateNodeHeight = (properties) => {
  const metadataKeysCount = Object.keys(properties || {}).filter(k => k !== 'description' && k !== 'technology').length;
  const descLength = properties?.description?.length || 0;
  const descRows = Math.ceil(descLength / 25);
  const extraDescHeight = Math.max(0, (descRows - 1) * 16);
  const baseHeight = 96 + extraDescHeight;
  return Math.max(96, baseHeight + metadataKeysCount * 20);
};

const generateAILogicalViewText = (nodes, edges, activeCategory) => {
  if (nodes.length === 0) return "Empty Diagram";
  
  let categoryName = "System Design";
  if (activeCategory === 'ood') categoryName = "Object Oriented Design (OOD)";
  else if (activeCategory === 'agentic_ai') categoryName = "Agentic AI";
  else if (activeCategory === 'dsa') categoryName = "Data Structures & Algorithms";

  const edgeLines = edges.map(edge => {
    const fromNode = nodes.find(n => n.id === edge.source);
    const toNode = nodes.find(n => n.id === edge.target);
    if (!fromNode || !toNode) return null;
    return `${fromNode.name} (${fromNode.type.toUpperCase()}) ──▶ ${toNode.name} (${toNode.type.toUpperCase()})`;
  }).filter(Boolean);
  
  const header = [
    `Category: ${categoryName}`,
    "====================================",
    "Logical Data Flow Architecture Path:",
    "------------------------------------"
  ];

  if (edgeLines.length === 0) {
    return [
      `Category: ${categoryName}`,
      "====================================",
      ...nodes.map(n => `Component: ${n.name} [Type: ${n.type.toUpperCase()}]`)
    ].join('\n');
  }

  return [
    ...header,
    ...edgeLines
  ].join('\n');
};


// Layered / Sugiyama-style System Design Layout Engine
const autoLayoutDiagram = (currentNodes, currentEdges) => {
  // Define layers (tiers)
  const tiers = {
    ingress: [],    // client, user, gate
    gateway: [],    // lb, gateway, proxy
    application: [],// server, app, logic, router
    cache: [],      // cache, redis, memcached
    buffer: [],     // queue, kafka, rabbitmq
    storage: []     // database, db, cylinder, postgres, cassandra, spot
  };
  
  // Categorize nodes based on type, shape, or name semantic keys
  currentNodes.forEach(n => {
    const type = n.type || '';
    const name = (n.name || '').toLowerCase();
    const shape = n.shape || '';
    
    if (type === 'client' || name.includes('client') || name.includes('user') || name.includes('gate') || name.includes('inputs')) {
      tiers.ingress.push(n);
    } else if (type === 'lb' || name.includes('balancer') || name.includes('gateway') || name.includes('proxy') || name.includes('printer')) {
      tiers.gateway.push(n);
    } else if (type === 'cache' || name.includes('cache') || name.includes('redis') || name.includes('memcached') || shape === 'circle') {
      tiers.cache.push(n);
    } else if (type === 'queue' || name.includes('queue') || name.includes('kafka') || name.includes('buffer') || shape === 'subgraph' || type === 'queue') {
      tiers.buffer.push(n);
    } else if (type === 'database' || type === 'db' || name.includes('db') || name.includes('database') || name.includes('postgres') || name.includes('cassandra') || name.includes('spot') || shape === 'cylinder') {
      tiers.storage.push(n);
    } else {
      tiers.application.push(n); // default fallback (App Server, coordinator classes, etc)
    }
  });
  
  // Ordered list of active tiers
  const activeTiers = [
    tiers.ingress,
    tiers.gateway,
    tiers.application,
    tiers.cache,
    tiers.buffer,
    tiers.storage
  ].filter(t => t.length > 0);
  
  // Alignment settings
  const canvasWidth = 520;
  const rowHeight = 110;
  const startY = 40;
  
  const alignedNodes = [];
  
  // Assign y and x coordinates per tier to make it perfectly spaced
  activeTiers.forEach((tier, tierIdx) => {
    const y = startY + tierIdx * rowHeight;
    const count = tier.length;
    
    tier.forEach((node, nodeIdx) => {
      // Space evenly across canvas width
      const nodeW = node.shape === 'circle' || node.shape === 'diamond' ? 96 : node.shape === 'subgraph' ? 176 : 144;
      const x = (canvasWidth / (count + 1)) * (nodeIdx + 1) - nodeW / 2;
      const computedX = Math.round(Math.max(10, Math.min(canvasWidth - nodeW - 10, x)));
      const computedY = Math.round(y);
      alignedNodes.push({
        ...node,
        x: computedX,
        y: computedY,
        position: { x: computedX, y: computedY }
      });
    });
  });
  
  return alignedNodes;
};

export default function Workspace({ currentProblem, activeCategory, setActiveCategory, setCurrentTab, sidebarComponent }) {
  const [searchQuery, setSearchQuery] = useState('');
  // AI Database of Topics
  const topicData = {
    system_design: {
      title: "Design a URL Shortener (TinyURL)",
      difficulty: "Easy",
      problemStatement: "Design a system that converts a long URL into a short key (e.g. cd.io/a7x8y), handling high reads (100K TPS) and writes (10K TPS) efficiently.",
      defaultCode: `-- SQL Database Schema
CREATE TABLE urls (
  short_key VARCHAR(8) PRIMARY KEY,
  original_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_urls_created ON urls(created_at);`,
      defaultSpec: `# System Design Specs\n1. Web Servers query cache.\n2. Write bursts buffer in Kafka queues.`,
      initialNodes: [
        { id: 'client', type: 'client', name: 'Clients / Users', x: 180, y: 30, shape: 'square' },
        { id: 'server', type: 'server', name: 'App Server Node', x: 180, y: 140, shape: 'diamond' },
        { id: 'database', type: 'database', name: 'PostgreSQL DB', x: 196, y: 250, shape: 'cylinder' }
      ],
      initialEdges: [
        { from: 'client', to: 'server' },
        { from: 'server', to: 'database' }
      ],
      nodesLabel: "Add Elements:",
      phases: {
        1: {
          name: "1. Clarify Scale & Footprint",
          goal: "Estimate daily write storage footprint.",
          question: "We face 10,000 writes/sec and each record takes 500 bytes. How much raw storage is written to our database daily?",
          options: ["4.32 GB / day", "432 GB / day (10K * 86,400 * 500 B)", "43.2 TB / day"],
          correctIndex: 1,
          hint: "Formula: Writes/sec * Seconds in a day (86,400) * Bytes per record. 10K * 86400 * 500 = 432,000,000,000 bytes ≈ 432 GB."
        },
        2: {
          name: "2. Select Database Paradigm",
          goal: "Choose appropriate storage tier.",
          question: "For simple key-value fetches by short key at scale, which database paradigm fits best?",
          options: ["Relational Database (SQL) with index", "NoSQL Key-Value / Document Store", "Graph Database"],
          correctIndex: 1,
          hint: "We need quick lookup by a single key without complex multi-table joins. A distributed NoSQL Key-Value store scales reads horizontally more easily than a traditional SQL database."
        },
        3: {
          name: "3. Shield Database Reads",
          goal: "Implement memory cache tier.",
          question: "Reads spike to 100,000 requests/sec. How do we protect our database from query starvation?",
          options: ["Redis cache with LRU eviction policy", "Enable strict database locking", "Re-route reads to Kafka queue"],
          correctIndex: 0,
          hint: "An in-memory cache like Redis intercepts read queries. An LRU (Least Recently Used) policy ensures cold entries are evicted to prevent memory saturation."
        },
        4: {
          name: "4. Buffer Surge Writes",
          goal: "Decouple writes asynchronously.",
          question: "If write requests spike to 100K TPS, how do we buffer them so database connections don't exhaust?",
          options: ["Deploy an API Gateway rate limiter", "Buffer writes in a Message Queue (Kafka)", "Add database read replicas"],
          correctIndex: 1,
          hint: "A Message Queue (e.g. Kafka or RabbitMQ) acts as an asynchronous buffer, decoupling servers from database writes and letting workers persist messages at a safe, steady rate."
        },
        5: {
          name: "AI Coach Goals Completed!",
          goal: "Architecture ready for evaluation.",
          question: "Verify your layout on the canvas and click 'Analyze Design' to run evaluation diagnostics!",
          options: [],
          correctIndex: -1,
          hint: ""
        }
      }
    },
    ood: {
      title: "Design a Parking Lot (OOD)",
      difficulty: "Easy",
      problemStatement: "Design an Object-Oriented Parking Lot System with multiple levels and spots of varying sizes (Small, Medium, Large) for Cars, Motorcycles, and Trucks.",
      defaultCode: `// TypeScript OOD Class Layout
interface Vehicle {
  getLicense(): string;
  getSize(): VehicleSize;
}

class Car implements Vehicle {
  getLicense() { return "CAR-123"; }
  getSize() { return VehicleSize.MEDIUM; }
}

class ParkingLot {
  private levels: Level[] = [];
  public parkVehicle(v: Vehicle): boolean { return false; }
}`,
      defaultSpec: `# Object-Oriented Design Specs\n1. Enforce SOLID principles.\n2. Handle Spot allocation threads safely.`,
      initialNodes: [
        { id: 'gate', type: 'client', name: 'Entry Gate Controller', x: 180, y: 30, shape: 'square' },
        { id: 'lot', type: 'server', name: 'ParkingLot Coordinator', x: 180, y: 140, shape: 'diamond' },
        { id: 'spot', type: 'database', name: 'ParkingSpot Class', x: 196, y: 250, shape: 'cylinder' }
      ],
      initialEdges: [
        { from: 'gate', to: 'lot' },
        { from: 'lot', to: 'spot' }
      ],
      nodesLabel: "Add Elements:",
      phases: {
        1: {
          name: "1. Model Inheritance vs Interfaces",
          goal: "Define abstract base structures.",
          question: "How should we represent different vehicle types (Car, Truck, Motorcycle) to decouple the slot allocator?",
          options: ["Deep class inheritance tree (Vehicle Class -> Car Class)", "Common IVehicle interface contract", "Separate standalone classes for each type"],
          correctIndex: 1,
          hint: "An interface defines a behavior contract (e.g. getSize()). It keeps the system loosely coupled and avoids deep, rigid inheritance hierarchies."
        },
        2: {
          name: "2. Observe Open-Closed Principle",
          goal: "Deconstruct spot compatibility checks.",
          question: "To respect OCP when adding new Electric Charging spots, who should evaluate if a vehicle fits a spot?",
          options: ["ParkingLot coordinator queries vehicle types", "ParkingSpot class evaluates compatibility internally", "Entry Gate Controller checks size variables"],
          correctIndex: 1,
          hint: "By letting the Spot check if it can accommodate a given vehicle internally, we can introduce new spot types without modifying the core ParkingLot coordinator class."
        },
        3: {
          name: "3. Central Coordinator Instance",
          goal: "Restricting multiple lot instances.",
          question: "We must guarantee exactly one centralized ParkingLot manager instance. What pattern restricts this?",
          options: ["Factory Method pattern", "Singleton pattern with private constructor", "Builder pattern"],
          correctIndex: 1,
          hint: "A Singleton pattern ensures a class has only one instance and provides a global point of access to it."
        },
        4: {
          name: "4. Thread Concurrency Safety",
          goal: "Manage concurrent reservation threads.",
          question: "If two gates try to reserve the last remaining parking spot at the same microsecond, how do we prevent double-bookings?",
          options: ["Mutex Locks / Synchronized block on spot allocation", "Thread.sleep() delay loops", "Run database cleanups every 10s"],
          correctIndex: 0,
          hint: "Using locks (e.g., synchronized blocks or reentrant locks) ensures only one thread executes the critical spot-allocation block at a time, preventing race conditions."
        },
        5: {
          name: "AI Coach Goals Completed!",
          goal: "OOP Design ready for evaluation.",
          question: "Verify your class links on the canvas and click 'Analyze Design' to run evaluation diagnostics!",
          options: [],
          correctIndex: -1,
          hint: ""
        }
      }
    },
    dsa: {
      title: "Design an LRU Cache (Algorithms)",
      difficulty: "Medium",
      problemStatement: "Implement a Least Recently Used (LRU) Cache data structure supporting get(key) and put(key, value) operations in O(1) constant time complexity.",
      defaultCode: `// JS LRU Cache skeleton
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = null;
    this.tail = null;
  }
  get(key) {}
  put(key, val) {}
}`,
      defaultSpec: `# LRU Cache Specs\n1. Target O(1) reads/writes.\n2. Maintain double-linked nodes.`,
      initialNodes: [
        { id: 'client', type: 'client', name: 'Get / Put Inputs', x: 180, y: 30, shape: 'square' },
        { id: 'server', type: 'server', name: 'Hash Map Lookup', x: 180, y: 140, shape: 'diamond' },
        { id: 'database', type: 'database', name: 'Double Linked Nodes', x: 196, y: 250, shape: 'cylinder' }
      ],
      initialEdges: [
        { from: 'client', to: 'server' },
        { from: 'server', to: 'database' }
      ],
      nodesLabel: "Add Elements:",
      phases: {
        1: {
          name: "1. Constant Time Benchmarks",
          goal: "Confirm time complexity goals.",
          question: "We require O(1) constant time get/put operations. How does constant time scale as cache items grow?",
          options: ["Increases linearly with items count", "Stays constant regardless of cache size", "Increases logarithmically"],
          correctIndex: 1,
          hint: "O(1) means the runtime of the algorithm is independent of the input size. It takes the same number of operations whether the cache has 10 elements or 10 million."
        },
        2: {
          name: "2. Pick Core Data Structures",
          goal: "Combine Hash Map and Linked List.",
          question: "What combination of data structures gives constant O(1) lookup AND constant node eviction removals?",
          options: ["Binary Search Tree + Stack", "Hash Map + Doubly Linked List", "Queue + Array list"],
          correctIndex: 1,
          hint: "A Hash Map provides O(1) key lookup to the node reference. A Doubly Linked List lets us remove and insert nodes at the head/tail in O(1) time once we have the reference."
        },
        3: {
          name: "3. Doubly Linked Nodes Promotion",
          goal: "Understand pointer stitching.",
          question: "When a key is accessed, how do we move its node to the head of the list in O(1) time?",
          options: ["Reconstruct the entire list structure", "Stitch neighboring prev/next pointers and reset head", "Swap node value with the head node value"],
          correctIndex: 1,
          hint: "By connecting target.prev.next to target.next and target.next.prev to target.prev, we isolate the node, then insert it at the head, updating only a few pointers."
        },
        4: {
          name: "4. Capacity Eviction Operations",
          goal: "Trigger coldest items eviction.",
          question: "When cache capacity is full and a new key is added, which node must be evicted?",
          options: ["The node at the tail of the list", "The node at the head of the list", "The middle index node"],
          correctIndex: 0,
          hint: "The tail of the list holds the least recently used element (coldest data), which is the candidate for eviction."
        },
        5: {
          name: "AI Coach Goals Completed!",
          goal: "Data Structure ready for evaluation.",
          question: "Verify your DSA links on the canvas and click 'Analyze Design' to run evaluation diagnostics!",
          options: [],
          correctIndex: -1,
          hint: ""
        }
      }
    },
    agentic_ai: {
      title: "Design a ReAct Agent (Agentic AI)",
      difficulty: "Medium",
      problemStatement: "Design a Reasoning + Acting (ReAct) LLM Agent Router. The agent loops through: Thought -> JSON Tool payload extraction -> Execution Sandbox -> Observation.",
      defaultCode: `# Python ReAct Prompt template
react_prompt = """
Thought: analyze query
Action: tool_name(args)
Observation: tool output
"""
class ReActAgent:
  def step(self, query): pass`,
      defaultSpec: `# Agentic AI Specs\n1. Define tool parsers safely.\n2. Handle infinite loop timeouts.`,
      initialNodes: [
        { id: 'query', type: 'client', name: 'User Query / Input', x: 180, y: 30, shape: 'square' },
        { id: 'agent', type: 'server', name: 'ReAct Agent Engine', x: 180, y: 140, shape: 'diamond' },
        { id: 'tool', type: 'database', name: 'Tools Registry Hub', x: 196, y: 250, shape: 'cylinder' }
      ],
      initialEdges: [
        { from: 'query', to: 'agent' },
        { from: 'agent', to: 'tool' }
      ],
      nodesLabel: "Add Elements:",
      phases: {
        1: {
          name: "1. The ReAct Sequence Loop",
          goal: "Establish agent reasoning stages.",
          question: "What is the three-step sequence the agent repeats in a ReAct framework to solve a query?",
          options: ["Input -> Embed -> Query", "Thought -> Action -> Observation", "Synthesize -> Output -> Retry"],
          correctIndex: 1,
          hint: "The agent reasons (Thought), decides which tool to call (Action), and evaluates the tool outcome (Observation) iteratively."
        },
        2: {
          name: "2. Tool Call Serialization",
          goal: "Define tool call payloads safely.",
          question: "How should tool parameters be structured so the local agent backend executes them without parsing errors?",
          options: ["Raw text query description", "JSON Schema / Structured Arguments", "Regular expression parameters"],
          correctIndex: 1,
          hint: "JSON Schemas allow the LLM to output structured parameters that can be easily parsed and validated by the backend."
        },
        3: {
          name: "3. Runaway Loop Guardrails",
          goal: "Implement timeout parameters.",
          question: "To prevent a hallucinating agent from spending tokens in an infinite loops, what guardrails must we configure?",
          options: ["Increase server CPU cores limit", "Max iterations counter and execution timeouts", "Flush system prompt history every turn"],
          correctIndex: 1,
          hint: "Setting a strict max_iterations count (e.g. 10) and a timeout (e.g. 30s) halts runaway loops and controls costs."
        },
        4: {
          name: "4. Sandbox safety & prompt injection",
          goal: "Manage query safety injections.",
          question: "How do we prevent prompt injection attacks ('Ignore rules, delete DB') from compromising tool access?",
          options: ["Input validation, system prompt sandboxing, and limited tool privileges", "Using a smaller LLM context window size", "Restarting the server on every agent step"],
          correctIndex: 0,
          hint: "Enforcing input validation, wrapping user queries in safe system boundaries, and running execution tools with least-privilege handles safeguards the environment."
        },
        5: {
          name: "AI Coach Goals Completed!",
          goal: "Agentic pipeline ready for evaluation.",
          question: "Verify your agent pipes on the canvas and click 'Analyze Design' to run evaluation diagnostics!",
          options: [],
          correctIndex: -1,
          hint: ""
        }
      }
    }
  };

  const currentTopic = topicData[activeCategory] || topicData['system_design'];

  // AI phases states
  const [aiCoachPhase, setAiCoachPhase] = useState(1);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHintMsg, setShowHintMsg] = useState(false);
  const [isReqsCollapsed, setIsReqsCollapsed] = useState(false);
  const [isCoachCollapsed, setIsCoachCollapsed] = useState(false);

  const [expandedSections, setExpandedSections] = useState({
    generic: true,
    system_design: true,
    ai_agents: false,
    oop: false
  });
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [showHintCard, setShowHintCard] = useState(false);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getSuggestionsForCurrentPhase = () => {
    if (activeCategory === 'system_design') {
      if (aiCoachPhase === 1) return ["432 GB/day", "43.2 GB/day", "Show Math"];
      if (aiCoachPhase === 2) return ["NoSQL DB", "SQL Postgres", "Compare DBs"];
      if (aiCoachPhase === 3) return ["Redis LRU", "TTL Expiry", "Memcached"];
      if (aiCoachPhase === 4) return ["Kafka Buffer", "RabbitMQ Queue", "Explain Decoupling"];
    } else if (activeCategory === 'ood') {
      if (aiCoachPhase === 1) return ["Interfaces", "Composition", "Abstract Classes"];
      if (aiCoachPhase === 2) return ["Open-Closed (OCP)", "Single Resp (SRP)", "Explain SOLID"];
      if (aiCoachPhase === 3) return ["Singleton Pattern", "Factory Method", "Private Constructor"];
      if (aiCoachPhase === 4) return ["Mutex Locks", "Thread Sync", "Explain Race Condition"];
    } else if (activeCategory === 'dsa') {
      if (aiCoachPhase === 1) return ["O(1) Constant", "O(N) Linear", "Explain O(1)"];
      if (aiCoachPhase === 2) return ["Map + Doubly-LL", "Array Stack", "Explain Selection"];
      if (aiCoachPhase === 3) return ["Stitch Pointers", "Move to Head", "Explain Nodes"];
      if (aiCoachPhase === 4) return ["Evict Tail", "Delete key", "Capacity Check"];
    } else { // agentic_ai
      if (aiCoachPhase === 1) return ["Thought-Action-Obs", "ReAct Loop", "Loop Traversal"];
      if (aiCoachPhase === 2) return ["JSON Schema", "Type Safety", "Format Arguments"];
      if (aiCoachPhase === 3) return ["Max Iterations", "Execution Timeouts", "Token Guardrails"];
      if (aiCoachPhase === 4) return ["Prompt Sandbox", "Input Validation", "Filter Injections"];
    }
    return ["Tell me more", "Get Hint", "Next Phase"];
  };

  const submitSuggestion = (suggestionText) => {
    setChatMessages(prev => [...prev, { sender: 'user', text: suggestionText }]);
    
    setTimeout(() => {
      let currentPhaseSpec = currentTopic.phases[aiCoachPhase];
      const normalizedQuery = suggestionText.toLowerCase();

      // Check keywords
      const triggerMatched = currentPhaseSpec.triggers.some(t => normalizedQuery.includes(t));

      if (triggerMatched && aiCoachPhase < 5) {
        const nextPhase = aiCoachPhase + 1;
        setAiCoachPhase(nextPhase);
        setChatMessages(prev => [
          ...prev,
          { sender: 'ai', text: currentTopic.phases[nextPhase].question }
        ]);
        setHintsUsed(0);
        setShowHintMsg(false);
      } else {
        let guidance = "";
        if (activeCategory === 'ood') {
          guidance = aiCoachPhase === 1 ? "Think about Polymorphism vs Class hierarchies. How do interfaces decouple classes?" : "Think about Single Responsibility. How do we keep ParkingSystem free of Spot checking logic?";
        } else if (activeCategory === 'dsa') {
          guidance = aiCoachPhase === 1 ? "Constant time execution means operations resolve in O(1). How does it differ from array loops?" : "Doubly Linked List allows constant time deletions when combined with Hash Map. What is the role of pointers?";
        } else if (activeCategory === 'agentic_ai') {
          guidance = aiCoachPhase === 1 ? "Think about the acronym: Thought, Action, Observation. How does the agent structure loops?" : "JSON syntax constraints allow programmatic schema extracts. How do we define types?";
        } else {
          guidance = aiCoachPhase === 1 ? "Multiply TPS (10,000) by seconds in a day (86,400) by bytes (500) to find daily bytes." : "NoSQL handles writes horizontally; SQL requires replication schemas. Which fits?";
        }
        setChatMessages(prev => [...prev, { sender: 'ai', text: `🤖 AI Coach: ${guidance}` }]);
      }
    }, 800);
  };

  useEffect(() => {
    const handleGlobalClick = () => {
      DiagramStore.setState({ contextMenu: null, canvasContextMenu: null });
    };
    window.addEventListener('click', handleGlobalClick);
    return () => {
      window.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  // Whiteboard global states (single source of truth)
  const [storeState] = useDiagramStore();
  const nodes = storeState.nodes;
  const edges = storeState.edges;

  // Workspace sub-tabs
  const [centerTab, setCenterTab] = useState('diagram');
  const [codeContent, setCodeContent] = useState(currentTopic.defaultCode);
  const [specContent, setSpecContent] = useState(currentTopic.defaultSpec);
  const [evaluating, setEvaluating] = useState(false);
  const [evalResults, setEvalResults] = useState(null);

  // Chat conversation
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: `Welcome to the AI Coach room for: ${currentTopic.title}! I will guide you through this challenge.` },
    { sender: 'ai', text: currentTopic.phases[1].question }
  ]);
  const [chatInput, setChatInput] = useState('');

  const chatEndRef = useRef(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const [coachWidth, setCoachWidth] = useState(30); // 30% by default
  const isResizingRef = useRef(false);

  const resizePanel = useCallback((e) => {
    if (!isResizingRef.current) return;
    const totalWidth = window.innerWidth;
    const percentage = ((totalWidth - e.clientX) / totalWidth) * 100;
    if (percentage >= 15 && percentage <= 45) {
      setCoachWidth(percentage);
    }
  }, []);

  const stopResizing = useCallback(() => {
    isResizingRef.current = false;
    document.removeEventListener('mousemove', resizePanel);
    document.removeEventListener('mouseup', stopResizing);
  }, [resizePanel]);

  const startResizing = useCallback((e) => {
    e.preventDefault();
    isResizingRef.current = true;
    document.addEventListener('mousemove', resizePanel);
    document.addEventListener('mouseup', stopResizing);
  }, [resizePanel, stopResizing]);

  const calculateDetailedScore = useCallback((nodes, edges) => {
    const scorecard = {
      performance: { score: 50, strengths: [], risks: [], missing: [] },
      reliability: { score: 50, strengths: [], risks: [], missing: [] },
      scalability: { score: 50, strengths: [], risks: [], missing: [] },
      security: { score: 50, strengths: [], risks: [], missing: [] },
      maintainability: { score: 50, strengths: [], risks: [], missing: [] }
    };

    if (nodes.length === 0) {
      return {
        overall: 0,
        scorecard
      };
    }

    const hasLB = nodes.some(n => n.type === 'lb' || n.name.toLowerCase().includes('balancer') || n.name.toLowerCase().includes('lb'));
    const hasCache = nodes.some(n => n.type === 'cache' || n.name.toLowerCase().includes('cache') || n.name.toLowerCase().includes('redis'));
    const hasQueue = nodes.some(n => n.type === 'queue' || n.name.toLowerCase().includes('queue') || n.name.toLowerCase().includes('kafka') || n.name.toLowerCase().includes('buffer'));
    const hasGateway = nodes.some(n => n.type === 'gateway' || n.name.toLowerCase().includes('gateway') || n.name.toLowerCase().includes('proxy'));
    const hasCDN = nodes.some(n => n.type === 'cdn' || n.name.toLowerCase().includes('cdn') || n.name.toLowerCase().includes('cloudflare'));
    const serversCount = nodes.filter(n => n.type === 'server' || n.type === 'microservice' || n.name.toLowerCase().includes('server') || n.name.toLowerCase().includes('service')).length;
    const dbCount = nodes.filter(n => n.type === 'database' || n.name.toLowerCase().includes('db') || n.name.toLowerCase().includes('database') || n.name.toLowerCase().includes('postgres') || n.name.toLowerCase().includes('mysql')).length;
    const hasReplicas = dbCount >= 2 || nodes.some(n => n.name.toLowerCase().includes('replica') || n.name.toLowerCase().includes('standby') || n.name.toLowerCase().includes('slave'));

    let isClientDirectToDB = false;
    edges.forEach(edge => {
      const srcNode = nodes.find(n => n.id === edge.source);
      const destNode = nodes.find(n => n.id === edge.target);
      if (srcNode && destNode) {
        if ((srcNode.type === 'user' || srcNode.type === 'actor' || srcNode.type === 'client') && destNode.type === 'database') {
          isClientDirectToDB = true;
        }
      }
    });

    const disconnectedNodes = nodes.filter(n => !edges.some(e => e.source === n.id || e.target === n.id));

    if (storeState.activeMode === 'oop') {
      const hasInterface = nodes.some(n => n.type === 'interface' || n.name.toLowerCase().includes('interface') || n.name.toLowerCase().includes('contract'));
      const hasAbstract = nodes.some(n => n.type === 'abstract' || n.name.toLowerCase().includes('abstract') || n.name.toLowerCase().includes('template'));

      // Performance
      scorecard.performance.score = 80;
      scorecard.performance.strengths.push("✓ Standard class structures optimize runtime allocation");

      // Reliability
      scorecard.reliability.score = 75;
      scorecard.reliability.strengths.push("✓ Explicit separation of class state scopes");

      // Scalability
      scorecard.scalability.score = 60;
      if (hasAbstract) {
        scorecard.scalability.score += 30;
        scorecard.scalability.strengths.push("✓ Abstract template classes allow horizontal extensions");
      } else {
        scorecard.scalability.risks.push("⚠ Lacks abstract templates (classes are direct and static)");
        scorecard.scalability.missing.push("✗ Abstract Template Class");
      }

      // Security
      scorecard.security.score = 80;
      scorecard.security.strengths.push("✓ Class property visibility defaults to private");

      // Maintainability
      scorecard.maintainability.score = 50;
      if (hasInterface) {
        scorecard.maintainability.score += 40;
        scorecard.maintainability.strengths.push("✓ Interface usage respects Open-Closed Principle");
      } else {
        scorecard.maintainability.risks.push("⚠ Deep class coupling (no interface contracts found)");
        scorecard.maintainability.missing.push("✗ Decoupled Interface Contract");
      }
    } else if (storeState.activeMode === 'ai_agents') {
      const hasPlanner = nodes.some(n => n.type === 'planner' || n.name.toLowerCase().includes('planner') || n.name.toLowerCase().includes('router'));
      const hasTool = nodes.some(n => n.type === 'tool' || n.name.toLowerCase().includes('tool') || n.name.toLowerCase().includes('execution'));
      const hasMemory = nodes.some(n => n.type === 'memory' || n.name.toLowerCase().includes('memory') || n.name.toLowerCase().includes('brain') || n.name.toLowerCase().includes('kb'));

      // Performance
      scorecard.performance.score = 50;
      if (hasPlanner) {
        scorecard.performance.score += 30;
        scorecard.performance.strengths.push("✓ Router Planner handles query taxonomy classifications");
      } else {
        scorecard.performance.risks.push("⚠ Monolithic agent takes all tasks directly");
        scorecard.performance.missing.push("✗ Specialized Task Planner");
      }

      // Reliability
      scorecard.reliability.score = 50;
      if (hasMemory) {
        scorecard.reliability.score += 30;
        scorecard.reliability.strengths.push("✓ Conversational Memory persists state turns");
      } else {
        scorecard.reliability.risks.push("⚠ Stateless coordinator has no session history tracking");
        scorecard.reliability.missing.push("✗ Brain Memory");
      }

      // Scalability
      scorecard.scalability.score = 80;
      scorecard.scalability.strengths.push("✓ Agentic delegation pattern abstracts tool details");

      // Security
      scorecard.security.score = 55;
      if (hasTool) {
        scorecard.security.score += 35;
        scorecard.security.strengths.push("✓ Isolated execution tools block prompt-level root shell access");
      } else {
        scorecard.security.risks.push("⚠ Direct unstructured prompt execution");
      }

      // Maintainability
      scorecard.maintainability.score = 85;
      scorecard.maintainability.strengths.push("✓ Modular LLM cognitive loop pipeline layout");
    } else {
      // System Design
      // Performance
      scorecard.performance.score = 40;
      if (hasCache) {
        scorecard.performance.score += 25;
        scorecard.performance.strengths.push("✓ Redis cache handles hot read traffic (< 5ms latency)");
      } else {
        scorecard.performance.risks.push("⚠ Reads query database directly (saturates database threads)");
        scorecard.performance.missing.push("✗ Redis Memory Cache");
      }
      if (hasCDN) {
        scorecard.performance.score += 25;
        scorecard.performance.strengths.push("✓ CDN caches assets globally at the network edge");
      } else {
        scorecard.performance.risks.push("⚠ Clients request asset files from origin servers");
        scorecard.performance.missing.push("✗ Content Delivery Network (CDN)");
      }
      if (hasReplicas) {
        scorecard.performance.score += 10;
        scorecard.performance.strengths.push("✓ Primary-replica storage splits reads from writes");
      }

      // Reliability
      scorecard.reliability.score = 40;
      if (hasLB) {
        scorecard.reliability.score += 20;
        scorecard.reliability.strengths.push("✓ Load Balancer distributes queries to healthy server pools");
      } else {
        scorecard.reliability.risks.push("⚠ Entry traffic goes directly to single server instance");
        scorecard.reliability.missing.push("✗ Nginx/HAProxy Load Balancer");
      }
      if (serversCount >= 2) {
        scorecard.reliability.score += 20;
        scorecard.reliability.strengths.push("✓ Multiple backend App Server replicas configured");
      } else {
        scorecard.reliability.risks.push("⚠ App Server is a Single Point of Failure (no redundancy)");
      }
      if (hasReplicas) {
        scorecard.reliability.score += 20;
        scorecard.reliability.strengths.push("✓ Database failover standby replica present");
      } else {
        scorecard.reliability.risks.push("⚠ Main Database is a Single Point of Failure (no failover)");
        scorecard.reliability.missing.push("✗ Standby Database Replica");
      }

      // Scalability
      scorecard.scalability.score = 40;
      if (hasQueue) {
        scorecard.scalability.score += 30;
        scorecard.scalability.strengths.push("✓ Kafka message queue buffers writes asynchronously");
      } else {
        scorecard.scalability.risks.push("⚠ Write bursts are synchronous and might lock DB thread pools");
        scorecard.scalability.missing.push("✗ Kafka Message Queue");
      }
      if (hasLB) {
        scorecard.scalability.score += 30;
        scorecard.scalability.strengths.push("✓ Horizontal server scaling cluster enables high scale");
      }

      // Security
      scorecard.security.score = 50;
      if (hasGateway) {
        scorecard.security.score += 30;
        scorecard.security.strengths.push("✓ API Gateway filters traffic, auth, and DDoS rates");
      } else {
        scorecard.security.risks.push("⚠ Lacks unified API Gateway proxy handler");
        scorecard.security.missing.push("✗ Zuul/Kong API Gateway");
      }
      if (!isClientDirectToDB) {
        scorecard.security.score += 20;
        scorecard.security.strengths.push("✓ Storage is placed inside a private isolated subnet layer");
      } else {
        scorecard.security.risks.push("⚠ CRITICAL SECURITY: Clients route traffic directly to database");
      }

      // Maintainability
      scorecard.maintainability.score = 65;
      if (disconnectedNodes.length === 0) {
        scorecard.maintainability.score += 35;
        scorecard.maintainability.strengths.push("✓ Clean topology graph (no orphaned/disconnected nodes)");
      } else {
        scorecard.maintainability.risks.push(`⚠ Found ${disconnectedNodes.length} disconnected components on the whiteboard`);
        scorecard.maintainability.missing.push("✗ All Nodes connected to topology");
      }
    }

    const overall = Math.round(
      (scorecard.performance.score +
        scorecard.reliability.score +
        scorecard.scalability.score +
        scorecard.security.score +
        scorecard.maintainability.score) / 5
    );

    return {
      overall,
      scorecard
    };
  }, [storeState.activeMode]);

  // AI helper status ticker and analysis explanation text generators
  const getAICoPilotHUDText = () => {
    if (activeCategory === 'system_design') {
      if (aiCoachPhase === 1) return "Awaiting daily storage estimation math...";
      if (aiCoachPhase === 2) return "Evaluating SQL indexes vs NoSQL LSM models...";
      if (aiCoachPhase === 3) return "Monitoring Redis cache eviction parameters...";
      if (aiCoachPhase === 4) return "Validating Kafka queue resilience buffers...";
      return "AI review complete. Architecture ready.";
    } else if (activeCategory === 'ood') {
      if (aiCoachPhase === 1) return "Parsing classes vs interfaces structures...";
      if (aiCoachPhase === 2) return "Checking SOLID Open-Closed decoupling design...";
      if (aiCoachPhase === 3) return "Tracing Singleton controller instantiation scope...";
      if (aiCoachPhase === 4) return "Evaluating mutex locks for parking spot threads...";
      return "OOD AI milestones verified.";
    } else if (activeCategory === 'dsa') {
      if (aiCoachPhase === 1) return "Checking Big O bounds: O(1) time complexity target...";
      if (aiCoachPhase === 2) return "Verifying Map index with Doubly Linked List links...";
      if (aiCoachPhase === 3) return "Parsing head node pointer promoting assignments...";
      if (aiCoachPhase === 4) return "Validating tail node cache deletion triggers...";
      return "LRU Cache complexity rules validated.";
    } else { // agentic_ai
      if (aiCoachPhase === 1) return "Inspecting ReAct loop (Thought-Action-Observation)...";
      if (aiCoachPhase === 2) return "Analyzing tool execution JSON schemas...";
      if (aiCoachPhase === 3) return "Checking infinite loop timeouts and iter limits...";
      if (aiCoachPhase === 4) return "Verifying strict sandbox prompt injection filters...";
      return "Agentic router design checks passed.";
    }
  };

  // Explain Diagram / Code triggers
  const explainDiagramWithAI = () => {
    let feedback = "";
    if (activeCategory === 'system_design') {
      feedback = "🤖 AI Coach (Diagram Analysis): I see your System Design canvas. You have " + nodes.length + " components. A typical URL Shortener needs a Load Balancer at the entry point to distribute traffic to App Servers, and a Cache like Redis to shield the Database from 100K TPS read load. Is your traffic routed through the Cache before querying the SQL Database?";
    } else if (activeCategory === 'ood') {
      feedback = "🤖 AI Coach (Diagram Analysis): I see your Object-Oriented Parking Lot canvas. To adhere to SOLID principles, make sure the TicketPrinter or gates call the Level Manager interface rather than referencing the specific ParkingSpot class array directly. This decouples spot allocation logic.";
    } else if (activeCategory === 'dsa') {
      feedback = "🤖 AI Coach (Diagram Analysis): Looking at your LRU Cache structure. You have linked the Hash Table Index directly to the Double Linked Nodes. Remember that the Map holds pointers to the linked list nodes. When a node is accessed, we update pointers in O(1) time. How do you implement `prev` and `next` hooks on updates?";
    } else {
      feedback = "🤖 AI Coach (Diagram Analysis): I see your ReAct Agent pipeline. An input user query is classified by the Query Classifier, then routed to the Agent Engine. The agent loops through: Thought -> JSON Tool payload extraction -> Execution Sandbox -> Observation. How do you prevent loop lock if a tool sandbox times out?";
    }
    
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: "🔍 Requested AI Diagram Explanation" },
      { sender: 'ai', text: feedback }
    ]);
  };

  const explainCodeWithAI = () => {
    let feedback = "";
    if (activeCategory === 'system_design') {
      feedback = "🤖 AI Coach (Code Critique): Your database schema looks clean. Defining indexes on `created_at` or `short_key` is essential to keep reads under 20ms. However, do you think using SQL auto-incrementing integers as short keys is safe? What if an attacker downloads our entire DB sequential index?";
    } else if (activeCategory === 'ood') {
      feedback = "🤖 AI Coach (Code Critique): Your class modeling structure looks standard. To enforce OCP (Open-Closed Principle), keep spot sizes in an enum or configure fit conditions inside the Spot class itself. This way, adding a new vehicle type doesn't break the ParkingLot coordinate loop.";
    } else if (activeCategory === 'dsa') {
      feedback = "🤖 AI Coach (Code Critique): For your LRU Cache implementation, check that your `put` method evicts the tail node and deletes its key from the Map. Make sure that both Map updates and pointer stitching are executed inside a unified transaction to guarantee O(1) concurrency safety.";
    } else {
      feedback = "🤖 AI Coach (Code Critique): In your Python ReAct prompt, ensure that you parse agent observations in a structured try/except scope. If the LLM generates bad JSON for a tool action, a validation exception must trigger observation feedback so the model can auto-correct.";
    }

    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: "💻 Requested AI Code Critique" },
      { sender: 'ai', text: feedback }
    ]);
  };

  // Reset states when active category or currentProblem changes
  useEffect(() => {
    setSearchQuery('');
    let mode = 'system_design';
    if (activeCategory === 'dsa') mode = 'system_design';
    else if (activeCategory === 'ood') mode = 'oop';
    else if (activeCategory === 'agentic_ai') mode = 'ai_agents';

    const topic = topicData[activeCategory] || topicData['system_design'];

    DiagramStore.setMode(mode);

    // If currentProblem is present, load the predefined connected nodes/edges
    if (currentProblem) {
      const initialNodes = topic.initialNodes || [];
      const mappedEdges = (topic.initialEdges || []).map(e => ({
        id: `edge_${e.from}_${e.to}_${Math.random().toString(36).slice(2, 6)}`,
        source: e.from,
        target: e.to,
        sourceHandle: 'right-source',
        targetHandle: 'left-target'
      }));

      DiagramStore.setState({
        nodes: initialNodes,
        edges: mappedEdges,
        activeMode: mode,
        currentExerciseId: currentProblem.id ? String(currentProblem.id) : activeCategory
      });
    } else {
      // If currentProblem is null (e.g. sidebar icon clicked), load a completely blank canvas space!
      DiagramStore.setState({
        nodes: [],
        edges: [],
        activeMode: mode,
        currentExerciseId: null
      });
    }

    setAiCoachPhase(1);
    setHintsUsed(0);
    setShowHintMsg(false);
    setSelectedOption(null);
    setIsAnswerCorrect(null);
    setShowHintCard(false);
    setCodeContent(topic.defaultCode);
    setSpecContent(topic.defaultSpec);
    setEvalResults(null);
    setChatMessages([
      { sender: 'ai', text: `Welcome to the AI Coach room for: ${topic.title}! I will guide you through this challenge.` },
      { sender: 'ai', text: topic.phases[1].question }
    ]);
  }, [activeCategory, currentProblem]);

  // Synchronize activeCategory when currentExerciseId changes on the canvas
  useEffect(() => {
    const unsub = DiagramStore.subscribe((state) => {
      const exerciseId = state.currentExerciseId;
      if (exerciseId) {
        let targetCategory = null;
        if (exerciseId === 'url_shortener' || exerciseId === 'ecommerce' || exerciseId === 'blank') {
          targetCategory = 'system_design';
        } else if (exerciseId === 'parking_lot') {
          targetCategory = 'ood';
        } else if (exerciseId === 'chatgpt_agent') {
          targetCategory = 'agentic_ai';
        }
        
        if (targetCategory && targetCategory !== activeCategory && setActiveCategory) {
          setActiveCategory(targetCategory);
        }
      }
    });
    return unsub;
  }, [activeCategory, setActiveCategory]);

  // Monitor whiteboard nodes placement triggers
  useEffect(() => {
    const hasCache = nodes.some(n => n.type === 'cache');
    if (hasCache && aiCoachPhase === 3 && activeCategory === 'system_design') {
      setChatMessages(prev => [
        ...prev,
        { sender: 'ai', text: "🤖 AI Coach: I notice you added a Redis Cache to the canvas. How does this impact our read path? What policy handles memory eviction?" }
      ]);
    }
  }, [nodes.length]);
  
  // Whiteboard nodes listener is managed cleanly inside TldrawCanvas.jsx.



  const handleAddNodeGUI = (type, label, customPos = null) => {
    const mode = storeState.activeMode;
    let shapeConfig = null;
    for (const lib in ShapeRegistry) {
      if (ShapeRegistry[lib]?.[type]) {
        shapeConfig = ShapeRegistry[lib][type];
        break;
      }
    }
    shapeConfig = shapeConfig || {};
    
    const count = nodes.filter(n => n.type === type).length + 1;
    const labelText = `${shapeConfig.label || label} ${count}`;
    
    const newId = `node_${type}_${Date.now().toString().slice(-4)}`;
    const position = customPos || {
      x: 150 + Math.round(Math.random() * 150),
      y: 150 + Math.round(Math.random() * 150)
    };
    
    const newNode = {
      id: newId,
      type,
      name: labelText,
      position,
      x: position.x,
      y: position.y,
      color: shapeConfig.color || '#3b82f6',
      properties: { ...shapeConfig.properties } || {},
      metadata: {
        createdAt: Date.now(),
        mode
      }
    };
    DiagramStore.addNode(newNode);
  };

  const handleAskAIToExplain = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const mode = storeState.activeMode;
    let chatResponse = "";

    if (mode === 'system_design') {
      const typeExMap = {
        user: "Client User ingress. Renders client-side views and makes API calls over HTTP/HTTPS.",
        lb: "Load Balancer. Orchestrates incoming network traffic, distributing HAProxy/NGINX requests across server clusters to avoid service single point of failure.",
        gateway: "API Gateway. Serves as a single entry proxy for security, rate-limiting, CORS, and request forwarding.",
        server: "Application Server. Runs backend controllers and middleware logic, validating JSON parameters and interfacing with cache and storage pools.",
        cache: "Redis Cache. Keeps hot key-value records in RAM for fast (sub-5ms) reads to offload heavy SQL lookups.",
        queue: "Message Queue (Kafka). Decouples API write handlers from DB storage, buffering bursts asynchronously.",
        database: "Relational DB. Acts as the primary transactional storage (ACID) with indexed schemas.",
        cdn: "Content Delivery Network (CDN). Proxy edge caching of static assets (images, static html) for fast global deliveries.",
        storage: "Object Storage (S3). Durably stores binary static media (e.g. photos, zip uploads, backups).",
        microservice: "Microservice. Isolated application service handling a specific bounded business domain context.",
        triangle: "Triangle Node. Generic visual indicator shape.",
        actor: "Actor Ingress. Denotes external client human trigger agent.",
        swimlane: "Swimlane Boundary. Denotes logical organizational boundaries.",
        decision: "Decision block. Denotes routing checks based on variables."
      };
      chatResponse = `🤖 AI Coach: **${node.name}** (${node.type.toUpperCase()}) explanation:\n` + (typeExMap[node.type] || "Cloud topology system element. Configured with: " + JSON.stringify(node.properties || {}));
    } else if (mode === 'ai_agents') {
      const typeExMap = {
        user: "User Prompt Ingress. Feeds the system prompts and queries initiating agentic workflows.",
        agent: "Agent Coordinator. Evaluates reasoning graphs, orchestrating loops and routing outputs to tools or users.",
        planner: "Task Planner. Breaks down large objectives into smaller sub-queries or linear DAG task paths.",
        tool: "Execution Tool. Permits agent code execution (e.g. API client, local shell, code runtime).",
        memory: "Brain Memory. Retains conversation history and session states across reasoning intervals.",
        llm: "LLM Reasoning Core. Generates structured thoughts and extracts functional tool calls.",
        kb: "Semantic Knowledge Base. Vector store (e.g. Pinecone) containing indexed chunks for RAG searches.",
        router: "Agent Router. Dynamically decides query routing target based on prompt intent."
      };
      chatResponse = `🤖 AI Coach: **${node.name}** agentic node explanation:\n` + (typeExMap[node.type] || "AI Orchestrator workflow element.");
    } else if (mode === 'oop') {
      const typeExMap = {
        class: "Concrete Class blueprint. Holds class fields/attributes and method implementations.",
        interface: "Interface definition. Declares signatures forming decoupling contracts without inner implementations.",
        abstract: "Abstract Class. Serves as a template for inheritance, holding partial logic.",
        object: "Instance Object. Allocated instance in memory representing concrete data properties.",
        package: "Package namespace. Groups classes and types logically to manage code scopes."
      };
      chatResponse = `🤖 AI Coach: **${node.name}** OOP blueprint explanation:\n` + (typeExMap[node.type] || "Object-oriented design entity.");
    }

    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: `Ask AI to Explain: ${node.name}` },
      { sender: 'ai', text: chatResponse }
    ]);
  };

  const handleAskAIToImprove = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const mode = storeState.activeMode;
    let chatResponse = "";

    if (mode === 'system_design') {
      if (node.type === 'database') {
        chatResponse = `🤖 AI Coach: To improve **${node.name}** (${node.properties?.technology || 'Database'}), configure a primary-replica cluster to split read/write traffic. Add indexes on query fields and enable connection pooling (e.g. PgBouncer) to handle client surges.`;
      } else if (node.type === 'cache') {
        chatResponse = `🤖 AI Coach: For **${node.name}**, configure Redis LRU eviction policies (\`maxmemory-policy allkeys-lru\`) to prevent memory exhaustion, and set cache TTLs to avoid stale data reads.`;
      } else if (node.type === 'server' || node.type === 'microservice') {
        chatResponse = `🤖 AI Coach: Enhance **${node.name}** reliability by enabling horizontal autoscaling (HPA), introducing health check endpoints (/healthz), and configuring load balancers to route traffic away from failing servers.`;
      } else if (node.type === 'queue') {
        chatResponse = `🤖 AI Coach: To improve **${node.name}**, partition your topics (e.g. Kafka partitions) to enable parallel consumption, and define dead letter queues (DLQ) to handle malformed message streams safely.`;
      } else {
        chatResponse = `🤖 AI Coach: For **${node.name}**, check if rate limiting is enabled at the gateway and enforce retry backoff limits to prevent cascading outages.`;
      }
    } else if (mode === 'ai_agents') {
      if (node.type === 'agent') {
        chatResponse = `🤖 AI Coach: To protect **${node.name}**, set a loop limit threshold (e.g. max_iterations=10) to guard against runaway hallucination loops. Always sand-box python_repl execution and parse JSON schemas with strict validation.`;
      } else if (node.type === 'llm') {
        chatResponse = `🤖 AI Coach: Improve **${node.name}** queries by implementing structured JSON schemas (JSON Mode or tool calling). Ensure prompt directives include system guardrails to prevent instruction overrides.`;
      } else {
        chatResponse = `🤖 AI Coach: To optimize **${node.name}**, implement memory pagination to reduce LLM context window pressure, and prune historical agent steps regularly.`;
      }
    } else if (mode === 'oop') {
      if (node.type === 'class') {
        chatResponse = `🤖 AI Coach: To improve **${node.name}**, apply the Single Responsibility Principle (SRP) by moving external data helpers to a utility class, and favor composition over deep inheritance hierarchy maps.`;
      } else if (node.type === 'interface') {
        chatResponse = `🤖 AI Coach: Adhere to Interface Segregation by breaking **${node.name}** into smaller, decoupled contracts so implementations are not forced to define unused methods.`;
      } else {
        chatResponse = `🤖 AI Coach: Protect class state by enforcing strict private attribute scope and using read-only getters where applicable.`;
      }
    }

    if (chatResponse) {
      setChatMessages(prev => [
        ...prev,
        { sender: 'user', text: `Ask AI to Improve: ${node.name}` },
        { sender: 'ai', text: chatResponse }
      ]);
    }
  };

  const handleAskAIBestPractices = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const mode = storeState.activeMode;
    let chatResponse = "";

    if (mode === 'system_design') {
      const bestPracticesMap = {
        database: "Best practices for Databases:\n1. Split read and write traffic with Primary-Replica nodes.\n2. Define composite index scopes on key search fields.\n3. Implement transaction isolation scopes (ACID) and configure connection pooling (PgBouncer).",
        cache: "Best practices for Caching:\n1. Configure eviction thresholds strictly (e.g. volatile-lru).\n2. Set TTLs (Time-To-Live) to avoid stale read values.\n3. Buffer cache stampede risks using Mutex locks.",
        server: "Best practices for Application Servers:\n1. Make server stateless to allow horizontal autoscaling (HPA).\n2. Introduce health check status queries (/healthz).\n3. Keep connection pools bounded and recycle handles.",
        queue: "Best practices for Message Queues:\n1. Structure message payloads using strict schemas (e.g. Avro).\n2. Define Dead Letter Queues (DLQ) to route corrupted bytes.\n3. Scale partition counts to support multiple consumers."
      };
      chatResponse = bestPracticesMap[node.type] || `Best practices for ${node.name}:\n1. Bounded failure containment: introduce circuit breakers.\n2. Decouple components with structured APIs.`;
    } else if (mode === 'ai_agents') {
      chatResponse = `Best practices for **${node.name}**:\n1. Set loops execution timeout limits.\n2. Enforce strict JSON schemas parsing (Pydantic / Structured Outputs).\n3. Guard against prompt injection using secure sandboxing.`;
    } else {
      chatResponse = `Best practices for **${node.name}**:\n1. Favor composition over deep class inheritance hierarchies.\n2. Keep interface signatures small (Interface Segregation).\n3. Encapsulate mutable values with read-only getters.`;
    }

    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: `Ask AI for Best Practices: ${node.name}` },
      { sender: 'ai', text: `🤖 AI Coach (Best Practices):\n${chatResponse}` }
    ]);
  };

  const handleFindBottlenecks = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const mode = storeState.activeMode;
    let chatResponse = "";

    if (mode === 'system_design') {
      if (node.type === 'database') {
        const hasCache = nodes.some(n => n.type === 'cache');
        chatResponse = hasCache 
          ? `Analysis for **${node.name}**: A Redis cache is present, which offloads read spikes. Ensure that indexes exist on search fields to avoid full table scans.`
          : `Analysis for **${node.name}**: ⚠️ CRITICAL BOTTLENECK. Incoming client traffic queries this database directly. Under high TPS spikes, database connection pools will saturate. Place a Redis cache to absorb reads.`;
      } else if (node.type === 'server') {
        const hasLB = nodes.some(n => n.type === 'lb');
        chatResponse = hasLB 
          ? `Analysis for **${node.name}**: Load balancer distributes queries. Verify that server node states are externalized to prevent session loss on container restarts.`
          : `Analysis for **${node.name}**: ⚠️ Single Point of Failure (SPoF). Incoming traffic hits a single app instance. Place a Load Balancer to route across multiple server replicas.`;
      } else {
        chatResponse = `Analysis for **${node.name}**: Check for buffer bottlenecks. Ensure connections to databases use timeouts to prevent thread lock propagation.`;
      }
    } else if (mode === 'ai_agents') {
      chatResponse = `Analysis for **${node.name}**: Cognitive loops might experience latency stalls if LLM timeouts are not configured, or prompt tokens might overflow if historical steps are not compressed regularly.`;
    } else {
      chatResponse = `Analysis for **${node.name}**: Thread race conditions can occur if multiple controller instances query and update the same instance state concurrently without synchronization locks.`;
    }

    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: `Find Bottlenecks for: ${node.name}` },
      { sender: 'ai', text: `🤖 AI Coach (Bottleneck Report):\n${chatResponse}` }
    ]);
  };

  const handleGenerateNeighbors = (nodeId) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    const mode = storeState.activeMode;
    let newNodes = [];
    let newEdges = [];
    let chatResponse = "";

    if (mode === 'system_design') {
      if (node.type === 'user') {
        const lbId = `node_lb_${Date.now().toString().slice(-4)}`;
        newNodes.push({
          id: lbId,
          type: 'lb',
          name: 'Load Balancer',
          x: node.x + 220,
          y: node.y,
          color: '#7c3aed',
          properties: { description: 'Traffic distribution layer', technology: 'NGINX / HAProxy', algorithm: 'Round Robin' }
        });
        newEdges.push({
          id: `edge_${Date.now().toString().slice(-4)}_1`,
          source: node.id,
          target: lbId,
          sourceHandle: 'right-source',
          targetHandle: 'left-target'
        });
        chatResponse = `🤖 AI Coach: Generated a **Load Balancer** connected to **${node.name}** to handle client request routing.`;
      } else if (node.type === 'lb') {
        const serverId = `node_server_${Date.now().toString().slice(-4)}`;
        newNodes.push({
          id: serverId,
          type: 'server',
          name: 'App Service',
          x: node.x + 220,
          y: node.y,
          color: '#2563eb',
          properties: { description: 'Core backend microservice logic', technology: 'NodeJS / Go', replicas: '3' }
        });
        newEdges.push({
          id: `edge_${Date.now().toString().slice(-4)}_2`,
          source: node.id,
          target: serverId,
          sourceHandle: 'right-source',
          targetHandle: 'left-target'
        });
        chatResponse = `🤖 AI Coach: Generated an **App Service** node connected to **${node.name}** for application processing.`;
      } else if (node.type === 'server') {
        const cacheId = `node_cache_${Date.now().toString().slice(-4)}`;
        const dbId = `node_database_${Date.now().toString().slice(-4)}`;
        newNodes.push(
          {
            id: cacheId,
            type: 'cache',
            name: 'Redis Cache',
            x: node.x + 220,
            y: node.y - 70,
            color: '#d97706',
            properties: { description: 'In-memory database cache', technology: 'Redis', capacity: '16GB' }
          },
          {
            id: dbId,
            type: 'database',
            name: 'PostgreSQL DB',
            x: node.x + 220,
            y: node.y + 70,
            color: '#dc2626',
            properties: { description: 'Relational persistence storage', technology: 'PostgreSQL', replication: 'Primary-Replica' }
          }
        );
        newEdges.push(
          {
            id: `edge_${Date.now().toString().slice(-4)}_3`,
            source: node.id,
            target: cacheId,
            sourceHandle: 'right-source',
            targetHandle: 'left-target'
          },
          {
            id: `edge_${Date.now().toString().slice(-4)}_4`,
            source: node.id,
            target: dbId,
            sourceHandle: 'right-source',
            targetHandle: 'left-target'
          }
        );
        chatResponse = `🤖 AI Coach: Generated a **Redis Cache** (to shield read load) and a **PostgreSQL Database** (persistent store) connected to **${node.name}**.`;
      } else if (node.type === 'database') {
        const cacheId = `node_cache_${Date.now().toString().slice(-4)}`;
        newNodes.push({
          id: cacheId,
          type: 'cache',
          name: 'Redis Cache',
          x: node.x - 220,
          y: node.y,
          color: '#d97706',
          properties: { description: 'In-memory database cache', technology: 'Redis', capacity: '16GB' }
        });
        newEdges.push({
          id: `edge_${Date.now().toString().slice(-4)}_5`,
          source: cacheId,
          target: node.id,
          sourceHandle: 'right-source',
          targetHandle: 'left-target'
        });
        chatResponse = `🤖 AI Coach: Generated a **Redis Cache** preceding **${node.name}** to mitigate database queries.`;
      } else {
        chatResponse = `🤖 AI Coach: I recommend adding a client request user or cache to optimize ${node.name}.`;
      }
    } else if (mode === 'ai_agents') {
      if (node.type === 'user') {
        const agentId = `node_agent_${Date.now().toString().slice(-4)}`;
        newNodes.push({
          id: agentId,
          type: 'agent',
          name: 'Agent Coordinator',
          x: node.x + 220,
          y: node.y,
          color: '#7c3aed',
          properties: { description: 'Autonomous orchestration loop', modelType: 'Claude 3.5 Sonnet', parameters: 'Temp=0.2' }
        });
        newEdges.push({
          id: `edge_${Date.now().toString().slice(-4)}_6`,
          source: node.id,
          target: agentId,
          sourceHandle: 'right-source',
          targetHandle: 'left-target'
        });
        chatResponse = `🤖 AI Coach: Spawned an **Agent Coordinator** to orchestrate LLM requests from **${node.name}**.`;
      } else if (node.type === 'agent') {
        const plannerId = `node_planner_${Date.now().toString().slice(-4)}`;
        const llmId = `node_llm_${Date.now().toString().slice(-4)}`;
        newNodes.push(
          {
            id: plannerId,
            type: 'planner',
            name: 'Router Planner',
            x: node.x + 220,
            y: node.y - 70,
            color: '#ec4899',
            properties: { description: 'Deconstructs query into task graphs', strategy: 'Tree-of-Thoughts' }
          },
          {
            id: llmId,
            type: 'llm',
            name: 'LLM Engine',
            x: node.x + 220,
            y: node.y + 70,
            color: '#dc2626',
            properties: { description: 'Cognitive reasoning core', modelType: 'GPT-4o', promptNotes: 'Follow strict ReAct JSON output formats' }
          }
        );
        newEdges.push(
          {
            id: `edge_${Date.now().toString().slice(-4)}_7`,
            source: node.id,
            target: plannerId,
            sourceHandle: 'right-source',
            targetHandle: 'left-target'
          },
          {
            id: `edge_${Date.now().toString().slice(-4)}_8`,
            source: node.id,
            target: llmId,
            sourceHandle: 'right-source',
            targetHandle: 'left-target'
          }
        );
        chatResponse = `🤖 AI Coach: Spawned a **Router Planner** (to structure tasks) and an **LLM Engine** (reasoning brain) connected to **${node.name}**.`;
      } else if (node.type === 'llm') {
        const kbId = `node_kb_${Date.now().toString().slice(-4)}`;
        newNodes.push({
          id: kbId,
          type: 'kb',
          name: 'Knowledge Base',
          x: node.x + 220,
          y: node.y,
          color: '#0891b2',
          properties: { description: 'Semantic vector document index', technology: 'Pinecone / pgvector' }
        });
        newEdges.push({
          id: `edge_${Date.now().toString().slice(-4)}_9`,
          source: node.id,
          target: kbId,
          sourceHandle: 'right-source',
          targetHandle: 'left-target'
        });
        chatResponse = `🤖 AI Coach: Spawned a vector **Knowledge Base** connected to **${node.name}** for RAG semantics lookup.`;
      } else {
        chatResponse = `🤖 AI Coach: Suggested placing memory or tools next to **${node.name}** for persistent loops.`;
      }
    } else if (mode === 'oop') {
      if (node.type === 'interface') {
        const classId = `node_class_${Date.now().toString().slice(-4)}`;
        newNodes.push({
          id: classId,
          type: 'class',
          name: 'Concrete Class',
          x: node.x + 220,
          y: node.y,
          color: '#2563eb',
          properties: { description: 'Object blueprint implementation', className: 'ConcreteImpl', attributes: [], methods: [] }
        });
        newEdges.push({
          id: `edge_${Date.now().toString().slice(-4)}_10`,
          source: node.id,
          target: classId,
          sourceHandle: 'right-source',
          targetHandle: 'left-target'
        });
        chatResponse = `🤖 AI Coach: Generated a **Concrete Class** implementing the **${node.name}** interface contract.`;
      } else if (node.type === 'class') {
        const objectId = `node_object_${Date.now().toString().slice(-4)}`;
        newNodes.push({
          id: objectId,
          type: 'object',
          name: 'Class Instance',
          x: node.x + 220,
          y: node.y,
          color: '#4b5563',
          properties: { description: 'Runtime instance allocation', className: 'myInstance', state: '' }
        });
        newEdges.push({
          id: `edge_${Date.now().toString().slice(-4)}_11`,
          source: node.id,
          target: objectId,
          sourceHandle: 'right-source',
          targetHandle: 'left-target'
        });
        chatResponse = `🤖 AI Coach: Generated a runtime **Class Instance** allocated from the **${node.name}** blueprint.`;
      } else {
        chatResponse = `🤖 AI Coach: Try nesting **${node.name}** inside a package namespace.`;
      }
    }

    if (newNodes.length > 0) {
      newNodes.forEach(nn => {
        let shapeConfig = null;
        for (const lib in ShapeRegistry) {
          if (ShapeRegistry[lib]?.[nn.type]) {
            shapeConfig = ShapeRegistry[lib][nn.type];
            break;
          }
        }
        DiagramStore.addNode({
          ...nn,
          x: nn.x,
          y: nn.y,
          position: { x: nn.x, y: nn.y },
          properties: nn.properties || { ...(shapeConfig?.properties || {}) },
          metadata: { createdAt: Date.now(), mode }
        });
      });
      newEdges.forEach(ne => DiagramStore.addEdge(ne));

      setTimeout(() => {
        AutoLayoutEngine.triggerAutoLayout();
      }, 120);
    }

    if (chatResponse) {
      setChatMessages(prev => [
        ...prev,
        { sender: 'user', text: `Ask AI to Generate Neighbors for: ${node.name}` },
        { sender: 'ai', text: chatResponse }
      ]);
    }
  };

  const triggerAutoLayout = () => {
    AutoLayoutEngine.triggerAutoLayout();
  };

  // AI Chat submissions parser
  const handleChatSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput;
    setChatInput('');
    submitSuggestion(userText);
  };

  const handleSuggestionClick = (queryText) => {
    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: queryText }
    ]);

    setTimeout(() => {
      let aiResponse = "";
      const lower = queryText.toLowerCase();
      const activePhase = currentTopic.phases[aiCoachPhase];

      if (lower.includes('hint')) {
        aiResponse = `💡 AI Coach Hint:\n${activePhase?.hint || "Review your diagram design and ensure your components are fully linked in a correct logical path."}`;
      } else if (lower.includes('flowchart')) {
        const flowchart = generateAILogicalViewText(nodes, edges, activeCategory);
        aiResponse = `📋 AI Coach Flowchart Review:\nHere is your current active category data flow:\n\n${flowchart}\n\nReview the connection order. Check if data routes from ingress client nodes, through API gateways or load balancers, down to caching tiers and storage targets.`;
      } else if (lower.includes('bottlenecks')) {
        const hasLB = nodes.some(n => n.type === 'lb' || n.name.toLowerCase().includes('balancer') || n.name.toLowerCase().includes('lb'));
        const hasCache = nodes.some(n => n.type === 'cache' || n.name.toLowerCase().includes('cache') || n.name.toLowerCase().includes('redis'));
        if (activeCategory === 'system_design') {
          if (!hasLB) {
            aiResponse = `⚡ AI Coach Bottleneck Analysis:\n- **No Load Balancer**: Single point of failure! All client requests route directly to a single App Server node. Under 100K reads/sec, this triggers server crash.\n- **Recommendation**: Place an API Gateway or Load Balancer tier preceding App Server nodes.`;
          } else if (!hasCache) {
            aiResponse = `⚡ AI Coach Bottleneck Analysis:\n- **Missing Cache Layer**: Database queries fetch directly from storage disk logs. Read spikes will block transactional database pools.\n- **Recommendation**: Deploy an in-memory Redis Cache shield.`;
          } else {
            aiResponse = `⚡ AI Coach Bottleneck Analysis:\n- Topology design looks clean and correctly partitioned! Ensure DB indices are configured on short key lookup values.`;
          }
        } else if (activeCategory === 'ood') {
          aiResponse = `⚡ AI Coach Bottleneck Analysis:\n- Check that gate or printer elements communicate via interface contracts (e.g. IVehicle) rather than concrete classes (e.g. Car, Truck). Deep class inheritance triggers Open-Closed SOLID design bottlenecks.`;
        } else {
          aiResponse = `⚡ AI Coach Bottleneck Analysis:\n- Verify tool execution triggers are sandboxed. Restrict reasoning sequences to prevent runaway iteration loops by configuring max iterations counter.`;
        }
      } else { // best practices
        if (activeCategory === 'system_design') {
          aiResponse = `📐 AI Coach Best Practices:\n1. Split read and write workloads using CQRS patterns.\n2. Evict cache nodes via LRU policies to avoid memory growth crashes.\n3. Buffer write traffic surges asynchronously in distributed Kafka queues.`;
        } else if (activeCategory === 'ood') {
          aiResponse = `📐 AI Coach Best Practices:\n1. Adhere to Open-Closed Principle (extend code without modifying core coordinate classes).\n2. Enforce strict private scope encapsulation on vehicle and spot properties.\n3. Favor composition patterns over deep class inheritance hierarchies.`;
        } else {
          aiResponse = `📐 AI Coach Best Practices:\n1. Structure prompt expectations via validation JSON schemas.\n2. Sandbox execution environments to prevent instruction overrides.\n3. Keep context window footprint small by pruning historical LLM memory keys.`;
        }
      }

      setChatMessages(prev => [
        ...prev,
        { sender: 'ai', text: aiResponse }
      ]);
    }, 800);
  };

  // Run final score analysis
  const runEvaluation = () => {
    setEvaluating(true);
    setEvalResults(null);
    setTimeout(() => {
      setEvaluating(false);

      const calculated = calculateDetailedScore(nodes, edges);
      const scorecard = calculated.scorecard;

      const hasCache = nodes.some(n => n.type === 'cache' || n.name.toLowerCase().includes('cache') || n.name.toLowerCase().includes('redis'));
      const hasLB = nodes.some(n => n.type === 'lb' || n.name.toLowerCase().includes('balancer') || n.name.toLowerCase().includes('lb'));
      const dbCount = nodes.filter(n => n.type === 'database' || n.name.toLowerCase().includes('db') || n.name.toLowerCase().includes('database') || n.name.toLowerCase().includes('postgres') || n.name.toLowerCase().includes('mysql')).length;

      setEvalResults({
        score: calculated.overall,
        scores: scorecard,
        latency: hasCache ? "8ms" : "85ms",
        availability: hasLB ? (dbCount > 1 ? "99.99%" : "99.9%") : "99.0%"
      });
    }, 1200);
  };

  return (
    <div className="flex h-screen bg-[#0e1320] text-slate-100 overflow-hidden">
      {/* Sidebar navigation */}
      {sidebarComponent}

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col h-full pl-16 overflow-hidden">
        
        {/* Header bar */}
        <header className="h-14 border-b border-slate-900/60 bg-[#090d16] flex items-center justify-between px-4">
          <div className="flex items-center space-x-3 text-left">
            <span className="text-xs font-black text-white bg-slate-900 border border-slate-800 px-2 py-0.5 rounded uppercase tracking-wider font-mono">
              {activeCategory.replace('_', ' ')}
            </span>
            <div className="w-px h-6 bg-slate-800" />
            <div>
              <span className="text-sm font-extrabold text-white flex items-center space-x-2">
                <span>{currentTopic.title}</span>
              </span>
            </div>

            {/* Live AI Status HUD ticker */}
            <div className="hidden md:flex items-center space-x-2 bg-slate-950 border border-slate-900 rounded-full py-1 px-3 ml-4">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                AI Coach HUD: <span className="text-emerald-400 font-bold">{getAICoPilotHUDText()}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* AI Coach level badge ONLY visible after evaluation scores are triggered */}
            {evalResults && (
              <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg font-mono">
                AI Coach Level: Phase {aiCoachPhase}/4
              </span>
            )}
            <button
              onClick={runEvaluation}
              disabled={evaluating}
              className="flex items-center space-x-1.5 py-1.5 px-3.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer shadow shadow-violet-500/10"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{evaluating ? 'Analyzing...' : 'Analyze Design'}</span>
            </button>
          </div>
        </header>

        {/* Triple Panel grids */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
          
          {/* Column 1: Simplified Requirements Context (Left 25%) */}
          {isReqsCollapsed ? (
            <div className="w-12 border-r border-slate-900 bg-slate-950 flex flex-col items-center py-4 space-y-4 shrink-0 transition-all duration-300">
              <button 
                onClick={() => setIsReqsCollapsed(false)} 
                className="p-1.5 rounded hover:bg-slate-900 border border-slate-800 text-violet-400 cursor-pointer"
                title="Expand Requirements"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="flex-grow flex items-center justify-center">
                <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono text-slate-500 whitespace-nowrap rotate-90 select-none">
                  Requirements
                </span>
              </div>
            </div>
          ) : (
            <div className="w-full lg:w-1/4 border-b lg:border-b-0 lg:border-r border-slate-900 bg-[#070b13]/80 flex flex-col h-1/3 lg:h-full overflow-hidden text-left shadow-md transition-all duration-300 relative shrink-0">
              <div className="flex justify-between items-center border-b border-slate-900 bg-slate-950 text-xs py-3.5 px-4 font-bold text-slate-355 tracking-wide uppercase font-mono">
                <span>Requirements</span>
                <button 
                  onClick={() => setIsReqsCollapsed(true)} 
                  className="p-1 rounded hover:bg-slate-900 text-slate-500 hover:text-slate-300 cursor-pointer transition-colors"
                  title="Collapse Panel"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
                {/* Problem Brief */}
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-400 uppercase text-[9px] font-mono tracking-wider">Problem Brief</h4>
                  <p className="text-slate-300 leading-relaxed font-medium">{currentTopic.problemStatement}</p>
                </div>

                {/* Focus Area / AI Coach Objective */}
                <div className="pt-4 border-t border-slate-900 space-y-2">
                  <h4 className="font-bold text-slate-400 uppercase text-[9px] font-mono tracking-wider">Active Objective</h4>
                  <div className="p-3.5 bg-violet-950/20 border border-violet-900/35 rounded-xl space-y-1.5">
                    <div className="text-[9px] text-violet-400 font-bold uppercase tracking-wider font-mono">
                      {currentTopic.phases[aiCoachPhase].name}
                    </div>
                    <p className="text-slate-200 font-semibold text-[10.5px]">
                      Goal: {currentTopic.phases[aiCoachPhase].goal}
                    </p>
                  </div>
                </div>

                {/* AI Coach Goal info text */}
                <p className="text-[10px] text-slate-500 leading-relaxed italic pt-2">
                  Chat with the AI Coach on the right pane to answer questions and unlock design validation milestones.
                </p>
              </div>
            </div>
          )}

          {/* Column 2: Visual Canvas & Text DSL Editor (Center 45% -> Resizes dynamically) */}
          <div className="w-full lg:flex-1 border-b lg:border-b-0 lg:border-r border-slate-900 flex flex-col h-1/3 lg:h-full overflow-hidden text-left bg-[#0e1320] transition-all duration-300">
            <div className="flex border-b border-slate-900 bg-[#090d16] text-xs shrink-0">
              <button 
                onClick={() => setCenterTab('diagram')} 
                className={`flex-grow py-3 text-center border-b font-semibold transition-colors ${centerTab === 'diagram' ? 'border-violet-500 text-violet-400 bg-slate-900/20' : 'border-transparent text-slate-500 hover:text-slate-350'}`}
              >
                Canvas Editor
              </button>
              <button 
                onClick={() => setCenterTab('json')} 
                className={`flex-grow py-3 text-center border-b font-semibold transition-colors ${centerTab === 'json' ? 'border-violet-500 text-violet-400 bg-slate-900/20' : 'border-transparent text-slate-500 hover:text-slate-350'}`}
              >
                JSON Schema
              </button>
              <button 
                onClick={() => setCenterTab('dsl')} 
                className={`flex-grow py-3 text-center border-b font-semibold transition-colors ${centerTab === 'dsl' ? 'border-violet-500 text-violet-400 bg-slate-900/20' : 'border-transparent text-slate-500 hover:text-slate-350'}`}
              >
                Logical Flowchart
              </button>
              <button 
                onClick={() => setCenterTab('code')} 
                className={`flex-grow py-3 text-center border-b font-semibold transition-colors ${centerTab === 'code' ? 'border-violet-500 text-violet-400 bg-slate-900/20' : 'border-transparent text-slate-500 hover:text-slate-350'}`}
              >
                Code draft
              </button>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden relative min-h-0">
              {centerTab === 'diagram' && (
                <div className="flex-1 flex flex-col overflow-hidden min-h-0 relative">
                  {/* Toolbar */}
                  <div className="p-2 border-b border-slate-900/60 bg-[#090d16] flex flex-wrap gap-2 items-center shrink-0 animate-fade-in">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider font-mono mr-2">
                      {ModeManager.getModeConfig(storeState.activeMode).title}
                    </span>
                    <div className="ml-auto flex items-center space-x-3">
                      {/* Layout Mode Segmented Control */}
                      <div className="flex items-center bg-[#070b13] border border-slate-850 rounded-lg p-0.5 space-x-0.5">
                        {[
                          { key: 'smart', label: 'Smart Layout' },
                          { key: 'horizontal', label: 'Horizontal' },
                          { key: 'vertical', label: 'Vertical' }
                        ].map(l => (
                          <button
                            key={l.key}
                            onClick={() => {
                              DiagramStore.setState({ layoutMode: l.key });
                              // Auto trigger layout align
                              setTimeout(() => AutoLayoutEngine.triggerAutoLayout(), 50);
                            }}
                            className={`px-2.5 py-1 rounded-md text-[9px] font-bold tracking-wide transition-all cursor-pointer ${
                              (storeState.layoutMode || 'smart') === l.key 
                                ? 'bg-violet-650 text-white shadow-sm' 
                                : 'text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {l.label}
                          </button>
                        ))}
                      </div>

                      <button 
                        onClick={triggerAutoLayout}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 hover:border-slate-600 transition-colors font-bold cursor-pointer animate-fade-in"
                        title="Align nodes using selected layout rules"
                      >
                        <RefreshCw className="w-3 h-3 text-violet-400 animate-spin-slow" />
                        <span>Auto Align Layout</span>
                      </button>
                      <button 
                        onClick={explainDiagramWithAI}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded bg-violet-650 hover:bg-violet-600 text-[10px] text-white transition-colors font-bold cursor-pointer"
                        title="Explain diagram architecture with AI Coach"
                      >
                        <Sparkles className="w-3 h-3 text-cyan-300" />
                        <span>Explain Diagram</span>
                      </button>
                    </div>
                  </div>

                  {/* Left Palette & Right Canvas Box */}
                  <div className="flex-1 flex overflow-hidden min-h-0 relative">
                    {/* Left Sidebar Palette with Collapsible Accordions */}
                    <div className="w-44 border-r border-slate-900 bg-[#070b13] flex flex-col text-left shrink-0 overflow-hidden">
                      <div className="p-2 border-b border-slate-900/60 shrink-0">
                        <input
                          type="text"
                          placeholder="Search shapes..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-[#090d16] border border-slate-850 rounded-lg px-2.5 py-1.5 text-[10px] text-slate-350 focus:outline-none focus:border-violet-500 font-mono"
                        />
                      </div>

                      <div className="flex-1 overflow-y-auto space-y-1 divide-y divide-slate-900/40">
                        {[
                          { id: 'generic', label: 'Generic Shapes' },
                          { id: 'system_design', label: 'System Design' },
                          { id: 'ai_agents', label: 'AI Agents' },
                          { id: 'oop', label: 'OOP Design' }
                        ].map((sec) => {
                          const isExpanded = expandedSections[sec.id];
                          const tabShapes = ShapeRegistry[sec.id] || {};
                          const filteredShapes = Object.keys(tabShapes).filter(shapeKey => {
                            const shapeConfig = tabShapes[shapeKey] || {};
                            const label = (shapeConfig.label || shapeKey).toLowerCase();
                            return label.includes(searchQuery.toLowerCase());
                          });

                          return (
                            <div key={sec.id} className="flex flex-col">
                              <button
                                onClick={() => toggleSection(sec.id)}
                                className="w-full flex items-center justify-between py-2.5 px-3 bg-slate-900/40 hover:bg-slate-900/80 border-b border-slate-950 font-black text-[9px] tracking-widest uppercase font-mono text-slate-400 hover:text-white transition-all cursor-pointer select-none"
                              >
                                <span>{sec.label}</span>
                                {isExpanded ? (
                                  <ChevronDown className="w-3.5 h-3.5 text-violet-400" />
                                ) : (
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                                )}
                              </button>

                              {isExpanded && (
                                <div className="grid grid-cols-2 gap-2 p-2.5 bg-[#070b13]/20 animate-fade-in">
                                  {filteredShapes.length === 0 ? (
                                    <div className="col-span-2 text-[8px] text-slate-600 font-mono italic text-center py-2">No match</div>
                                  ) : (
                                    filteredShapes.map(shapeKey => {
                                      const shapeConfig = tabShapes[shapeKey] || {};
                                      const IconComponent = PaletteIconMap[shapeConfig.icon || shapeKey] || Icons.Cpu;
                                      return (
                                        <button
                                          key={shapeKey}
                                          draggable
                                          onDragStart={(e) => {
                                            e.dataTransfer.setData('application/tldraw-shape', shapeKey);
                                          }}
                                          onDoubleClick={() => {
                                            handleAddNodeGUI(shapeKey, shapeConfig.label, { x: 250, y: 180 });
                                          }}
                                          className="flex flex-col items-center justify-center p-2 rounded-xl border border-slate-800 bg-[#090d16]/30 hover:bg-slate-900/85 text-slate-400 hover:text-white transition-all cursor-pointer aspect-square text-center select-none active:scale-95 group"
                                          style={{ borderColor: `${shapeConfig.color}25` }}
                                          title={`${shapeConfig.label || shapeKey} (Drag or Double-click)`}
                                        >
                                          <div 
                                            className="w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm transition-transform group-hover:scale-105"
                                            style={{ backgroundColor: shapeConfig.color }}
                                          >
                                            <IconComponent className="w-3 h-3" />
                                          </div>
                                          <span className="text-[7.5px] mt-1 font-mono font-medium truncate max-w-full leading-none text-slate-450 group-hover:text-slate-200">
                                            {shapeConfig.label || shapeKey}
                                          </span>
                                        </button>
                                      );
                                    })
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-2 border-t border-slate-900/60 text-[8px] text-slate-500 leading-normal font-mono select-none bg-slate-950/20 shrink-0">
                        Double-click shape to spawn. Drag handles to connect. Right-click node for options.
                      </div>
                    </div>

                    {/* Infinite Canvas and Slide-out Sidebar properties */}
                    <div className="flex-grow bg-[#0a0d15] relative overflow-hidden flex select-none">
                      <div className="flex-grow h-full relative">
                        <ArchitectureCanvas />
                      </div>

                      {/* Right-side Properties Sidebar */}
                      {(() => {
                        const rawSelectedNode = nodes.find(n => n.id === storeState.selectedNodeId);
                        if (!rawSelectedNode) return null;
                        const selectedNode = { ...rawSelectedNode, properties: rawSelectedNode.properties || {} };
                        
                        return (
                          <div className="w-80 h-full bg-[#070b13]/95 border-l border-slate-900 shadow-2xl p-4 shrink-0 flex flex-col text-xs text-left z-20 animate-slide-in relative overflow-y-auto">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-900 mb-3">
                              <h4 className="font-extrabold uppercase text-[9px] tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                                <Settings className="w-3.5 h-3.5 text-violet-400" />
                                <span>Properties Sidebar</span>
                              </h4>
                              <button 
                                onClick={() => DiagramStore.setState({ selectedNodeId: null })}
                                className="text-slate-500 hover:text-slate-300 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="space-y-4">
                              {/* Label Name */}
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider">Component Name</label>
                                <input 
                                  type="text" 
                                  value={selectedNode.name} 
                                  onChange={(e) => DiagramStore.updateNode(selectedNode.id, { name: e.target.value })}
                                  className="w-full bg-[#090d16] border border-slate-850 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-violet-500 font-semibold"
                                />
                              </div>

                              {/* Description Field */}
                              <div className="space-y-1">
                                <label className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider">Description</label>
                                <textarea 
                                  value={selectedNode.properties.description || ''} 
                                  onChange={(e) => {
                                    const updatedProps = { ...selectedNode.properties, description: e.target.value };
                                    DiagramStore.updateNode(selectedNode.id, { properties: updatedProps });
                                  }}
                                  rows={3}
                                  className="w-full bg-[#090d16] border border-slate-850 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-violet-500 font-medium resize-none text-[11px]"
                                  placeholder="Role / explanation of this component..."
                                />
                              </div>

                              {/* Technology Field */}
                              {storeState.activeMode === 'system_design' && (
                                <div className="space-y-1">
                                  <label className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider">Technology / Stack</label>
                                  <input 
                                    type="text" 
                                    value={selectedNode.properties.technology || ''} 
                                    onChange={(e) => {
                                      const updatedProps = { ...selectedNode.properties, technology: e.target.value };
                                      DiagramStore.updateNode(selectedNode.id, { properties: updatedProps });
                                    }}
                                    className="w-full bg-[#090d16] border border-slate-850 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-violet-500 font-mono text-[11px]"
                                    placeholder="e.g. PostgreSQL, Redis, Kafka"
                                  />
                                </div>
                              )}

                              {/* Custom Accent Color */}
                              <div className="space-y-1.5">
                                <label className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider">Theme Accent</label>
                                <div className="flex gap-1.5">
                                  {[
                                    { hex: '#2563eb', label: 'Blue' },
                                    { hex: '#7c3aed', label: 'Violet' },
                                    { hex: '#d97706', label: 'Amber' },
                                    { hex: '#059669', label: 'Emerald' },
                                    { hex: '#dc2626', label: 'Red' },
                                    { hex: '#0891b2', label: 'Cyan' },
                                    { hex: '#4b5563', label: 'Gray' }
                                  ].map(colorObj => (
                                    <button
                                      key={colorObj.hex}
                                      onClick={() => DiagramStore.updateNode(selectedNode.id, { color: colorObj.hex })}
                                      className={`w-4 h-4 rounded-full border transition-transform hover:scale-125 cursor-pointer ${
                                        selectedNode.color === colorObj.hex ? 'border-white scale-110' : 'border-transparent'
                                      }`}
                                      style={{ backgroundColor: colorObj.hex }}
                                      title={colorObj.label}
                                    />
                                  ))}
                                </div>
                              </div>

                              <div className="border-t border-slate-900 my-2" />

                              {/* Dynamic properties list fields (Metadata) */}
                              <div className="space-y-3">
                                <span className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider">Configuration Metadata</span>
                                
                                {storeState.activeMode === 'system_design' && (
                                  <>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-mono text-slate-500 uppercase font-semibold">Rate Limit</label>
                                      <input 
                                        type="text" 
                                        value={selectedNode.properties.rateLimit || ''} 
                                        onChange={(e) => {
                                          const updatedProps = { ...selectedNode.properties, rateLimit: e.target.value };
                                          DiagramStore.updateNode(selectedNode.id, { properties: updatedProps });
                                        }}
                                        className="w-full bg-[#090d16] border border-slate-850 rounded-lg px-2.5 py-1 text-slate-250 focus:outline-none focus:border-violet-500 font-mono text-[11px]"
                                        placeholder="e.g. 1000/sec"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-mono text-slate-500 uppercase font-semibold">Capacity</label>
                                      <input 
                                        type="text" 
                                        value={selectedNode.properties.capacity || ''} 
                                        onChange={(e) => {
                                          const updatedProps = { ...selectedNode.properties, capacity: e.target.value };
                                          DiagramStore.updateNode(selectedNode.id, { properties: updatedProps });
                                        }}
                                        className="w-full bg-[#090d16] border border-slate-850 rounded-lg px-2.5 py-1 text-slate-250 focus:outline-none focus:border-violet-500 font-mono text-[11px]"
                                        placeholder="e.g. 16GB"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-mono text-slate-500 uppercase font-semibold">Retention</label>
                                      <input 
                                        type="text" 
                                        value={selectedNode.properties.retention || ''} 
                                        onChange={(e) => {
                                          const updatedProps = { ...selectedNode.properties, retention: e.target.value };
                                          DiagramStore.updateNode(selectedNode.id, { properties: updatedProps });
                                        }}
                                        className="w-full bg-[#090d16] border border-slate-850 rounded-lg px-2.5 py-1 text-slate-250 focus:outline-none focus:border-violet-500 font-mono text-[11px]"
                                        placeholder="e.g. 7 Days"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-mono text-slate-500 uppercase font-semibold">Replication Schema</label>
                                      <input 
                                        type="text" 
                                        value={selectedNode.properties.replication || ''} 
                                        onChange={(e) => {
                                          const updatedProps = { ...selectedNode.properties, replication: e.target.value };
                                          DiagramStore.updateNode(selectedNode.id, { properties: updatedProps });
                                        }}
                                        className="w-full bg-[#090d16] border border-slate-850 rounded-lg px-2.5 py-1 text-slate-250 focus:outline-none focus:border-violet-500 font-mono text-[11px]"
                                        placeholder="e.g. Primary-Replica"
                                      />
                                    </div>
                                  </>
                                )}

                                {storeState.activeMode === 'ai_agents' && (
                                  <>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-mono text-slate-500 uppercase font-semibold">Model Engine / Size</label>
                                      <input 
                                        type="text" 
                                        value={selectedNode.properties.modelType || ''} 
                                        onChange={(e) => {
                                          const updatedProps = { ...selectedNode.properties, modelType: e.target.value };
                                          DiagramStore.updateNode(selectedNode.id, { properties: updatedProps });
                                        }}
                                        className="w-full bg-[#090d16] border border-slate-850 rounded-lg px-2.5 py-1 text-slate-250 focus:outline-none focus:border-violet-500 font-mono text-[11px]"
                                        placeholder="e.g. Claude 3.5 Sonnet"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-mono text-slate-500 uppercase font-semibold">System Prompt Notes</label>
                                      <textarea 
                                        value={selectedNode.properties.promptNotes || ''} 
                                        onChange={(e) => {
                                          const updatedProps = { ...selectedNode.properties, promptNotes: e.target.value };
                                          DiagramStore.updateNode(selectedNode.id, { properties: updatedProps });
                                        }}
                                        rows={3}
                                        className="w-full bg-[#090d16] border border-slate-850 rounded-lg px-2.5 py-1 text-slate-250 focus:outline-none focus:border-violet-500 font-medium resize-none text-[11px]"
                                        placeholder="e.g. Focus on ReAct Loops..."
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-mono text-slate-500 uppercase font-semibold">Tools Registry</label>
                                      <input 
                                        type="text" 
                                        value={selectedNode.properties.toolsList || ''} 
                                        onChange={(e) => {
                                          const updatedProps = { ...selectedNode.properties, toolsList: e.target.value };
                                          DiagramStore.updateNode(selectedNode.id, { properties: updatedProps });
                                        }}
                                        className="w-full bg-[#090d16] border border-slate-850 rounded-lg px-2.5 py-1 text-slate-250 focus:outline-none focus:border-violet-500 font-mono text-[11px]"
                                        placeholder="e.g. db_query, search"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-mono text-slate-500 uppercase font-semibold">Agent Parameters</label>
                                      <input 
                                        type="text" 
                                        value={selectedNode.properties.parameters || ''} 
                                        onChange={(e) => {
                                          const updatedProps = { ...selectedNode.properties, parameters: e.target.value };
                                          DiagramStore.updateNode(selectedNode.id, { properties: updatedProps });
                                        }}
                                        className="w-full bg-[#090d16] border border-slate-850 rounded-lg px-2.5 py-1 text-slate-250 focus:outline-none focus:border-violet-500 font-mono text-[11px]"
                                        placeholder="e.g. Temp=0.2"
                                      />
                                    </div>
                                  </>
                                )}

                                {storeState.activeMode === 'oop' && (
                                  <>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-mono text-slate-500 uppercase font-semibold">Class / Interface Name</label>
                                      <input 
                                        type="text" 
                                        value={selectedNode.properties.className || selectedNode.properties.interfaceName || ''} 
                                        onChange={(e) => {
                                          const keyName = selectedNode.properties.interfaceName ? 'interfaceName' : 'className';
                                          const updatedProps = { ...selectedNode.properties, [keyName]: e.target.value };
                                          DiagramStore.updateNode(selectedNode.id, { properties: updatedProps });
                                        }}
                                        className="w-full bg-[#090d16] border border-slate-850 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-violet-500 font-mono text-[11px]"
                                        placeholder="e.g. Vehicle"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-mono text-slate-500 uppercase font-semibold">Attributes</label>
                                      <textarea 
                                        value={Array.isArray(selectedNode.properties.attributes) ? selectedNode.properties.attributes.join('\n') : (selectedNode.properties.attributes || '')} 
                                        onChange={(e) => {
                                          const updatedProps = { 
                                            ...selectedNode.properties, 
                                            attributes: e.target.value.split('\n')
                                          };
                                          DiagramStore.updateNode(selectedNode.id, { properties: updatedProps });
                                        }}
                                        rows={3}
                                        className="w-full bg-[#090d16] border border-slate-850 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-violet-500 font-mono resize-none text-[11px]"
                                        placeholder="One attribute per line&#10;e.g. licensePlate: string"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[9px] font-mono text-slate-500 uppercase font-semibold">Methods</label>
                                      <textarea 
                                        value={Array.isArray(selectedNode.properties.methods) ? selectedNode.properties.methods.join('\n') : (selectedNode.properties.methods || '')} 
                                        onChange={(e) => {
                                          const updatedProps = { 
                                            ...selectedNode.properties, 
                                            methods: e.target.value.split('\n')
                                          };
                                          DiagramStore.updateNode(selectedNode.id, { properties: updatedProps });
                                        }}
                                        rows={3}
                                        className="w-full bg-[#090d16] border border-slate-850 rounded-lg px-2.5 py-1.5 text-slate-100 focus:outline-none focus:border-violet-500 font-mono resize-none text-[11px]"
                                        placeholder="One method per line&#10;e.g. park()"
                                      />
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {centerTab === 'json' && (
                <div className="flex-1 flex flex-col p-4 bg-slate-950 min-h-0">
                  <div className="flex justify-between items-center mb-2 px-1 shrink-0">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Developer JSON View (Source of Truth)</span>
                  </div>
                  <textarea
                    readOnly
                    value={Serializer.serializeStoreToJSON(storeState)}
                    className="flex-grow bg-[#090d16] border border-slate-900 rounded-xl p-4 font-mono text-xs text-emerald-400 focus:outline-none resize-none leading-relaxed select-all"
                  />
                </div>
              )}

              {centerTab === 'dsl' && (
                <div className="flex-1 flex flex-col p-4 bg-slate-950 min-h-0">
                  <div className="flex justify-between items-center mb-2 px-1 shrink-0">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">AI Flowchart View (Logical Data Flow)</span>
                  </div>
                  <textarea
                    readOnly
                    value={generateAILogicalViewText(nodes, edges, activeCategory)}
                    className="flex-grow bg-[#090d16] border border-slate-900 rounded-xl p-4 font-mono text-xs text-cyan-400 focus:outline-none resize-none leading-relaxed select-all"
                  />
                </div>
              )}

              {centerTab === 'code' && (
                <div className="flex-1 flex flex-col p-4 bg-slate-950 min-h-0">
                  <div className="flex justify-between items-center mb-2 px-1 shrink-0">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Code Draft Sheet</span>
                    <button 
                      onClick={explainCodeWithAI}
                      className="flex items-center space-x-1 px-2.5 py-1.5 rounded bg-violet-650 hover:bg-violet-600 text-[10px] text-white hover:text-white transition-colors font-bold cursor-pointer"
                      title="Request AI Code feedback from AI Coach"
                    >
                      <Sparkles className="w-3 h-3 text-cyan-300" />
                      <span>AI Code Critic</span>
                    </button>
                  </div>
                  <textarea
                    value={codeContent}
                    onChange={(e) => setCodeContent(e.target.value)}
                    className="flex-grow bg-[#090d16] border border-slate-900 rounded-xl p-4 font-mono text-xs text-slate-350 focus:outline-none focus:border-violet-500 resize-none leading-relaxed"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Column 3: AI Coach Layout (Right 30%) */}
          {isCoachCollapsed ? (
            <div className="w-12 border-l border-slate-900 bg-slate-950 flex flex-col items-center py-4 space-y-4 shrink-0 transition-all duration-300">
              <button 
                onClick={() => setIsCoachCollapsed(false)} 
                className="p-1.5 rounded hover:bg-slate-900 border border-slate-800 text-violet-400 cursor-pointer"
                title="Expand AI Coach"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <div className="flex-grow flex items-center justify-center">
                <span className="text-[10px] font-extrabold uppercase tracking-widest font-mono text-slate-500 whitespace-nowrap -rotate-90 select-none">
                  AI Coach
                </span>
              </div>
            </div>
          ) : (
            <>
              {/* Resize Handle */}
              <div 
                className="hidden lg:block w-1.5 h-full cursor-col-resize hover:bg-violet-600/40 active:bg-violet-600 bg-[#070b13] border-l border-r border-slate-900 shrink-0 z-40 transition-colors"
                onMouseDown={startResizing}
              />
              <div 
                style={{ width: `${coachWidth}%` }}
                className="w-full bg-[#080c14]/90 flex flex-col h-full overflow-hidden text-left border-t lg:border-t-0 border-slate-900 transition-all duration-300 shrink-0 animate-fade-in font-sans"
              >
                {/* Title bar */}
                <div className="flex justify-between items-center border-b border-slate-900 bg-slate-950 text-xs py-3.5 px-4 font-bold text-slate-355 shrink-0">
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
                    <span>AI Coach</span>
                  </div>
                  <button 
                    onClick={() => setIsCoachCollapsed(true)} 
                    className="p-1 rounded hover:bg-slate-900 text-slate-500 hover:text-slate-300 cursor-pointer transition-colors"
                    title="Collapse Panel"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Coach Panel Content */}
                <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-4 min-h-0 text-slate-200 scrollbar">
                  
                  {/* Chat logs */}
                  <div className="flex-grow flex flex-col space-y-3 overflow-y-auto pr-1 min-h-[150px]">
                    {chatMessages.map((msg, index) => {
                      const isAi = msg.sender === 'ai';
                      return (
                        <div key={index} className={`flex items-start space-x-2.5 max-w-[85%] text-left ${isAi ? '' : 'self-end ml-auto text-right'}`}>
                          {isAi && (
                            <div className="w-6 h-6 rounded-lg bg-violet-950 border border-violet-800 flex items-center justify-center text-violet-400 shrink-0 text-xs shadow-inner shadow-violet-500/10">
                              🤖
                            </div>
                          )}
                          <div className={`rounded-2xl px-3 py-2 text-[11px] leading-normal whitespace-pre-wrap ${
                            isAi 
                              ? 'bg-slate-900/70 border border-slate-850 text-slate-200 text-left' 
                              : 'bg-violet-600/20 border border-violet-900/30 text-slate-200 text-left'
                          }`}>
                            {msg.text}
                          </div>
                          {!isAi && (
                            <div className="w-6 h-6 rounded-lg bg-slate-850 border border-slate-800 flex items-center justify-center text-slate-350 shrink-0 text-[10px] font-bold shadow-sm">
                              V
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div ref={chatEndRef} />
                  </div>

                  {/* AI Card Deck / Phase Checkpoints */}
                  {(() => {
                    const activePhase = currentTopic.phases[aiCoachPhase];
                    if (!activePhase) return null;
                    if (aiCoachPhase === 5) {
                      return (
                        <div className="p-4 bg-[#0b101d] border border-amber-500/20 rounded-2xl flex flex-col items-center text-center space-y-2.5 shadow-lg animate-scale-up select-none">
                          <Award className="w-6 h-6 text-amber-400 animate-bounce" />
                          <h4 className="text-[10px] font-black text-white uppercase tracking-wider font-mono">🎉 All Goals Complete!</h4>
                          <p className="text-[9.5px] text-slate-400 leading-normal">{activePhase.question}</p>
                        </div>
                      );
                    }

                    return (
                      <div className="p-3.5 bg-[#0b101d] border border-violet-900/40 rounded-2xl flex flex-col space-y-3 shadow-md animate-fade-in select-none">
                        <div className="flex items-center justify-between text-[8.5px] font-extrabold text-violet-400 uppercase tracking-wider font-mono">
                          <span>Active Phase {aiCoachPhase} / 4</span>
                          <span className="px-2 py-0.5 rounded bg-violet-955/20 border border-violet-900/25 text-[8px]">{activePhase.name}</span>
                        </div>
                        
                        <p className="text-[10px] text-slate-250 font-bold leading-normal text-left">{activePhase.question}</p>

                        {selectedOption === null ? (
                          <div className="flex flex-col gap-1.5 pt-1.5">
                            {activePhase.options.map((opt, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  setSelectedOption(idx);
                                  const correct = idx === activePhase.correctIndex;
                                  setIsAnswerCorrect(correct);
                                  if (correct) {
                                    setChatMessages(prev => [
                                      ...prev,
                                      { sender: 'user', text: `Selected Option: ${opt}` },
                                      { sender: 'ai', text: `Correct choice! 🎉 ${activePhase.hint}` }
                                    ]);
                                  } else {
                                    setChatMessages(prev => [
                                      ...prev,
                                      { sender: 'user', text: `Selected Option: ${opt}` },
                                      { sender: 'ai', text: `Incorrect option selected. ❌ Hint: ${activePhase.hint}` }
                                    ]);
                                  }
                                }}
                                className="w-full text-left p-2 bg-slate-900/80 hover:bg-slate-850/80 border border-slate-800 hover:border-slate-750 rounded-xl text-[10px] font-semibold text-slate-355 hover:text-white transition-all cursor-pointer shadow-sm active:scale-[0.98]"
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="pt-1 space-y-2">
                            {isAnswerCorrect ? (
                              <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-xl text-left space-y-2 animate-scale-up">
                                <h5 className="text-[10px] font-black text-emerald-455 flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>Correct Answer!</span>
                                </h5>
                                <p className="text-[9.5px] text-slate-400 leading-normal">{activePhase.hint}</p>
                                <button
                                  onClick={() => {
                                    const nextPhase = aiCoachPhase + 1;
                                    setAiCoachPhase(nextPhase);
                                    setSelectedOption(null);
                                    setIsAnswerCorrect(null);
                                    setShowHintCard(false);
                                    if (currentTopic.phases[nextPhase]) {
                                      setChatMessages(prev => [
                                        ...prev,
                                        { sender: 'ai', text: currentTopic.phases[nextPhase].question }
                                      ]);
                                    }
                                  }}
                                  className="w-full py-1.5 bg-emerald-650 hover:bg-emerald-600 text-white text-[10px] font-extrabold rounded-lg transition-all cursor-pointer shadow active:scale-[0.98]"
                                >
                                  Advance to Phase {aiCoachPhase + 1}
                                </button>
                              </div>
                            ) : (
                              <div className="p-3 bg-red-955/10 border border-red-900/40 rounded-xl text-left space-y-2 animate-scale-up">
                                <h5 className="text-[10px] font-black text-red-400 flex items-center gap-1.5">
                                  <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                                  <span>Try Again</span>
                                </h5>
                                <p className="text-[9.5px] text-slate-400 leading-normal">{activePhase.hint}</p>
                                <button
                                  onClick={() => {
                                    setSelectedOption(null);
                                    setIsAnswerCorrect(null);
                                  }}
                                  className="w-full py-1.5 bg-red-650 hover:bg-red-600 text-white text-[10px] font-extrabold rounded-lg transition-all cursor-pointer active:scale-[0.98]"
                                >
                                  Reset Option Choices
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {selectedOption === null && (
                          <div className="flex gap-2 justify-end pt-1">
                            <button
                              onClick={() => setShowHintCard(!showHintCard)}
                              className="text-[8.5px] font-bold text-violet-400 hover:text-white px-2 py-0.5 rounded border border-violet-900/30 bg-violet-955/10 cursor-pointer"
                            >
                              {showHintCard ? "Hide Hint" : "Get Hint"}
                            </button>
                          </div>
                        )}

                        {showHintCard && selectedOption === null && (
                          <div className="p-2.5 bg-slate-900/80 border border-slate-850 rounded-xl text-[9.5px] text-slate-400 leading-relaxed text-left animate-fade-in font-medium">
                            💡 Hint: {activePhase.hint}
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* Score evaluation details ONLY shown when clicking Analyze Design */}
                  {!evaluating && evalResults && (
                    <div className="space-y-4 border-t border-slate-900/60 pt-4">
                      {/* Overall Score */}
                      <div className="grid grid-cols-3 gap-2 bg-[#090d16] border border-slate-900 p-3 rounded-2xl text-center">
                        <div className="border-r border-slate-900/60">
                          <div className="text-xl font-black text-white">{evalResults.score}/100</div>
                          <span className="text-[8px] text-slate-500 font-bold uppercase font-mono">Design score</span>
                        </div>
                        <div className="border-r border-slate-900/60">
                          <div className="text-xl font-black text-emerald-400">{evalResults.latency}</div>
                          <span className="text-[8px] text-slate-500 font-bold uppercase font-mono">Latency</span>
                        </div>
                        <div>
                          <div className="text-xl font-black text-cyan-400">{evalResults.availability}</div>
                          <span className="text-[8px] text-slate-505 font-bold uppercase font-mono">Uptime SLA</span>
                        </div>
                      </div>

                      {/* Weighted Architecture Score gauges */}
                      {evalResults.scores && (
                        <div className="p-3 bg-[#090d16] border border-slate-900 rounded-xl space-y-2 text-xs text-left">
                          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider font-mono">Topology Metrics Scorecard</span>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {[
                              { name: 'Performance', val: evalResults.scores.performance.score, color: 'bg-emerald-500' },
                              { name: 'Reliability', val: evalResults.scores.reliability.score, color: 'bg-indigo-500' },
                              { name: 'Scalability', val: evalResults.scores.scalability.score, color: 'bg-blue-500' },
                              { name: 'Security Policy', val: evalResults.scores.security.score, color: 'bg-pink-500' },
                              { name: 'Maintainability', val: evalResults.scores.maintainability.score, color: 'bg-amber-500' }
                            ].map(m => (
                              <div key={m.name} className="space-y-1">
                                <div className="flex justify-between text-[9.5px] font-medium text-slate-455">
                                  <span className="truncate max-w-[85%]">{m.name}</span>
                                  <span className="font-mono text-white font-bold">{m.val}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${m.color}`} 
                                    style={{ width: `${m.val}%` }} 
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Detected Strengths, Risks, and Missing checklists */}
                      {(() => {
                        const strengths = [];
                        const risks = [];
                        const missing = [];
                        Object.keys(evalResults.scores).forEach(key => {
                          const cat = evalResults.scores[key];
                          if (cat.strengths) strengths.push(...cat.strengths);
                          if (cat.risks) risks.push(...cat.risks);
                          if (cat.missing) missing.push(...cat.missing);
                        });

                        return (
                          <>
                            {strengths.length > 0 && (
                              <div className="p-3 bg-emerald-950/10 border border-emerald-900/40 rounded-xl space-y-1 text-xs text-left">
                                <span className="text-[9px] font-bold text-emerald-450 uppercase tracking-wider font-mono">Detected Strengths</span>
                                <ul className="space-y-1 text-[10px] text-slate-350 list-none pl-0">
                                  {strengths.map((str, i) => (
                                    <li key={i} className="text-emerald-400">{str}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {risks.length > 0 && (
                              <div className="p-3 bg-red-955/5 border border-red-900/40 rounded-xl space-y-1 text-xs text-left">
                                <span className="text-[9px] font-bold text-red-400 uppercase tracking-wider font-mono">Detected Risks</span>
                                <ul className="space-y-1 text-[10px] text-slate-350 list-none pl-0">
                                  {risks.map((risk, i) => (
                                    <li key={i} className="text-red-300">{risk}</li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {missing.length > 0 && (
                              <div className="p-3 bg-amber-955/5 border border-amber-900/40 rounded-xl space-y-1 text-xs text-left">
                                <span className="text-[9px] font-bold text-amber-400 uppercase tracking-wider font-mono">Detected Missing Components</span>
                                <ul className="space-y-1 text-[10px] text-slate-350 list-none pl-0">
                                  {missing.map((miss, i) => (
                                    <li key={i} className="text-amber-300">{miss}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}

                </div>

                {/* Chat Suggestion Chips */}
                <div className="px-3 pt-2 pb-1.5 flex flex-wrap gap-1.5 border-t border-slate-900/60 bg-[#090d16]/40 shrink-0">
                  {[
                    { label: "💡 Get Hint", query: "Give me a hint for the current phase." },
                    { label: "📋 Review Flowchart", query: "Can you review my logical flowchart?" },
                    { label: "⚡ Analyze Bottlenecks", query: "Find any architectural bottlenecks in my diagram." },
                    { label: "📐 Best Practices", query: "What are the design best practices for this category?" }
                  ].map((chip, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSuggestionClick(chip.query)}
                      className="text-[9px] font-bold text-slate-400 hover:text-white px-2.5 py-1 rounded-full border border-slate-800 bg-slate-950/65 hover:bg-slate-900 transition-all cursor-pointer active:scale-95"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>

                {/* Chat Input form at bottom */}
                <form onSubmit={handleChatSubmit} className="flex gap-2 p-3 border-t border-slate-900 bg-slate-950 shrink-0 select-text">
                  <input 
                    type="text" 
                    value={chatInput} 
                    onChange={(e) => setChatInput(e.target.value)} 
                    placeholder="Ask AI Coach a question..."
                    className="flex-1 bg-slate-900/80 border border-slate-850 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-650 focus:outline-none focus:border-violet-500 font-sans"
                  />
                  <button type="submit" className="px-3.5 py-1.5 bg-violet-650 hover:bg-violet-600 text-white rounded-xl text-xs font-bold transition-all shadow cursor-pointer active:scale-95">
                    Send
                  </button>
                </form>

              </div>
            </>
          )}
        </div>

        {/* Global Portalled / Absolute Context Menus */}
        {storeState.contextMenu && (
          <div 
            className="fixed bg-[#090d16]/95 border border-slate-800 rounded-xl shadow-2xl p-1.5 w-52 z-[999] flex flex-col text-xs text-left"
            style={{ left: storeState.contextMenu.x, top: storeState.contextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => {
                const nodeId = storeState.contextMenu.nodeId;
                DiagramStore.setState({ selectedNodeId: nodeId, contextMenu: null });
                setTimeout(() => {
                  const nodeObj = nodes.find(n => n.id === nodeId);
                  if (nodeObj) {
                    const input = document.querySelector(`input[value="${nodeObj.name}"]`);
                    if (input) {
                      input.focus();
                      input.select();
                    }
                  }
                }, 50);
              }}
              className="w-full py-1.5 px-2.5 rounded hover:bg-slate-900/65 font-bold transition-all text-slate-350 hover:text-white text-left flex items-center space-x-2 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-violet-400" />
              <span>Rename</span>
            </button>
            <button 
              onClick={() => {
                const nodeId = storeState.contextMenu.nodeId;
                DiagramStore.setState({ selectedNodeId: nodeId, contextMenu: null });
              }}
              className="w-full py-1.5 px-2.5 rounded hover:bg-slate-900/65 font-bold transition-all text-slate-350 hover:text-white text-left flex items-center space-x-2 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-violet-400" />
              <span>Edit Properties</span>
            </button>
            <button 
              onClick={() => {
                const nodeId = storeState.contextMenu.nodeId;
                const nodeToDup = nodes.find(n => n.id === nodeId);
                if (nodeToDup) {
                  const dup = {
                    ...nodeToDup,
                    id: `node_${nodeToDup.type}_${Date.now().toString().slice(-4)}`,
                    x: nodeToDup.x + 30,
                    y: nodeToDup.y + 30,
                    position: { x: nodeToDup.x + 30, y: nodeToDup.y + 30 },
                    name: `${nodeToDup.name} (Copy)`
                  };
                  DiagramStore.addNode(dup);
                }
                DiagramStore.setState({ contextMenu: null });
              }}
              className="w-full py-1.5 px-2.5 rounded hover:bg-slate-900/65 font-bold transition-all text-slate-350 hover:text-white text-left flex items-center space-x-2 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-violet-400" />
              <span>Duplicate</span>
            </button>
            <button 
              onClick={() => {
                const nodeId = storeState.contextMenu.nodeId;
                handleAskAIToExplain(nodeId);
                DiagramStore.setState({ contextMenu: null });
              }}
              className="w-full py-1.5 px-2.5 rounded hover:bg-slate-900/65 font-bold transition-all text-slate-350 hover:text-white text-left flex items-center space-x-2 cursor-pointer"
            >
              <Brain className="w-3.5 h-3.5 text-violet-400" />
              <span>Explain Node</span>
            </button>
            <button 
              onClick={() => {
                const nodeId = storeState.contextMenu.nodeId;
                handleAskAIToImprove(nodeId);
                DiagramStore.setState({ contextMenu: null });
              }}
              className="w-full py-1.5 px-2.5 rounded hover:bg-slate-900/65 font-bold transition-all text-slate-350 hover:text-white text-left flex items-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Improve Node</span>
            </button>
            <button 
              onClick={() => {
                const nodeId = storeState.contextMenu.nodeId;
                handleAskAIBestPractices(nodeId);
                DiagramStore.setState({ contextMenu: null });
              }}
              className="w-full py-1.5 px-2.5 rounded hover:bg-slate-900/65 font-bold transition-all text-slate-350 hover:text-white text-left flex items-center space-x-2 cursor-pointer"
            >
              <Award className="w-3.5 h-3.5 text-violet-400" />
              <span>Best Practices</span>
            </button>
            <button 
              onClick={() => {
                const nodeId = storeState.contextMenu.nodeId;
                handleGenerateNeighbors(nodeId);
                DiagramStore.setState({ contextMenu: null });
              }}
              className="w-full py-1.5 px-2.5 rounded hover:bg-slate-900/65 font-bold transition-all text-slate-350 hover:text-white text-left flex items-center space-x-2 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-violet-400" />
              <span>Generate Connections</span>
            </button>
            <button 
              onClick={() => {
                const nodeId = storeState.contextMenu.nodeId;
                handleFindBottlenecks(nodeId);
                DiagramStore.setState({ contextMenu: null });
              }}
              className="w-full py-1.5 px-2.5 rounded hover:bg-slate-900/65 font-bold transition-all text-slate-350 hover:text-white text-left flex items-center space-x-2 cursor-pointer"
            >
              <AlertCircle className="w-3.5 h-3.5 text-violet-400" />
              <span>Find Bottlenecks</span>
            </button>
            <div className="border-t border-slate-900 my-1" />
            <button 
              onClick={() => {
                const nodeId = storeState.contextMenu.nodeId;
                DiagramStore.removeNode(nodeId);
                DiagramStore.setState({ contextMenu: null });
              }}
              className="w-full py-1.5 px-2.5 rounded hover:bg-red-950/40 text-red-400 hover:text-red-350 font-bold transition-all text-left flex items-center space-x-2 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-500" />
              <span>Delete</span>
            </button>
          </div>
        )}

        {storeState.canvasContextMenu && (
          <div 
            className="fixed bg-[#090d16]/95 border border-slate-800 rounded-xl shadow-2xl p-1.5 w-52 z-[999] flex flex-col text-xs text-left"
            style={{ left: storeState.canvasContextMenu.x, top: storeState.canvasContextMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[9px] text-slate-500 font-extrabold uppercase font-mono px-2.5 py-1.5 select-none border-b border-slate-900 mb-1 tracking-wider">
              Add Component
            </div>
            {ModeManager.getModeConfig(storeState.activeMode).shapes.map(shapeKey => {
              const shapeConfig = ShapeRegistry[storeState.activeMode]?.[shapeKey] || {};
              return (
                <button
                  key={shapeKey}
                  onClick={() => {
                    handleAddNodeGUI(
                      shapeKey, 
                      shapeConfig.label, 
                      { x: storeState.canvasContextMenu.pageX, y: storeState.canvasContextMenu.pageY }
                    );
                    DiagramStore.setState({ canvasContextMenu: null });
                  }}
                  className="w-full py-1.5 px-2.5 rounded hover:bg-slate-900/65 font-bold transition-all text-slate-350 hover:text-white text-left flex items-center space-x-2 cursor-pointer"
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: shapeConfig.color || '#3b82f6' }} />
                  <span>{shapeConfig.label || shapeKey}</span>
                </button>
              );
            })}
          </div>
        )}


      </div>
    </div>
  );
}
