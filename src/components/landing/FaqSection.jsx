import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      q: "What is DesignWorkBench?",
      a: "DesignWorkBench is an interactive system design, DSA, and OOD practice platform. Instead of passively reading or watching diagrams, you build system specifications, draw live architectural diagrams on a canvas, write database schemas, and get instantly evaluated by our custom AI agent engine."
    },
    {
      q: "How does the AI architectural evaluation work?",
      a: "When you submit your design, our AI evaluator parses your diagram nodes, connections, API endpoints, database schemas, and written trade-offs. It scores your solution based on requirements coverage, scalability, storage bottlenecks, and single-points-of-failure, returning detailed actionable improvement logs."
    },
    {
      q: "What programming languages are supported in the editors?",
      a: "For system design, you write schemas using general SQL dialects and specify REST/gRPC endpoints using JSON definitions. For Algorithms (DSA) and Object-Oriented Design (OOD), we support JavaScript, Python, Java, Go, C++, and TypeScript."
    },
    {
      q: "How do peer-to-peer mock interviews work?",
      a: "You can book or join sessions inside our mock matchmaking panel. Once matched, you enter a collaborative interview room equipped with dummy video streams, a synchronized whiteboard canvas, a shared code editor, and interviewer evaluation checkmarks."
    },
    {
      q: "Is there a refund policy?",
      a: "Yes, we offer a 30-day money-back guarantee. If you decide DesignWorkBench isn't the right fit for your interview preparation timeline, simply email support and we will issue a full refund, no questions asked."
    }
  ];

  const toggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 border-t border-slate-900 bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-slate-400 mt-3 text-sm">Everything you need to know about the platform.</p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx}
                className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden transition-colors hover:border-slate-700/80"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center text-white focus:outline-none"
                >
                  <span className="font-semibold text-sm sm:text-base">{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-violet-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  )}
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-5 text-slate-400 text-xs sm:text-sm border-t border-slate-800/40 pt-4 leading-relaxed animate-fade-in">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
