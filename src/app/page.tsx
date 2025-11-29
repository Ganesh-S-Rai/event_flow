
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, BarChart3, Users, Mail, Layout } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 font-sans">
      {/* Header */}
      <header className="px-6 lg:px-8 h-16 flex items-center border-b border-slate-100 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
        <Link href="#" className="flex items-center gap-2" prefetch={false}>
          <div className="bg-[#F05A28] p-1.5 rounded-lg">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900">Netcore EventFlow</span>
        </Link>
        <nav className="ml-auto flex items-center gap-6">
          <Button asChild className="bg-[#F05A28] hover:bg-[#d04a1e] text-white font-medium px-6">
            <Link href="/dashboard">
              Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-white to-slate-50">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 lg:grid-cols-2 items-center">
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-sm font-medium text-slate-600 shadow-sm">
                    <span className="flex h-2 w-2 rounded-full bg-[#F05A28] mr-2"></span>
                    Internal Event Platform
                  </div>
                  <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl xl:text-6xl text-slate-900 leading-tight">
                    Event Management, <br />
                    <span className="text-[#F05A28]">Simplified.</span>
                  </h1>
                  <p className="max-w-[500px] text-slate-600 md:text-lg leading-relaxed">
                    The all-in-one tool for Netcore teams to build high-converting event pages, manage registrations, and track ROI.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" asChild className="bg-[#F05A28] hover:bg-[#d04a1e] text-white px-8 h-12 text-base">
                    <Link href="/dashboard">
                      Create New Event
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="border-slate-300 text-slate-700 hover:bg-slate-50 h-12 text-base">
                    <Link href="/dashboard">
                      View All Events
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="relative mx-auto w-full max-w-[600px] lg:max-w-none">
                <div className="relative aspect-video overflow-hidden rounded-2xl shadow-2xl border border-slate-200 bg-slate-100">
                  <Image
                    src="/landing_page_hero.png"
                    alt="Netcore EventFlow Dashboard"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                {/* Decorative blob */}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-100/50 blur-3xl rounded-full pointer-events-none"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="w-full py-16 md:py-24 bg-white border-t border-slate-100">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Everything you need to run successful events
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                Streamline your workflow from landing page creation to post-event analytics.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="group p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-orange-200 hover:shadow-lg transition-all duration-200">
                <div className="h-12 w-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center mb-4 group-hover:border-orange-200 group-hover:text-[#F05A28] transition-colors">
                  <Layout className="h-6 w-6 text-slate-600 group-hover:text-[#F05A28]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Visual Builder</h3>
                <p className="text-slate-600 leading-relaxed">
                  Drag-and-drop editor to create stunning, branded event pages in minutes.
                </p>
              </div>

              <div className="group p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-orange-200 hover:shadow-lg transition-all duration-200">
                <div className="h-12 w-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center mb-4 group-hover:border-orange-200 group-hover:text-[#F05A28] transition-colors">
                  <Mail className="h-6 w-6 text-slate-600 group-hover:text-[#F05A28]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Broadcasts</h3>
                <p className="text-slate-600 leading-relaxed">
                  Send AI-drafted updates to registrants or attendees instantly.
                </p>
              </div>

              <div className="group p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-orange-200 hover:shadow-lg transition-all duration-200">
                <div className="h-12 w-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center mb-4 group-hover:border-orange-200 group-hover:text-[#F05A28] transition-colors">
                  <Users className="h-6 w-6 text-slate-600 group-hover:text-[#F05A28]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Lead Management</h3>
                <p className="text-slate-600 leading-relaxed">
                  Track registrations, manage check-ins via QR, and export data easily.
                </p>
              </div>

              <div className="group p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-orange-200 hover:shadow-lg transition-all duration-200">
                <div className="h-12 w-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center mb-4 group-hover:border-orange-200 group-hover:text-[#F05A28] transition-colors">
                  <BarChart3 className="h-6 w-6 text-slate-600 group-hover:text-[#F05A28]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Real-time ROI</h3>
                <p className="text-slate-600 leading-relaxed">
                  Monitor views, clicks, and conversions to measure event success.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-white border-t border-slate-100">
        <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-slate-100 p-1 rounded">
              <Zap className="h-4 w-4 text-slate-500" />
            </div>
            <p className="text-sm text-slate-500 font-medium">© 2024 Netcore EventFlow</p>
          </div>
          <nav className="flex gap-6">
            <Link href="#" className="text-sm text-slate-500 hover:text-[#F05A28] transition-colors">
              Internal Documentation
            </Link>
            <Link href="#" className="text-sm text-slate-500 hover:text-[#F05A28] transition-colors">
              Support
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
