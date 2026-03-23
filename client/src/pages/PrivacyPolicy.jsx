// client/src/pages/PrivacyPolicy.jsx
import React from "react";
import StaticPageLayout from "../components/StaticPageLayout";

const PrivacyPolicy = () => {
  return (
    <StaticPageLayout
      title="Privacy Policy"
      subtitle="How AKitchen AI collects, uses, and protects your information."
    >
      <div className="space-y-8 text-gray-700 leading-7">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">1. Overview</h2>
          <p>
            AKitchen AI respects your privacy. This page explains what data we
            may collect, how we use it, and the choices you have while using our
            website and services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">2. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Account details such as name, email, and login information.</li>
            <li>Recipe inputs such as ingredients, cuisine, and dietary preferences.</li>
            <li>Usage data like pages visited, clicks, and feature interactions.</li>
            <li>Device and browser information for performance and security.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">3. How We Use Information</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To generate recipes and improve your experience.</li>
            <li>To save your preferences and show relevant content.</li>
            <li>To improve product quality, security, and reliability.</li>
            <li>To communicate important updates or support messages.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Data Sharing</h2>
          <p>
            We do not sell your personal data. We may share limited information
            with trusted service providers only when needed to operate the
            service, such as hosting, analytics, or authentication tools.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Cookies</h2>
          <p>
            We may use cookies or similar technologies to keep you signed in,
            remember settings, and understand how the product is used.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Your Choices</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>You can update or delete your account information where available.</li>
            <li>You may disable cookies in your browser settings.</li>
            <li>You can contact us for privacy-related questions or requests.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Contact</h2>
          <p>
            For privacy concerns, email us at{" "}
            <span className="font-semibold">support@akitchen.ai</span>.
          </p>
        </section>

        <p className="text-sm text-gray-500 pt-4 border-t">
          Last updated: March 2026
        </p>
      </div>
    </StaticPageLayout>
  );
};

export default PrivacyPolicy;