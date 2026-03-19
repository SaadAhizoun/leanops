export default function Terms() {
  return (
    <div className="page-section">
      <div className="container">
        <div className="legal-shell">
          <p className="page-eyebrow">Legal</p>
          <h1 className="page-title">Terms of Service</h1>
          <div className="legal-prose mt-6">
            <p>By using LeanOps, you agree to these terms of service.</p>
            <h2>Use of Service</h2>
            <p>
              LeanOps is provided as a platform for operational excellence learning and problem solving. You are responsible for the accuracy of the data you enter.
            </p>
            <h2>Accounts</h2>
            <p>
              You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials.
            </p>
            <h2>Intellectual Property</h2>
            <p>
              Content you create on LeanOps remains yours. Platform content, design, and code are the intellectual property of Saad AHIZOUN.
            </p>
            <h2>Limitation of Liability</h2>
            <p>LeanOps is provided as is without warranties. We are not liable for decisions made based on platform content.</p>
            <p className="text-xs text-slate-500">Last updated: {new Date().getFullYear()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
