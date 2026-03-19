export default function Terms() {
  return (
    <div className="py-16"><div className="container max-w-3xl">
      <h1 className="font-display text-4xl font-bold mb-6">Terms of Service</h1>
      <div className="prose prose-sm text-muted-foreground space-y-4">
        <p>By using LeanOps, you agree to these terms of service.</p>
        <h2 className="text-lg font-semibold text-foreground">Use of Service</h2>
        <p>LeanOps is provided as a platform for operational excellence learning and problem solving. You are responsible for the accuracy of data you enter.</p>
        <h2 className="text-lg font-semibold text-foreground">Accounts</h2>
        <p>You must provide accurate information when creating an account. You are responsible for maintaining the security of your account credentials.</p>
        <h2 className="text-lg font-semibold text-foreground">Intellectual Property</h2>
        <p>Content you create on LeanOps remains yours. Platform content, design, and code are the intellectual property of Saad AHIZOUN.</p>
        <h2 className="text-lg font-semibold text-foreground">Limitation of Liability</h2>
        <p>LeanOps is provided "as is" without warranties. We are not liable for decisions made based on platform content.</p>
        <p className="text-xs">Last updated: {new Date().getFullYear()}</p>
      </div>
    </div></div>
  );
}
