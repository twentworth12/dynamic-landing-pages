'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { extractUTMParams, hasUTMParams, formatUTMDescription, UTMParams } from '@/lib/utm';

function HomeContent() {
  const searchParams = useSearchParams();
  const [headline, setHeadline] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [utmParams, setUtmParams] = useState<UTMParams>({});

  useEffect(() => {
    const params = extractUTMParams(searchParams);
    setUtmParams(params);

    if (hasUTMParams(params)) {
      fetchPersonalizedMessage(params);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const parseMessage = (message: string) => {
    // Remove markdown bold markers and parse the message
    const cleanMessage = message.replace(/\*\*/g, '');

    // Try to extract headline and description
    const headlineMatch = cleanMessage.match(/Headline:\s*(.+?)(?:\n|Description:|$)/i);
    // Use [\s\S] instead of 's' flag for compatibility
    const descriptionMatch = cleanMessage.match(/Description:\s*([\s\S]+?)$/i);

    if (headlineMatch && descriptionMatch) {
      return {
        headline: headlineMatch[1].trim(),
        description: descriptionMatch[1].trim()
      };
    }

    // Fallback: split by newlines and use first line as headline
    const lines = cleanMessage.split('\n').filter(line => line.trim());
    return {
      headline: lines[0] || 'Welcome!',
      description: lines.slice(1).join(' ') || ''
    };
  };

  const fetchPersonalizedMessage = async (params: UTMParams) => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-message-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ utmParams: params }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch message');
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullMessage = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          fullMessage += chunk;

          // Parse and update UI as we receive content
          const parsed = parseMessage(fullMessage);
          setHeadline(parsed.headline);
          setDescription(parsed.description);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching personalized message:', error);
      setHeadline('Welcome!');
      setDescription('We\'re glad you\'re here.');
      setLoading(false);
    }
  };

  return (
    <div className="font-sans min-h-screen bg-[#F8F5F0]">
      {/* Navigation */}
      <nav className="bg-white border-b border-[#ECECED]">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between max-w-6xl">
          <Link href="/" className="text-xl font-bold text-[#161618]">
            incident.io
          </Link>
          <Link
            href="/ads"
            className="text-sm text-[#656567] hover:text-[#161618] transition-colors font-medium"
          >
            View Sample Ads →
          </Link>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-20 max-w-5xl">
        {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F25533]"></div>
              <p className="mt-4 text-[#656567]">Personalizing your experience...</p>
            </div>
          ) : hasUTMParams(utmParams) ? (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-bold text-[#161618] mb-6 leading-tight tracking-tight">
                  {headline || 'Welcome!'}
                </h1>
                <div className="max-w-3xl mx-auto">
                  <p className="text-xl md:text-2xl text-[#656567] leading-relaxed">
                    {description}
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
                <button className="bg-[#F25533] hover:bg-[#e14a2c] text-white font-semibold py-4 px-10 rounded-lg transition-all hover:scale-105 shadow-lg">
                  Get Started Free
                </button>
                <button className="bg-white hover:bg-[#F8F5F0] text-[#161618] font-semibold py-4 px-10 rounded-lg transition-all border-2 border-[#ECECED]">
                  Book a Demo
                </button>
              </div>

              <div className="bg-white rounded-xl p-6 border border-[#ECECED] shadow-sm">
                <h2 className="text-xs font-semibold text-[#A2A2A3] uppercase tracking-wider mb-3">
                  Campaign Tracking
                </h2>
                <p className="text-sm text-[#656567]">
                  {formatUTMDescription(utmParams)}
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h1 className="text-5xl md:text-6xl font-bold text-[#161618] mb-6 leading-tight tracking-tight">
                  AI-Powered Dynamic Landing Pages
                </h1>
                <p className="text-xl md:text-2xl text-[#656567] leading-relaxed max-w-3xl mx-auto">
                  Personalize your marketing campaigns with AI-generated messaging that adapts to your UTM parameters
                </p>
              </div>

              <div className="flex gap-4 justify-center mb-20">
                <Link
                  href="/ads"
                  className="bg-[#F25533] hover:bg-[#e14a2c] text-white font-semibold py-4 px-10 rounded-lg transition-all hover:scale-105 shadow-lg inline-block"
                >
                  View Sample Ads
                </Link>
              </div>

              <div className="bg-white rounded-xl p-8 border border-[#ECECED] shadow-sm">
                <h2 className="text-lg font-semibold text-[#161618] mb-4">
                  How it works
                </h2>
                <p className="text-[#656567] mb-6">
                  Add UTM parameters to your URL to see AI-generated personalized messaging. For example:
                </p>
                <code className="block bg-[#161618] text-[#F25533] p-4 rounded-lg text-sm overflow-x-auto mb-6 font-mono">
                  ?utm_source=google&utm_medium=cpc&utm_campaign=spring_sale&utm_term=shoes
                </code>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-[#161618] mb-2">
                      Supported Parameters:
                    </h3>
                    <ul className="text-sm text-[#656567] space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-[#A2A2A3]">•</span>
                        <span><strong className="text-[#161618]">utm_source:</strong> Traffic source</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#A2A2A3]">•</span>
                        <span><strong className="text-[#161618]">utm_medium:</strong> Marketing medium</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#A2A2A3]">•</span>
                        <span><strong className="text-[#161618]">utm_campaign:</strong> Campaign name</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#A2A2A3]">•</span>
                        <span><strong className="text-[#161618]">utm_term:</strong> Keywords</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#A2A2A3]">•</span>
                        <span><strong className="text-[#161618]">utm_content:</strong> Ad variant</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-[#F8F5F0] rounded-lg p-4 border border-[#E4D9C8]">
                    <h3 className="text-sm font-semibold text-[#161618] mb-2">
                      Powered by:
                    </h3>
                    <p className="text-sm text-[#656567]">
                      OpenAI GPT-4o-mini generates contextual, engaging content that matches your campaign parameters in real-time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="font-sans min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F25533]"></div>
          <p className="mt-4 text-[#656567]">Loading...</p>
        </div>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}
