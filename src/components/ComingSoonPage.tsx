import { Clock, Wrench, ChevronRight } from 'lucide-react';

interface ComingSoonPageProps {
  title: string;
  subtitle: string;
  description: string;
  features?: string[];
  estimatedDate?: string;
  badge?: string;
}

export default function ComingSoonPage({ 
  title, 
  subtitle, 
  description, 
  features = [], 
  estimatedDate = "Q2 2025",
  badge 
}: ComingSoonPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 md:p-8 lg:p-10">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800">
              {title}
            </h1>
            {badge && (
              <span className="bg-amber-100 text-amber-800 text-sm font-semibold px-3 py-1 rounded-full">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xl text-slate-600 mb-2">{subtitle}</p>
          <p className="text-slate-500 max-w-2xl mx-auto">{description}</p>
        </div>

        {/* Coming Soon Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <Wrench className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-slate-800 mb-3">
              Under Development
            </h2>
            <p className="text-slate-600 mb-4">
              We're working hard to bring you this powerful feature. Stay tuned for updates!
            </p>
            <div className="flex items-center justify-center gap-2 text-blue-600">
              <Clock className="w-4 h-4" />
              <span className="font-medium">Expected Release: {estimatedDate}</span>
            </div>
          </div>

          {/* Features Preview */}
          {features.length > 0 && (
            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 text-center">
                Planned Features
              </h3>
              <div className="grid md:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <ChevronRight className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Want to be notified when this feature launches?
            </h3>
            <p className="text-blue-700 mb-4">
              Follow our development progress and get early access updates.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              Get Notified
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}