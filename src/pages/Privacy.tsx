export default function Privacy() {
  return (
    <div className="page-section">
      <div className="container">
        <div className="legal-shell">
          <p className="page-eyebrow">Legal</p>
          <h1 className="page-title">Privacy Policy</h1>
          <div className="legal-prose mt-6">
            <p>
              LeanOps is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.
            </p>
            <h2>Information We Collect</h2>
            <p>
              We collect information you provide when creating an account, data you enter while using the platform, and basic usage analytics needed to operate the service.
            </p>
            <h2>How We Use Your Data</h2>
            <p>
              Your data is used solely to provide and improve the LeanOps platform. We do not sell your data to third parties.
            </p>
            <h2>Data Security</h2>
            <p>
              All data is stored securely with encryption at rest and in transit. Access is controlled through authentication and row-level security policies.
            </p>
            <h2>Contact</h2>
            <p>For privacy questions, contact us through the Contact page.</p>
            <p className="text-xs text-slate-500">Last updated: {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
