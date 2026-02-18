import { Metadata } from 'next';

export const metadata: Metadata = { title: 'Terms of Use' };

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="section-title text-4xl mb-4">Terms of Use</h1>
      <p className="text-[11px] tracking-wide text-gray-400 mb-10">Last updated: January 2025</p>

      <div className="prose prose-sm max-w-none space-y-6 text-sm leading-relaxed" style={{ color: '#555' }}>
        <section>
          <h2 className="font-serif text-xl font-semibold mb-3" style={{ color: '#2c2c2c' }}>1. Acceptance of Terms</h2>
          <p>By accessing and using the YuvaGlow website, you accept and agree to be bound by these Terms of Use. If you do not agree, please do not use our website.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold mb-3" style={{ color: '#2c2c2c' }}>2. Use of the Website</h2>
          <p>You agree to use this website only for lawful purposes. You must not use the site in any way that violates applicable laws, regulations, or the rights of others.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold mb-3" style={{ color: '#2c2c2c' }}>3. Intellectual Property</h2>
          <p>All content on this website, including text, images, logos, and product information, is the property of YuvaGlow Professional Co. and is protected by applicable intellectual property laws.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold mb-3" style={{ color: '#2c2c2c' }}>4. Product Information</h2>
          <p>We strive to ensure that product descriptions and prices are accurate. However, we reserve the right to correct any errors, and prices are subject to change without notice.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold mb-3" style={{ color: '#2c2c2c' }}>5. Limitation of Liability</h2>
          <p>YuvaGlow Professional Co. shall not be liable for any indirect, incidental, or consequential damages arising from your use of this website or our products.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold mb-3" style={{ color: '#2c2c2c' }}>6. Changes to Terms</h2>
          <p>We may update these terms from time to time. Continued use of the website after changes constitutes acceptance of the new terms.</p>
        </section>

        <section>
          <h2 className="font-serif text-xl font-semibold mb-3" style={{ color: '#2c2c2c' }}>7. Contact</h2>
          <p>For questions about these terms, contact us at <a href="mailto:hello@yuvaglow.com" className="text-[#C38636]">hello@yuvaglow.com</a>.</p>
        </section>
      </div>
    </div>
  );
}
