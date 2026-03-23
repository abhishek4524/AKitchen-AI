// client/src/pages/Contact.jsx
import React from "react";
import StaticPageLayout from "../components/StaticPageLayout";

const Contact = () => {
  return (
    <StaticPageLayout
      title="Contact"
      subtitle="Get in touch with the AKitchen AI team."
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Email</h2>
            <p className="text-gray-700">abhishekchhatraliya@gmail.com</p>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Business / Partnerships
            </h2>
            <p className="text-gray-700">trendwithashorts@gmail.com</p>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Response Time</h2>
            <p className="text-gray-700">
              We usually reply within 24–48 hours.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#f6a7a8] to-[#f8c6c7] rounded-3xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-3">Let’s connect</h2>
          <p className="text-white/90 leading-7 mb-6">
            Whether you have feedback, support questions, or partnership ideas,
            we would love to hear from you.
          </p>

          <div className="space-y-3 text-white/95">
            <p>• Product feedback</p>
            <p>• Bug reports</p>
            <p>• Collaborations</p>
            <p>• Media and community outreach</p>
          </div>
        </div>
      </div>
    </StaticPageLayout>
  );
};

export default Contact;