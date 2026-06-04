export const ShapeRegistry = {
  generic: {
    square: {
      label: "Square",
      icon: "square",
      color: "#64748b",
      portsCount: 4,
      properties: { description: "Generic Square block" }
    },
    rectangle: {
      label: "Rectangle",
      icon: "rectangle",
      color: "#64748b",
      portsCount: 4,
      properties: { description: "Generic Rectangle block" }
    },
    circle: {
      label: "Circle",
      icon: "circle",
      color: "#64748b",
      portsCount: 4,
      properties: { description: "Generic Circle bubble" }
    },
    diamond: {
      label: "Diamond Decision",
      icon: "diamond",
      color: "#64748b",
      portsCount: 4,
      properties: { description: "Decision branching block" }
    },
    cylinder: {
      label: "Cylinder Data",
      icon: "cylinder",
      color: "#64748b",
      portsCount: 4,
      properties: { description: "Database cylinder shape" }
    },
    hexagon: {
      label: "Hexagon Node",
      icon: "hexagon",
      color: "#64748b",
      portsCount: 4,
      properties: { description: "Hexagonal network element" }
    },
    cloud: {
      label: "Cloud Ingress",
      icon: "cloud",
      color: "#0284c7",
      portsCount: 4,
      properties: { description: "External Cloud SaaS/API network ingress" }
    },
    document: {
      label: "Document Sheet",
      icon: "document",
      color: "#64748b",
      portsCount: 4,
      properties: { description: "Static configuration or document data block" }
    },
    triangle: {
      label: "Triangle Node",
      icon: "triangle",
      color: "#64748b",
      portsCount: 4,
      properties: { description: "Triangle Shape" }
    },
    pentagon: {
      label: "Pentagon Node",
      icon: "pentagon",
      color: "#64748b",
      portsCount: 4,
      properties: { description: "Pentagon Shape" }
    },
    octagon: {
      label: "Octagon Node",
      icon: "octagon",
      color: "#64748b",
      portsCount: 4,
      properties: { description: "Octagon Shape" }
    },
    container: {
      label: "App Container",
      icon: "container",
      color: "#0891b2",
      portsCount: 4,
      properties: { description: "Isolated Docker App Container" }
    },
    group: {
      label: "Logical Group",
      icon: "group",
      color: "#475569",
      portsCount: 4,
      properties: { description: "Bounded architectural grouping box" }
    },
    swimlane: {
      label: "Swimlane Border",
      icon: "swimlane",
      color: "#475569",
      portsCount: 4,
      properties: { description: "Swimlane structural partition border" }
    },
    actor: {
      label: "System Actor",
      icon: "actor",
      color: "#475569",
      portsCount: 4,
      properties: { description: "Human user / automated system client actor" }
    },
    process: {
      label: "Work Process",
      icon: "process",
      color: "#64748b",
      portsCount: 4,
      properties: { description: "Procedural step processing block" }
    },
    decision: {
      label: "Decision Switch",
      icon: "decision",
      color: "#64748b",
      portsCount: 4,
      properties: { description: "Conditional branch switch" }
    },
    datastore: {
      label: "Data Store Repo",
      icon: "datastore",
      color: "#0f766e",
      portsCount: 4,
      properties: { description: "Generic secondary storage repository" }
    },
    api: {
      label: "API Endpoint",
      icon: "api",
      color: "#ec4899",
      portsCount: 4,
      properties: { description: "Public / internal API router endpoint" }
    }
  },
  system_design: {
    user: {
      label: "User Client",
      icon: "user",
      color: "#4b5563",
      portsCount: 4,
      properties: { description: "User traffic entry point", rateLimit: "10000/s", platform: "Web/Mobile" }
    },
    cdn: {
      label: "CDN Gateway",
      icon: "cdn",
      color: "#0891b2",
      portsCount: 4,
      properties: { description: "Edge asset caching proxy", technology: "Cloudflare", edgeLocations: "200" }
    },
    lb: {
      label: "Load Balancer",
      icon: "lb",
      color: "#7c3aed",
      portsCount: 4,
      properties: { description: "Traffic distribution layer", technology: "NGINX / HAProxy", algorithm: "Round Robin" }
    },
    gateway: {
      label: "API Gateway",
      icon: "gateway",
      color: "#ec4899",
      portsCount: 4,
      properties: { description: "API proxy and rate limiter", technology: "Kong / AWS GW", rateLimit: "1000/s" }
    },
    server: {
      label: "App Server",
      icon: "server",
      color: "#2563eb",
      portsCount: 8,
      properties: { description: "Core backend app service logic", technology: "NodeJS / Go", replicas: "3" }
    },
    microservice: {
      label: "Microservice",
      icon: "microservice",
      color: "#3b82f6",
      portsCount: 8,
      properties: { description: "Isolated business logic microservice", technology: "Spring Boot / Go", endpointsCount: "12" }
    },
    cache: {
      label: "Redis Cache",
      icon: "cache",
      color: "#d97706",
      portsCount: 8,
      properties: { description: "In-memory database cache", technology: "Redis", capacity: "16GB" }
    },
    queue: {
      label: "Message Queue",
      icon: "queue",
      color: "#059669",
      portsCount: 6,
      properties: { description: "Asynchronous buffering broker", technology: "Kafka", retention: "7 days" }
    },
    database: {
      label: "Database",
      icon: "database",
      color: "#dc2626",
      portsCount: 8,
      properties: { description: "Relational persistence storage", technology: "PostgreSQL", replication: "Primary-Replica" }
    },
    storage: {
      label: "Object Storage",
      icon: "storage",
      color: "#0f766e",
      portsCount: 4,
      properties: { description: "Object file system storage", technology: "AWS S3", backup: "Daily" }
    }
  },
  ai_agents: {
    user: {
      label: "Web User",
      icon: "user",
      color: "#4b5563",
      portsCount: 4,
      properties: { description: "User query input source", platform: "Web Chat" }
    },
    agent: {
      label: "Agent Coordinator",
      icon: "agent",
      color: "#7c3aed",
      portsCount: 8,
      properties: { description: "Autonomous orchestration loop", modelType: "Claude 3.5 Sonnet", parameters: "Temp=0.2" }
    },
    planner: {
      label: "Router Planner",
      icon: "planner",
      color: "#ec4899",
      portsCount: 4,
      properties: { description: "Deconstructs query into task graphs", strategy: "Tree-of-Thoughts" }
    },
    tool: {
      label: "Execution Tool",
      icon: "tool",
      color: "#d97706",
      portsCount: 4,
      properties: { description: "External API action client", toolsList: "db_query, python_repl" }
    },
    memory: {
      label: "Brain Memory",
      icon: "memory",
      color: "#059669",
      portsCount: 4,
      properties: { description: "Short/Long term state store", technology: "Redis / Mem0" }
    },
    llm: {
      label: "LLM Engine",
      icon: "llm",
      color: "#dc2626",
      portsCount: 8,
      properties: { description: "Cognitive reasoning core", modelType: "GPT-4o", promptNotes: "Follow strict ReAct JSON output formats" }
    },
    kb: {
      label: "Knowledge Base",
      icon: "kb",
      color: "#0891b2",
      portsCount: 4,
      properties: { description: "Semantic vector document index", technology: "Pinecone / pgvector" }
    },
    router: {
      label: "Agent Router",
      icon: "router",
      color: "#0284c7",
      portsCount: 4,
      properties: { description: "Dynamic prompt router", strategy: "Semantic Routing" }
    }
  },
  oop: {
    class: {
      label: "Class Entity",
      icon: "class",
      color: "#2563eb",
      portsCount: 8,
      properties: { description: "Object blueprint definition", className: "Vehicle", attributes: ["licensePlate: string", "color: string"], methods: ["park()", "leave()"] }
    },
    interface: {
      label: "Interface Entity",
      icon: "interface",
      color: "#7c3aed",
      portsCount: 4,
      properties: { description: "Decoupled contract definition", className: "IParkingSpot", methods: ["isAvailable()", "getSpotSize()"] }
    },
    abstract: {
      label: "Abstract Entity",
      icon: "abstract",
      color: "#ec4899",
      portsCount: 4,
      properties: { description: "Partial abstract template class", className: "AbstractGate", attributes: ["gateId: int"] }
    },
    object: {
      label: "Object Instance",
      icon: "object",
      color: "#4b5563",
      portsCount: 4,
      properties: { description: "Runtime memory instance allocation", className: "myCar", state: "parked = true" }
    },
    package: {
      label: "Code Package",
      icon: "package",
      color: "#0f766e",
      portsCount: 4,
      properties: { description: "Logical namespace organizer", packageName: "parking.controllers" }
    }
  }
};
