import { CreditCard, Smartphone, Globe, Shield, Zap, Layout, Briefcase, Users, FileText, Lock } from "lucide-react"

export const marketingPages: Record<string, any> = {
  // Products
  payments: {
    title: "The complete payments platform",
    subtitle: "Payments",
    description:
      "Accept payments from customers worldwide with Taxu's unified platform. Optimize conversion and revenue with our global payments network.",
    features: [
      { title: "Global reach", description: "Accept 135+ currencies and local payment methods.", icon: Globe },
      { title: "Fraud protection", description: "Detect and block fraud with machine learning.", icon: Shield },
      { title: "Fast payouts", description: "Get paid quickly with flexible payout options.", icon: Zap },
    ],
    cta: {
      title: "Ready to get started?",
      description: "Create an account and start accepting payments in minutes.",
      buttonText: "Start with Payments",
      buttonLink: "/login",
    },
  },
  billing: {
    title: "Billing and subscriptions made easy",
    subtitle: "Billing",
    description:
      "Manage recurring revenue, invoices, and subscriptions. Automate your billing operations and reduce churn.",
    features: [
      { title: "Flexible models", description: "Support flat-rate, per-seat, or metered billing.", icon: Layout },
      { title: "Smart retry", description: "Recover failed payments automatically.", icon: Zap },
      { title: "Customer portal", description: "Let customers manage their own subscriptions.", icon: Users },
    ],
    cta: {
      title: "Simplify your billing",
      description: "Integrate Taxu Billing to streamline your revenue operations.",
      buttonText: "Start with Billing",
      buttonLink: "/login",
    },
  },
  connect: {
    title: "Payments for platforms and marketplaces",
    subtitle: "Connect",
    description:
      "Integrate payments into your platform or marketplace. Route funds, handle compliance, and pay out to users globally.",
    features: [
      { title: "Onboarding", description: "Customizable onboarding flows for your users.", icon: Users },
      { title: "Compliance", description: "Taxu handles KYC and compliance requirements.", icon: Shield },
      { title: "Global payouts", description: "Pay out to users in their local currency.", icon: Globe },
    ],
    cta: {
      title: "Build your platform",
      description: "Empower your users with payments embedded directly in your product.",
      buttonText: "Start with Connect",
      buttonLink: "/login",
    },
  },
  payouts: {
    title: "Programmatic payouts",
    subtitle: "Payouts",
    description: "Send money to bank accounts, cards, and wallets globally. Automate your payouts workflow.",
    features: [
      { title: "Mass payouts", description: "Send thousands of payouts with a single API call.", icon: Zap },
      { title: "Global coverage", description: "Reach recipients in 190+ countries.", icon: Globe },
      { title: "Real-time tracking", description: "Track payout status in real-time.", icon: FileText },
    ],
    cta: {
      title: "Start sending payouts",
      description: "Streamline your payout operations today.",
      buttonText: "Start with Payouts",
      buttonLink: "/login",
    },
  },
  issuing: {
    title: "Create your own card program",
    subtitle: "Issuing",
    description:
      "Issue physical and virtual cards for your business. Control spend and manage expenses programmatically.",
    features: [
      { title: "Instant issuance", description: "Create virtual cards instantly via API.", icon: Zap },
      { title: "Spend controls", description: "Set limits and merchant categories.", icon: Lock },
      { title: "Branded cards", description: "Design physical cards with your logo.", icon: CreditCard },
    ],
    cta: {
      title: "Launch your card program",
      description: "Start issuing cards to your team or customers.",
      buttonText: "Start with Issuing",
      buttonLink: "/login",
    },
  },
  terminal: {
    title: "In-person payments",
    subtitle: "Terminal",
    description:
      "Unified payments for online and in-person retailers. Accept chip cards, contactless payments, and mobile wallets.",
    features: [
      { title: "Pre-certified hardware", description: "Ready-to-use card readers.", icon: Smartphone },
      { title: "Unified reporting", description: "See all your sales in one place.", icon: FileText },
      { title: "Developer friendly", description: "Easy SDKs for iOS, Android, and Javascript.", icon: Layout },
    ],
    cta: {
      title: "Bring Taxu to the physical world",
      description: "Seamlessly integrate in-person payments.",
      buttonText: "Start with Terminal",
      buttonLink: "/login",
    },
  },
  tax: {
    title: "Automated tax compliance",
    subtitle: "Tax",
    description: "Calculate and collect sales tax, VAT, and GST automatically. Simplify your tax compliance globally.",
    features: [
      { title: "Real-time calculation", description: "Accurate tax rates at checkout.", icon: Zap },
      { title: "Automated filing", description: "We help generate reports for filing.", icon: FileText },
      { title: "Global coverage", description: "Support for tax rules in 100+ countries.", icon: Globe },
    ],
    cta: {
      title: "Automate your taxes",
      description: "Stop worrying about tax compliance and focus on growth.",
      buttonText: "Start with Tax",
      buttonLink: "/login",
    },
  },
  identity: {
    title: "Identity verification",
    subtitle: "Identity",
    description: "Verify the identity of your users globally. Prevent fraud and streamline compliance.",
    features: [
      { title: "Document verification", description: "Verify IDs and passports automatically.", icon: Shield },
      { title: "Biometric checks", description: "Match selfies to ID photos.", icon: Users },
      { title: "Global support", description: "Verify documents from 200+ countries.", icon: Globe },
    ],
    cta: {
      title: "Verify your users",
      description: "Add a layer of trust to your platform.",
      buttonText: "Start with Identity",
      buttonLink: "/login",
    },
  },

  // Solutions
  ecommerce: {
    title: "Unified ecommerce",
    subtitle: "Ecommerce",
    description: "The complete toolkit for online retailers. Optimize checkout, manage fraud, and grow revenue.",
    features: [
      { title: "Optimized checkout", description: "Increase conversion with our hosted payment page.", icon: Layout },
      { title: "Mobile ready", description: "Seamless experience on all devices.", icon: Smartphone },
      { title: "Global payments", description: "Accept local payment methods everywhere.", icon: Globe },
    ],
    cta: {
      title: "Grow your store",
      description: "Start selling to customers worldwide.",
      buttonText: "Start now",
      buttonLink: "/login",
    },
  },
  saas: {
    title: "Scale your SaaS business",
    subtitle: "SaaS",
    description: "Manage subscriptions, recurring billing, and revenue recognition. Built for growth.",
    features: [
      { title: "Flexible billing", description: "Usage-based, tiered, or flat-rate pricing.", icon: Layout },
      { title: "Automated retention", description: "Reduce churn with smart retries.", icon: Zap },
      { title: "Analytics", description: "Deep insights into MRR and churn.", icon: FileText },
    ],
    cta: {
      title: "Scale your SaaS",
      description: "The billing platform for modern software companies.",
      buttonText: "Start now",
      buttonLink: "/login",
    },
  },
  marketplaces: {
    title: "Payments for marketplaces",
    subtitle: "Marketplaces",
    description: "Onboard users, split payments, and handle payouts globally with Connect.",
    features: [
      { title: "Split payments", description: "Split transaction funds between multiple parties.", icon: Layout },
      { title: "Compliance", description: "We handle KYC/KYB obligations.", icon: Shield },
      { title: "Global payouts", description: "Pay sellers in their local currency.", icon: Globe },
    ],
    cta: {
      title: "Build your marketplace",
      description: "The infrastructure for the platform economy.",
      buttonText: "Start now",
      buttonLink: "/login",
    },
  },
  "embedded-finance": {
    title: "Embed financial services",
    subtitle: "Embedded Finance",
    description: "Offer banking, cards, and lending directly within your product.",
    features: [
      { title: "Banking-as-a-Service", description: "Offer accounts and routing numbers.", icon: Briefcase },
      { title: "Card issuing", description: "Issue physical and virtual cards.", icon: CreditCard },
      { title: "Lending", description: "Offer capital to your customers.", icon: Zap },
    ],
    cta: {
      title: "Embed finance",
      description: "Transform your product into a fintech platform.",
      buttonText: "Start now",
      buttonLink: "/login",
    },
  },
  platforms: {
    title: "Payments for software platforms",
    subtitle: "Platforms",
    description: "Integrate payments into your software to monetize transactions.",
    features: [
      { title: "Integrated payments", description: "Keep users on your platform.", icon: Layout },
      { title: "Revenue share", description: "Earn revenue from payments processed.", icon: Zap },
      { title: "White-label", description: "Customize the experience with your brand.", icon: Users },
    ],
    cta: {
      title: "Monetize your platform",
      description: "Add payments as a feature today.",
      buttonText: "Start now",
      buttonLink: "/login",
    },
  },
  "creator-economy": {
    title: "Powering the creator economy",
    subtitle: "Creator Economy",
    description: "Help creators monetize their work and get paid globally.",
    features: [
      { title: "Subscriptions", description: "Recurring revenue for creators.", icon: Layout },
      { title: "Tips & Donations", description: "One-time support from fans.", icon: Zap },
      { title: "Global payouts", description: "Creators get paid where they are.", icon: Globe },
    ],
    cta: {
      title: "Support creators",
      description: "Build tools for the next generation of creators.",
      buttonText: "Start now",
      buttonLink: "/login",
    },
  },
  crypto: {
    title: "Crypto onramps and payments",
    subtitle: "Crypto",
    description: "Bridge the gap between fiat and crypto. Accept payments and handle payouts.",
    features: [
      { title: "Fiat onramps", description: "Let users buy crypto with cards.", icon: CreditCard },
      { title: "NFT checkout", description: "Sell NFTs with fiat payments.", icon: Layout },
      { title: "Global compliance", description: "We handle the regulatory complexity.", icon: Shield },
    ],
    cta: {
      title: "Build web3",
      description: "The infrastructure for the crypto economy.",
      buttonText: "Start now",
      buttonLink: "/login",
    },
  },
  "global-businesses": {
    title: "Infrastructure for global business",
    subtitle: "Global Businesses",
    description: "Accept payments and move money across borders seamlessly.",
    features: [
      { title: "Local methods", description: "Offer payment methods customers trust.", icon: Globe },
      { title: "Multi-currency", description: "Present prices in local currency.", icon: Zap },
      { title: "Unified reporting", description: "One view of your global business.", icon: FileText },
    ],
    cta: {
      title: "Go global",
      description: "Expand your business to new markets.",
      buttonText: "Start now",
      buttonLink: "/login",
    },
  },

  // Resources
  support: {
    title: "How can we help?",
    subtitle: "Support",
    description: "Get the answers you need. Our support team is here to help you 24/7.",
    features: [
      { title: "24/7 Support", description: "Always here when you need us.", icon: Users },
      { title: "Documentation", description: "Detailed guides and API reference.", icon: FileText },
      { title: "Community", description: "Join our developer community.", icon: Globe },
    ],
    cta: {
      title: "Contact support",
      description: "Reach out to our team directly.",
      buttonText: "Contact us",
      buttonLink: "/contact",
    },
  },
  guides: {
    title: "Guides and resources",
    subtitle: "Guides",
    description: "In-depth guides on payments, billing, and growing your business.",
    features: [
      { title: "Payments 101", description: "Everything you need to know about online payments.", icon: CreditCard },
      { title: "SaaS Growth", description: "Strategies for scaling subscription businesses.", icon: Layout },
      { title: "Global Expansion", description: "A guide to entering new markets.", icon: Globe },
    ],
    cta: {
      title: "Explore guides",
      description: "Read our latest in-depth articles.",
      buttonText: "View all guides",
      buttonLink: "/blog",
    },
  },
  customers: {
    title: "Our customers",
    subtitle: "Customers",
    description: "See how leading companies are building their businesses with Taxu.",
    features: [
      { title: "Case studies", description: "Deep dives into customer success stories.", icon: FileText },
      { title: "Testimonials", description: "Hear directly from our users.", icon: Users },
      { title: "Showcase", description: "See innovative implementations.", icon: Layout },
    ],
    cta: {
      title: "Join them",
      description: "Start building your success story.",
      buttonText: "Start now",
      buttonLink: "/login",
    },
  },
  partners: {
    title: "Taxu Partner Program",
    subtitle: "Partners",
    description:
      "Build your business with Taxu. Join our ecosystem of agencies, consulting firms, and technology partners.",
    features: [
      { title: "Technology partners", description: "Build integrations and apps.", icon: Layout },
      { title: "Consulting partners", description: "Help businesses implement Taxu.", icon: Users },
      { title: "Benefits", description: "Access resources, support, and co-marketing.", icon: Zap },
    ],
    cta: {
      title: "Become a partner",
      description: "Apply to join the Taxu Partner Program.",
      buttonText: "Apply now",
      buttonLink: "/contact",
    },
  },

  // Company
  jobs: {
    title: "Join our team",
    subtitle: "Jobs",
    description: "Help us increase the GDP of the internet. We're hiring across engineering, sales, and more.",
    features: [
      { title: "Remote first", description: "Work from anywhere in the world.", icon: Globe },
      { title: "Impact", description: "Build infrastructure for the global economy.", icon: Zap },
      { title: "Culture", description: "Join a team of ambitious, thoughtful builders.", icon: Users },
    ],
    cta: {
      title: "View open roles",
      description: "Find your next challenge at Taxu.",
      buttonText: "See jobs",
      buttonLink: "/careers",
    },
  },
  newsroom: {
    title: "Newsroom",
    subtitle: "Newsroom",
    description: "Latest news, announcements, and press releases from Taxu.",
    features: [
      { title: "Press releases", description: "Official announcements.", icon: FileText },
      { title: "Media kit", description: "Logos, photos, and brand assets.", icon: Layout },
      { title: "In the news", description: "Coverage from top publications.", icon: Globe },
    ],
    cta: {
      title: "Contact press",
      description: "Get in touch with our communications team.",
      buttonText: "Email us",
      buttonLink: "/contact",
    },
  },
  press: {
    // Alias for newsroom/press
    title: "Taxu Press",
    subtitle: "Press",
    description: "Publishing books and guides for the next generation of entrepreneurs.",
    features: [
      { title: "Books", description: "In-depth books on business and technology.", icon: FileText },
      { title: "Guides", description: "Tactical advice for startups.", icon: Layout },
      { title: "Authors", description: "Insights from industry leaders.", icon: Users },
    ],
    cta: {
      title: "Read Taxu Press",
      description: "Explore our library of publications.",
      buttonText: "Browse books",
      buttonLink: "/blog",
    },
  },
  privacy: {
    title: "Privacy and Terms",
    subtitle: "Privacy",
    description: "We are committed to protecting your data and privacy.",
    features: [
      { title: "Privacy Policy", description: "How we handle your data.", icon: Lock },
      { title: "Terms of Service", description: "The rules of the road.", icon: FileText },
      { title: "Security", description: "Our security practices.", icon: Shield },
    ],
    cta: {
      title: "Learn more",
      description: "Read our full legal documentation.",
      buttonText: "View legal",
      buttonLink: "/security",
    },
  },
  sitemap: {
    title: "Sitemap",
    subtitle: "Sitemap",
    description: "An overview of all pages on the Taxu website.",
    features: [
      { title: "Products", description: "All our financial products.", icon: CreditCard },
      { title: "Solutions", description: "Industry-specific solutions.", icon: Layout },
      { title: "Resources", description: "Guides and documentation.", icon: FileText },
    ],
    cta: { title: "Navigate", description: "Find what you're looking for.", buttonText: "Go home", buttonLink: "/" },
  },
}
