import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy | CueSports Africa",
  description: "CueSports Africa Cookie Policy",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">CueSports Africa Cookie Policy</h1>

        <div className="space-y-8 text-sm leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold mb-4">Cookies</h2>
            <p>Like most websites, CueSports Africa uses cookies to help our platform function properly and to improve your experience.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">What is a cookie?</h2>
            <p>A cookie is a small piece of data stored on your device by your web browser when you visit a website. Cookies allow the site to recognise your device and remember certain information about your visit, such as your preferred settings, login status, and browsing activity. This means you do not need to re-enter information each time you return or move between pages.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">How CueSports Africa uses cookies</h2>
            <p className="mb-4">We use cookies on our platform for several purposes:</p>

            <p className="mb-2"><strong>Essential cookies:</strong> These are necessary for the website to function. They enable core features like user authentication, session management, and security. Without these cookies, services you have requested cannot be provided.</p>

            <p className="mb-2"><strong>Preference cookies:</strong> These remember choices you make, such as your language setting, display preferences, or whether you have dismissed a notification. They help provide a more personalised experience.</p>

            <p className="mb-2"><strong>Session cookies:</strong> These keep you logged in as you navigate between pages. They are temporary and are deleted when you close your browser.</p>

            <p><strong>Consent cookies:</strong> These remember whether you have accepted or declined our use of cookies, so we do not repeatedly ask for your preference.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Third-party cookies</h2>
            <p className="mb-4">Some pages on our platform may include content or services from third parties, which may set their own cookies. We do not control these cookies. The main third-party cookies you may encounter are:</p>

            <p className="mb-2"><strong>Analytics cookies:</strong> We use analytics tools to understand how visitors use our platform. This helps us identify which features are popular, where users encounter difficulties, and how we can improve the service. These tools collect information anonymously and report trends without identifying individual visitors. For example, we may use services like Google Analytics to gather this data.</p>

            <p><strong>Advertising cookies:</strong> We may work with advertising partners to display relevant advertisements on our platform or to measure the effectiveness of our marketing campaigns. These cookies track your browsing activity to help deliver ads that may be of interest to you.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Embedded content</h2>
            <p>Our platform may include embedded videos or content from other websites. When you view this content, the third-party provider may set cookies to track usage statistics. These cookies are governed by the privacy policies of those third parties, not this Cookie Policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Managing your cookie preferences</h2>
            <p className="mb-4">You have control over the cookies stored on your device. Most web browsers allow you to:</p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>View the cookies stored on your device</li>
              <li>Delete some or all cookies</li>
              <li>Block cookies from specific sites</li>
              <li>Block all cookies from being set</li>
              <li>Receive a warning before a cookie is stored</li>
            </ul>
            <p className="mb-4">Each browser handles cookie settings differently. Check your browser's help section for instructions on how to manage cookies.</p>
            <p>Please note that if you choose to block or delete cookies, some features of CueSports Africa may not function properly. You may need to manually adjust your preferences each time you visit, and certain services may become unavailable.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Updates to this policy</h2>
            <p>We may update this Cookie Policy from time to time to reflect changes in our practices or for legal reasons. We encourage you to review this page periodically. Continued use of our platform after changes are posted constitutes your acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Contact us</h2>
            <p>If you have questions about our use of cookies, please contact us at <a href="mailto:privacy@cuesportsafrica.com" className="text-primary hover:underline">privacy@cuesportsafrica.com</a>.</p>
          </section>

          <div className="mt-12 pt-8 border-t text-muted-foreground">
            <p>Last updated: January 2025</p>
            <p className="mt-4">
              <Link href="/" className="text-primary hover:underline">← Back to Home</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
