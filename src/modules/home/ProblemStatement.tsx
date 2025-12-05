"use client";

import { Eye, TrendingUp, Target } from "lucide-react";

export default function ProblemStatement() {
  const problems = [
    {
      icon: Eye,
      stat: "100%",
      label: "Transactions Publicly Visible",
      description:
        "Anyone can see your entire transaction history on the blockchain",
    },
    {
      icon: TrendingUp,
      stat: "∞",
      label: "Wallet Balance Tracked",
      description: "Your wealth and spending patterns are exposed to everyone",
    },
    {
      icon: Target,
      stat: "24/7",
      label: "Constant Surveillance Risk",
      description:
        "Competitors and bad actors can monitor your every transaction",
    },
  ];

  return (
    <section className="relative min-h-screen bg-background-secondary overflow-hidden py-20 px-4">
      {/* Rounded Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-radial from-accent/15 via-accent/5 to-transparent blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-gradient-radial from-primary/10 via-primary/3 to-transparent blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            The Problem with{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Public Blockchains
            </span>
          </h2>
          <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
            Every transaction you make is permanently recorded and visible to
            anyone—forever.
          </p>
        </div>

        {/* Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="glass-dark rounded-3xl p-8 hover:shadow-glow transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <problem.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-5xl font-bold text-gradient mb-2">
                  {problem.stat}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {problem.label}
                </h3>
                <p className="text-sm text-foreground-muted leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pain Points */}
        <div className="glass rounded-3xl p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
            What This Means For You
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              "🏢 Competitors tracking your business transactions and strategies",
              "👁️ Personal spending habits exposed to the public",
              "⚠️ Security risks from displaying your wallet balance",
              "📊 No financial privacy in the decentralized world",
            ].map((point, index) => (
              <div
                key={index}
                className="flex items-start gap-3 text-foreground-secondary"
              >
                <span className="text-2xl">{point.split(" ")[0]}</span>
                <span className="flex-1">{point.substring(3)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
