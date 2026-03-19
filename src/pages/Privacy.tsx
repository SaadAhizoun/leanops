export default function Privacy() {
  return (
    <div className="py-16"><div className="container max-w-3xl">
      <h1 className="font-display text-4xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose prose-sm text-muted-foreground space-y-4">
        <p>LeanOps is committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.</p>
        <h2 className="text-lg font-semibold text-foreground">Information We Collect</h2>
        <p>We collect information you provide when creating an account (name, email), data you enter while using the platform (cases, projects, assessments), and basic usage analytics.</p>
        <h2 className="text-lg font-semibold text-foreground">How We Use Your Data</h2>
        <p>Your data is used solely to provide and improve the LeanOps platform. We do not sell your data to third parties.</p>
        <h2 className="text-lg font-semibold text-foreground">Data Security</h2>
        <p>All data is stored securely with encryption at rest and in transit. Access is controlled through authentication and row-level security policies.</p>
        <h2 className="text-lg font-semibold text-foreground">Contact</h2>
        <p>For privacy questions, contact us through the Contact page.</p>
        <p className="text-xs">Last updated: {new Date().getFullYear()}</p>
      </div>
    </div></div>
  );
}
