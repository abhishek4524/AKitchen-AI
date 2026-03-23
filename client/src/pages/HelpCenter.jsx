// client/src/pages/HelpCenter.jsx
import React from "react";
import StaticPageLayout from "../components/StaticPageLayout";

const HelpCenter = () => {
  const faqs = [
    {
      q: "How does AKitchen AI work?",
      a: "You enter ingredients, choose preferences, and the AI generates a recipe with steps and supporting details.",
    },
    {
      q: "Can I save recipes?",
      a: "Yes. Saved recipes can be stored in your account and viewed later from your profile or saved section.",
    },
    {
      q: "Does it create grocery lists?",
      a: "Yes. Grocery lists can be generated from recipe ingredients for easier shopping and planning.",
    },
    {
      q: "What if the AI gives a recipe I don’t like?",
      a: "You can generate again with different ingredients, cuisine, or diet preferences.",
    },
    {
      q: "Is my data secure?",
      a: "We aim to keep your data protected and only use it for product functionality and support.",
    },
  ];

  return (
    <StaticPageLayout
      title="Help Center"
      subtitle="Find quick answers to common questions about AKitchen AI."
    >
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 border border-gray-100 rounded-2xl p-5"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.q}
              </h3>
              <p className="text-gray-700 leading-7">{item.a}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#fff7f8] border border-[#f6a7a8]/30 rounded-2xl p-6 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Need more help?
          </h2>
          <p className="text-gray-700 mb-4">
            Reach out to us and we will reply as soon as possible.
          </p>
          <p className="font-semibold text-gray-900">support@akitchen.ai</p>
        </div>
      </div>
    </StaticPageLayout>
  );
};

export default HelpCenter;