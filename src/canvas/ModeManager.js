import { ShapeRegistry } from './ShapeRegistry';

export const ModeManager = {
  getModeConfig(mode) {
    const registry = ShapeRegistry[mode] || ShapeRegistry.system_design;
    
    switch (mode) {
      case 'oop':
        return {
          title: "Object-Oriented Design (OOD)",
          paletteLabel: "OOP Shape Palette",
          shapes: Object.keys(registry),
          aiPrompt: "You are a Senior OOP Architect. Analyze this class interface structure. Verify SOLID principles alignment, check for loose coupling via interface segregation, evaluate abstract inheritance vs class composition, and spot concurrency safety/thread locks issues.",
          validationRules: [
            { id: "solid", name: "SOLID Principles Alignment" },
            { id: "decoupling", name: "Interface Decoupling / OCP" },
            { id: "singleton", name: "Singleton Pattern Instantiation" },
            { id: "thread_safety", name: "Thread Concurrency & Locks" }
          ]
        };
      case 'ai_agents':
        return {
          title: "AI Agent Workflow Design",
          paletteLabel: "Agent Shape Palette",
          shapes: Object.keys(registry),
          aiPrompt: "You are a Senior LLM Systems Engineer. Analyze this reasoning agent network. Verify ReAct loops, evaluate tool registry schema setups, trace planning strategies, and check for context window scaling limitations.",
          validationRules: [
            { id: "agent_flow", name: "ReAct Loops & Orchestration" },
            { id: "tool_schema", name: "Structured JSON Tool Registry" },
            { id: "timeouts", name: "Loop Timeout Guardrails" },
            { id: "injections", name: "Strict Input Prompt Sandboxes" }
          ]
        };
      case 'system_design':
      default:
        return {
          title: "System Design Sandbox",
          paletteLabel: "System Shapes Palette",
          shapes: Object.keys(registry),
          aiPrompt: "You are a cloud-native Infrastructure Architect. Review the system topology. Look for single points of failure, check if reads hit the memory cache (Redis) before SQL, verify writes are buffered asynchronously in message queues (Kafka), and analyze scale requirements for 100K+ requests/sec.",
          validationRules: [
            { id: "scale", name: "Scale and Capacity Calculations" },
            { id: "cache", name: "Redis Caching and Eviction policy" },
            { id: "queue", name: "Kafka Buffering and Write decoupling" },
            { id: "failover", name: "Active Failovers & SPoF audits" }
          ]
        };
    }
  }
};
