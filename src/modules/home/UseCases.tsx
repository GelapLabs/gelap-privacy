"use client";

import { Briefcase, User, Building2, Gem, TrendingUp } from "lucide-react";

export default function UseCases() {
  const useCases = [
    {
      icon: Briefcase,
      emoji: "💼",
      title: "Business Owners",
      subtitle: "Protect Your Commercial Edge",
      description:
        "Keep supplier payments and business transactions confidential from competitors and market analysts",
      benefits: [
        "Hide vendor relationships",
        "Protect pricing strategies",
        "Maintain competitive advantage",
      ],
    },
    {
      icon: User,
      emoji: "👤",
      title: "Individual Users",
      subtitle: "Your Money, Your Privacy",
      description:
        "Protect your personal financial privacy and keep spending habits away from prying eyes",
      benefits: [
        "Private personal transactions",
        "Protected salary & payments",
        "Confidential purchases",
      ],
    },
    {
      icon: Building2,
      emoji: "🏢",
      title: "DAOs & Organizations",
      subtitle: "Institutional-Grade Privacy",
      description:
        "Maintain treasury privacy while staying compliant with regulations and stakeholder expectations",
      benefits: [
        "Treasury management",
        "Anonymous voting",
        "Confidential grants",
      ],
    },
    {
      icon: Gem,
      emoji: "💎",
      title: "NFT Collectors",
      subtitle: "Collect in Private",
      description:
        "Hide your collection value from public view and protect yourself from targeted attacks",
      benefits: [
        "Private NFT purchases",
        "Hidden collection value",
        "Protected identity",
      ],
    },
    {
      icon: TrendingUp,
      emoji: "🚀",
      title: "DeFi Traders",
      subtitle: "Trade Without Exposing Strategy",
      description:
        "Keep your trading strategies private and prevent front-running or copycat traders",
      benefits: [
        "Strategy protection",
        "No front-running",
        "Private portfolio",
      ],
    },
  ];

  return (
    <section className="relative min-h-screen bg-background overflow-hidden py-20 px-4">
      {/* Rounded Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/3 w-[700px] h-[700px] rounded-full bg-gradient-radial from-secondary/15 via-secondary/5 to-transparent blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-radial from-primary/10 via-primary/3 to-transparent blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Perfect For{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Everyone
            </span>
          </h2>
          <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
            No matter your use case, Hidden Layer provides the privacy
            protection you need
          </p>
        </div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {useCases.slice(0, 3).map((useCase, index) => (
            <div
              key={index}
              className="glass-dark rounded-3xl p-8 hover:shadow-glow transition-all duration-300 group"
            >
              {/* Emoji & Icon */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl">{useCase.emoji}</span>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <useCase.icon className="w-6 h-6 text-secondary" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {useCase.title}
              </h3>
              <p className="text-sm text-secondary font-semibold mb-4">
                {useCase.subtitle}
              </p>
              <p className="text-foreground-secondary mb-6 leading-relaxed">
                {useCase.description}
              </p>

              {/* Benefits */}
              <ul className="space-y-2">
                {useCase.benefits.map((benefit, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-foreground-muted"
                  >
                    <span className="text-success">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Row - 2 Cards Centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {useCases.slice(3).map((useCase, index) => (
            <div
              key={index}
              className="glass-dark rounded-3xl p-8 hover:shadow-glow transition-all duration-300 group"
            >
              {/* Emoji & Icon */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-5xl">{useCase.emoji}</span>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <useCase.icon className="w-6 h-6 text-secondary" />
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-foreground mb-1">
                {useCase.title}
              </h3>
              <p className="text-sm text-secondary font-semibold mb-4">
                {useCase.subtitle}
              </p>
              <p className="text-foreground-secondary mb-6 leading-relaxed">
                {useCase.description}
              </p>

              {/* Benefits */}
              <ul className="space-y-2">
                {useCase.benefits.map((benefit, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-foreground-muted"
                  >
                    <span className="text-success">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
