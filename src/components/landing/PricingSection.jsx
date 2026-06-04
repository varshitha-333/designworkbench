import React from 'react';
import { Check, ShieldCheck, Sparkles } from 'lucide-react';

export default function PricingSection({ setCurrentTab }) {
  const tiers = [
    {
      name: 'Free Tier',
      price: '$0',
      description: 'Get a taste of interactive system prep.',
      features: [
        'Access to 5 selected System Design tasks',
        'Basic AI feedback reports (3 review tokens/day)',
        'DSA visualizer basic problems (sorting/arrays)',
        'Community Discord channel access'
      ],
      cta: 'Start Practice',
      popular: false
    },
    {
      name: 'Pro Architect',
      price: '$15',
      period: '/month',
      description: 'Everything you need to clear L5+ interview loops.',
      features: [
        'Access to 120+ System Design challenges',
        'Unlimited AI diagnostic runs and feedbacks',
        'DSA visualizer advanced topics (Graphs, DP)',
        'Object-Oriented Design problems library',
        'Uncapped peer-to-peer Mock Interviews',
        'Full editorial walk-throughs & schema answers'
      ],
      cta: 'Unlock Pro Access',
      popular: true
    },
    {
      name: 'Lifetime Architect',
      price: '$149',
      period: ' one-time',
      description: 'Permanent access to continuous updates.',
      features: [
        'Lifetime access to all existing and future problems',
        'Unlimited AI review runs & mock pairings',
        'Private Slack/Discord channels with staff',
        'Resume review and portfolio audit (1-on-1)',
        'Priority feature requests & feedback options'
      ],
      cta: 'Get Lifetime Deal',
      popular: false
    }
  ];

  return (
    <section className="py-20 border-t border-slate-900 bg-slate-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Invest in Your Engineering Career
          </h2>
          <p className="text-slate-400 max-w-xl mx-auto">
            Choose the membership that fits your timeline. Land your dream FAANG/Tier-1 offer with practical hands-on architecture skills.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <div
              key={index}
              className={`rounded-3xl p-8 relative flex flex-col justify-between transition-all duration-300 ${
                tier.popular
                  ? 'bg-slate-900 border-2 border-violet-500 hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] md:-translate-y-4'
                  : 'bg-slate-900/40 border border-slate-800/80 hover:border-slate-700'
              }`}
            >
              {/* Popular indicator */}
              {tier.popular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider shadow flex items-center space-x-1">
                  <Sparkles className="w-3 h-3" />
                  <span>Most Popular</span>
                </span>
              )}

              {/* Tier Heading */}
              <div>
                <h3 className="text-lg font-bold text-slate-100 mb-2">{tier.name}</h3>
                <p className="text-slate-400 text-xs mb-6 min-h-[32px]">{tier.description}</p>
                
                {/* Price tag */}
                <div className="flex items-baseline text-white mb-6">
                  <span className="text-4xl md:text-5xl font-extrabold tracking-tight">{tier.price}</span>
                  {tier.period && <span className="ml-1 text-slate-400 text-sm font-semibold">{tier.period}</span>}
                </div>

                {/* Features List */}
                <ul className="space-y-4 border-t border-slate-800/60 pt-6 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.popular ? 'text-violet-400' : 'text-slate-400'}`} />
                      <span className="text-slate-300 text-xs leading-relaxed">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => setCurrentTab('dashboard')}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold text-center transition-all ${
                  tier.popular
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow shadow-violet-500/25'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
              >
                {tier.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Security / FAQ badges */}
        <div className="mt-12 flex justify-center items-center space-x-6 text-slate-500 text-xs">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-violet-500/60" />
            <span>Secure 256-bit SSL checkout</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
          <div>30-day money back guarantee</div>
        </div>

      </div>
    </section>
  );
}
