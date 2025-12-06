"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How is this different from a mixer?",
      answer:
        "Unlike traditional mixers that pool funds together, Hidden Layer uses advanced cryptographic techniques like zero-knowledge proofs to provide privacy without pooling. This means faster transactions, lower fees (no 3-5% mixer fees), and it's fully compliant with regulations.",
    },
    {
      question: "Is this legal in my country?",
      answer:
        "Hidden Layer is designed to be compliant with international regulations. We provide privacy, not anonymity for illicit activities. Users are responsible for ensuring compliance with their local laws. Our technology is legal in most jurisdictions as it doesn't involve fund mixing or obscuring the source of funds.",
    },
    {
      question: "Can my transactions be traced?",
      answer:
        "No. Transactions routed through Hidden Layer use advanced cryptography to ensure complete privacy. The transaction appears on-chain, but the link between sender and recipient is cryptographically broken. Even we cannot trace your transactions.",
    },
    {
      question: "How much does it cost?",
      answer:
        "Our fees are transparent and significantly lower than traditional privacy solutions. You only pay standard gas fees plus a small service fee (typically 0.1-0.5% compared to 3-5% for mixers). There are no subscriptions or hidden costs.",
    },
    {
      question: "Which blockchains are supported?",
      answer:
        "Currently, we support Ethereum, Binance Smart Chain (BSC), and Polygon. We're actively working on adding more chains including Arbitrum, Optimism, and Avalanche. Cross-chain privacy transfers are also in development.",
    },
    {
      question: "Is my wallet address exposed?",
      answer:
        "Your wallet address is never linked to the recipient's address publicly. While your address initiates the transaction, the connection to where funds ultimately arrive is cryptographically hidden through our protocol.",
    },
    {
      question: "What happens if a transaction fails?",
      answer:
        "If a transaction fails before being committed to the blockchain, your funds remain in your wallet. If it fails after commitment, our protocol ensures your funds are safely returned to your address minus gas fees. Failed transactions are rare due to our robust testing.",
    },
    {
      question: "Do you keep any logs?",
      answer:
        "Absolutely not. We operate a strict no-logs policy. Our system is designed so that even we cannot access information about who sent what to whom. All transaction routing is handled through decentralized, trustless smart contracts.",
    },
  ];

  return (
    <section className="relative min-h-screen bg-deep_space_blue-100 overflow-hidden py-20 px-4">
      {/* Rounded Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[700px] h-[700px] rounded-full bg-gradient-radial from-dark_teal-800/15 via-dark_teal-800/5 to-transparent blur-3xl" />
        <div className="absolute bottom-1/3 left-1/3 w-[600px] h-[600px] rounded-full bg-gradient-radial from-midnight_violet-800/10 via-midnight_violet-800/3 to-transparent blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Common{" "}
            <span className="bg-gradient-to-r from-midnight_violet-800 to-stormy_teal-800 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>
          <p className="text-lg text-white">
            Everything you need to know about Hidden Layer
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="glass rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-glow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/5 transition-all"
              >
                <span className="text-lg font-semibold text-white pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-stormy_teal-900 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-5 text-white leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center glass-dark rounded-3xl p-8">
          <h3 className="text-2xl font-bold text-white mb-3">
            Still have questions?
          </h3>
          <p className="text-white mb-6">
            Our team is here to help you understand how Hidden Layer can protect
            your privacy
          </p>
          <button className="px-8 py-3 rounded-full bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all">
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
}
