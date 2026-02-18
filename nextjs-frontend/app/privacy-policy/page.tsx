import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Privacy Policy' };

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="section-title text-4xl mb-4">Privacy Policy</h1>
      <p className="text-[11px] tracking-wide text-gray-400 mb-10">Last updated: January 2025</p>

      <div className="prose prose-sm max-w-none space-y-6 text-sm leading-relaxed" style={{ color: '#555' }}>
        <section>
          <h2 className="font-serif text-xl font-semibold mb-3" style={{ color: '#2c2c2c' }}>1. Information We Collect</h2>
          <p>We collect information you provide directly, including your name, email address, phone number, and any messages you send through our contact form or partner application forms.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold mb-3" style={{ color: '#2c2c2c' }}>2. How We Use Your Information</h2>
          <p>We use the information we collect to respond to your enquiries, process applications, improve our products and services, and send you updates about YuvaGlow (only with your consent).</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold mb-3" style={{ color: '#2c2c2c' }}>3. Information Sharing</h2>
          <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as required by law or to trusted service providers who assist in operating our website.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold mb-3" style={{ color: '#2c2c2c' }}>4. Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold mb-3" style={{ color: '#2c2c2c' }}>5. Cookies</h2>
          <p>Our website may use cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold mb-3" style={{ color: '#2c2c2c' }}>6. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:hello@yuvaglow.com" className="text-[#C38636]">hello@yuvaglow.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
