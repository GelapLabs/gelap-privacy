"use client";

import { Lock, Zap, Eye, ShieldCheck, DollarSign, Globe } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Lock,
      title: "Military-Grade Encryption",
      description:
        "End-to-end encryption with zero-knowledge proofs ensures no one can trace your transactions",
      features: [
        "256-bit encryption",
        "Zero-knowledge proofs",
        "No transaction history",
      ],
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Instant transfers with minimal gas fees across multiple blockchain networks",
      features: ["Instant transfers", "Low gas fees", "Multi-chain support"],
    },
    {
      icon: Eye,
      title: "Complete Anonymity",
      description:
        "Your identity remains completely private—no KYC, no tracking, no compromise",
      features: [
        "No KYC required",
        "Untraceable transactions",
        "IP protection",
      ],
    },
    {
      icon: ShieldCheck,
      title: "Blockchain Verified",
      description:
        "Trustless protocol with open-source code, audited by leading security firms",
      features: ["Trustless protocol", "Open-source code", "Security audited"],
    },
    {
      icon: DollarSign,
      title: "Cost Effective",
      description:
        "Save up to 90% on transaction fees compared to traditional privacy solutions",
      features: ["90% lower fees", "No subscription", "Pay per use"],
    },
    {
      icon: Globe,
      title: "Multi-Chain Support",
      description:
        "Seamless private transactions across Ethereum, BSC, Polygon, and more",
      features: ["Ethereum", "BSC & Polygon", "More chains coming"],
    },
  ];

  return (
    <section className="relative min-h-screen bg-deep_space_blue-100 overflow-hidden py-20 px-4">
      {/* Rounded Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-[700px] h-[700px] rounded-full bg-gradient-radial from-midnight_violet-800/20 via-midnight_violet-800/5 to-transparent blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-[600px] h-[600px] rounded-full bg-gradient-radial from-dark_teal-800/15 via-dark_teal-800/5 to-transparent blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Built for{" "}
            <span className="bg-gradient-to-r from-midnight_violet-800 to-dark_teal-800 bg-clip-text text-transparent">
              Privacy
            </span>
            , Designed for{" "}
            <span className="bg-gradient-to-r from-stormy_teal-800 to-dark_teal-800 bg-clip-text text-transparent">
              Simplicity
            </span>
          </h2>
          <p className="text-lg text-white max-w-2xl mx-auto">
            Everything you need to keep your blockchain transactions completely
            private
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass rounded-3xl p-8 hover:shadow-glow transition-all duration-300 hover:-translate-y-1 group"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-midnight_violet-800 to-dark_teal-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-white" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white mb-3">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-white mb-6 leading-relaxed">
                {feature.description}
              </p>

              {/* Feature List */}
              <ul className="space-y-2">
                {feature.features.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-white"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-midnight_violet-800 to-dark_teal-800" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-white mb-4">
            Ready to experience true blockchain privacy?
          </p>
          <button className="px-8 py-4 rounded-full bg-gradient-to-r from-midnight_violet-600 to-stormy_teal-600 hover:from-stormy_teal-600 hover:to-dark_teal-600 shadow-glow hover:shadow-glow-lg font-semibold text-white transition-all duration-300">
            Start Private Transfer
          </button>
        </div>
      </div>
    </section>
  );
}
