'use client';

import Link from 'next/link';

interface AdProps {
  title: string;
  description: string;
  displayUrl: string;
  utmParams: {
    source: string;
    medium: string;
    campaign: string;
    term: string;
    content: string;
  };
}

function GoogleAd({ title, description, displayUrl, utmParams }: AdProps) {
  const targetUrl = `/?utm_source=${utmParams.source}&utm_medium=${utmParams.medium}&utm_campaign=${utmParams.campaign}&utm_term=${utmParams.term}&utm_content=${utmParams.content}`;

  return (
    <Link href={targetUrl} className="block">
      <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200 hover:shadow-lg transition-shadow cursor-pointer">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-green-500 rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-bold">Ad</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-600 mb-1">{displayUrl}</div>
            <h3 className="text-xl text-blue-700 hover:underline font-normal mb-1">
              {title}
            </h3>
            <p className="text-sm text-gray-700">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function AdsPage() {
  const ads: AdProps[] = [
    {
      title: 'Incident Management Software | incident.io - Free Trial',
      description: 'Resolve incidents faster with incident.io. Modern incident management built for Slack. Get visibility, reduce MTTR, and learn from every incident. Try free for 14 days.',
      displayUrl: 'www.incident.io/incident-management',
      utmParams: {
        source: 'google',
        medium: 'cpc',
        campaign: 'incident_management_2024',
        term: 'incident_management_software',
        content: 'ad_variant_a',
      },
    },
    {
      title: 'Best Incident Response Platform | Start Free - incident.io',
      description: 'Trusted by 500+ engineering teams. Streamline your incident response with powerful automation, real-time collaboration, and comprehensive post-mortems.',
      displayUrl: 'www.incident.io/platform',
      utmParams: {
        source: 'google',
        medium: 'cpc',
        campaign: 'incident_management_2024',
        term: 'incident_response_platform',
        content: 'ad_variant_b',
      },
    },
    {
      title: 'Reduce Downtime with incident.io | Enterprise Ready',
      description: 'Cut incident response time by 60%. Integrated with Slack, PagerDuty, and more. SOC2 compliant. Used by Vercel, Figma, and other leading tech companies.',
      displayUrl: 'www.incident.io/enterprise',
      utmParams: {
        source: 'google',
        medium: 'cpc',
        campaign: 'enterprise_q1_2024',
        term: 'reduce_downtime',
        content: 'enterprise_focused',
      },
    },
    {
      title: 'On-Call Management & Incident Tracking - incident.io',
      description: 'Manage on-call schedules, track incidents, and improve team collaboration. Simple setup, powerful features. Free for teams under 10.',
      displayUrl: 'www.incident.io/on-call',
      utmParams: {
        source: 'google',
        medium: 'cpc',
        campaign: 'on_call_management_2024',
        term: 'on_call_management_software',
        content: 'small_team_focus',
      },
    },
    {
      title: 'Incident Postmortems Made Easy | incident.io',
      description: 'Turn every incident into a learning opportunity. Automated timeline generation, collaborative postmortems, and action item tracking. Get started free.',
      displayUrl: 'www.incident.io/postmortems',
      utmParams: {
        source: 'google',
        medium: 'cpc',
        campaign: 'incident_management_2024',
        term: 'incident_postmortem_tool',
        content: 'learning_focused',
      },
    },
    {
      title: 'Site Reliability Engineering Tools | SRE Platform',
      description: 'The complete SRE toolkit for modern engineering teams. Incident management, on-call scheduling, status pages, and more. See why SRE teams choose incident.io.',
      displayUrl: 'www.incident.io/sre',
      utmParams: {
        source: 'google',
        medium: 'cpc',
        campaign: 'sre_tools_2024',
        term: 'sre_platform',
        content: 'sre_focused',
      },
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Google Search Header Mockup */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center gap-8">
            <svg className="w-24 h-8" viewBox="0 0 272 92" fill="none" xmlns="http://www.w3.org/2000/svg">
              <text x="10" y="60" fontFamily="Arial" fontSize="48" fontWeight="bold">
                <tspan fill="#4285F4">G</tspan>
                <tspan fill="#EA4335">o</tspan>
                <tspan fill="#FBBC04">o</tspan>
                <tspan fill="#4285F4">g</tspan>
                <tspan fill="#34A853">l</tspan>
                <tspan fill="#EA4335">e</tspan>
              </text>
            </svg>
            <div className="flex-1 max-w-2xl">
              <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 shadow-sm">
                <span className="text-gray-700 text-sm">incident management software</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-6 text-sm">
            <button className="text-blue-700 border-b-2 border-blue-700 pb-3">All</button>
            <button className="text-gray-700 pb-3">Images</button>
            <button className="text-gray-700 pb-3">Videos</button>
            <button className="text-gray-700 pb-3">News</button>
            <button className="text-gray-700 pb-3">Shopping</button>
            <button className="text-gray-700 pb-3">More</button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="text-sm text-gray-600 mb-6">
          About 12,400,000 results (0.48 seconds)
        </div>

        {/* Ads Section */}
        <div className="mb-8">
          {ads.map((ad, index) => (
            <GoogleAd key={index} {...ad} />
          ))}
        </div>

        {/* Organic Results Placeholder */}
        <div className="border-t border-gray-200 pt-6">
          <div className="text-sm text-gray-600 mb-4">
            Organic search results would appear below the ads...
          </div>
        </div>

        {/* Helper Text */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Demo Instructions</h3>
          <p className="text-sm text-blue-800">
            Click any ad above to see the personalized landing page with messaging that matches the specific ad and UTM parameters.
            Each ad has unique campaign tracking that will generate custom content.
          </p>
        </div>
      </div>
    </div>
  );
}
