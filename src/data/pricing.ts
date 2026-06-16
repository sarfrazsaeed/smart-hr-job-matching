export interface PricingPlan {
    name: string
    monthlyUSD: number | null
    yearlyUSD: number | null
    monthlyPKR: number | null
    yearlyPKR: number | null
    description: string
    features: string[]
    notIncluded: string[]
    highlighted: boolean
    badge?: string
    cta: string
    ctaVariant: 'primary' | 'secondary' | 'ghost'
  }
  
  export const plans: PricingPlan[] = [
    {
      name: 'Free',
      monthlyUSD: 0,
      yearlyUSD:  0,
      monthlyPKR: 0,
      yearlyPKR:  0,
      description: 'Perfect for individuals exploring HR matching for the first time.',
      features: [
        'Up to 10 candidates',
        'Up to 3 job postings',
        'Basic skill matching',
        'CSV export',
        'Dashboard analytics',
        'GitHub Pages hosting',
      ],
      notIncluded: [
        'Resume PDF parsing',
        'Priority support',
        'API access',
        'Custom branding',
      ],
      highlighted: false,
      cta: 'Get started free',
      ctaVariant: 'secondary',
    },
    {
      name: 'Pro',
      monthlyUSD: 19,
      yearlyUSD:  15,
      monthlyPKR: 5300,
      yearlyPKR:  4200,
      description: 'For HR teams and recruiters who need full matching power.',
      features: [
        'Unlimited candidates',
        'Unlimited job postings',
        'Advanced skill matching',
        'Resume PDF parsing',
        'CSV + PDF export',
        'Full dashboard analytics',
        'Priority email support',
        'API access (coming soon)',
      ],
      notIncluded: [
        'Custom branding',
        'Dedicated account manager',
      ],
      highlighted: true,
      badge: 'Most Popular',
      cta: 'Start free trial',
      ctaVariant: 'primary',
    },
    {
      name: 'Enterprise',
      monthlyUSD: null,
      yearlyUSD:  null,
      monthlyPKR: null,
      yearlyPKR:  null,
      description: 'For large organisations with advanced security and scale needs.',
      features: [
        'Everything in Pro',
        'Unlimited everything',
        'Django REST backend',
        'Custom branding',
        'SSO & team management',
        'Dedicated account manager',
        'Custom SLA',
        'On-premise deployment',
      ],
      notIncluded: [],
      highlighted: false,
      cta: 'Contact sales',
      ctaVariant: 'secondary',
    },
  ]
  
  export const faqs = [
    {
      q: 'Is the Free plan really free forever?',
      a: 'Yes. The Free plan has no time limit. You can use SmartHire at no cost for up to 10 candidates and 3 job postings with no credit card required.',
    },
    {
      q: 'Can I switch plans at any time?',
      a: 'Absolutely. You can upgrade, downgrade, or cancel at any time from your account settings. Changes take effect on your next billing cycle.',
    },
    {
      q: 'What payment methods do you accept?',
      a: 'We accept all major credit and debit cards (Visa, Mastercard, Amex) as well as bank transfers for Enterprise customers in Pakistan.',
    },
    {
      q: 'Is there a free trial for Pro?',
      a: 'Yes — every new account gets a 14-day free trial of the Pro plan with no credit card required.',
    },
    {
      q: 'What is the PKR exchange rate used?',
      a: 'PKR pricing is set at a fixed rate and reviewed quarterly. Current rate: 1 USD ≈ 278 PKR.',
    },
    {
      q: 'Does the backend come with Pro?',
      a: 'The Django REST backend is currently in development (Phase 5 of our roadmap). Pro subscribers will get early access when it launches.',
    },
  ]