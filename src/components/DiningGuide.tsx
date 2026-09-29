import React from 'react';
import { UtensilsCrossed, Star, MapPin, Clock, Sparkles } from 'lucide-react';
import { MOCK_RESTAURANTS } from '../data/mockData';

interface DiningGuideProps {
  destination: string;
}

export const DiningGuide: React.FC<DiningGuideProps> = ({ destination }) => {
  const famousDishes = [
    {
      name: 'Goan Fish Curry & Rice (Xitt Kodi)',
      desc: 'Tangy coconut milk curry infused with kokum, red Kashmiri chilies, and fresh local Kingfish or Pomfret.',
      tag: 'Classic Heritage'
    },
    {
      name: 'Prawn Balchão with Poi Bread',
      desc: 'Fiery, tangy pickled prawn relish made with toddy vinegar, eaten stuffed inside hot wood-fired Goan crusty poi bread.',
      tag: 'Seafood Specialty'
    },
    {
      name: 'Chicken / Mushroom Cafreal',
      desc: 'Tender meat marinated in fresh coriander, green chilies, cinnamon, and Goan spices, shallow fried till aromatic.',
      tag: 'Portuguese-Goan'
    },
    {
      name: 'Traditional 7-Layer Bebinca',
      desc: 'The queen of Goan desserts — multi-layered warm pudding baked with coconut milk, egg yolks, nutmeg, and ghee.',
      tag: 'Must-Try Dessert'
    },
    {
      name: 'Chilled Sol Kadhi',
      desc: 'Refreshing post-meal digestif made from wild kokum fruit extract, freshly pressed coconut milk, garlic, and cilantro.',
      tag: 'Local Drink'
    }
  ];

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">
            <span>Step 6 · Culinary Scene & Restaurants</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Flavors of {destination.split(',')[0]}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Iconic beach shacks, Portuguese heritage dining rooms, and must-try coastal delicacies.
          </p>
        </div>

        {/* Must-Try Dishes Carousel/Grid */}
        <div className="bg-teal-900 rounded-3xl p-6 sm:p-8 text-white mb-8 shadow-md">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-teal-300" />
            <h3 className="text-lg font-bold">5 Iconic Goan Dishes You Cannot Miss</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {famousDishes.map((dish, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-teal-300 uppercase tracking-wider block mb-1">
                    {dish.tag}
                  </span>
                  <h4 className="text-sm font-bold text-white mb-1.5">{dish.name}</h4>
                  <p className="text-xs text-slate-200 leading-relaxed">{dish.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Restaurants List */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">Top Curated Restaurants & Shacks</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {MOCK_RESTAURANTS.map((rst) => (
              <div
                key={rst.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{rst.name}</h4>
                    <div className="text-xs text-teal-700 font-medium mt-0.5">{rst.cuisine}</div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded text-amber-700 text-xs font-bold shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{rst.rating}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    {rst.location}
                  </span>
                  <span>·</span>
                  <span className="font-mono font-bold text-slate-700">{rst.priceRange}</span>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 mb-3 border border-slate-100">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">Signature Special:</span>
                  <p className="text-xs text-slate-600 leading-snug">{rst.specialty}</p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {rst.timing}
                  </span>

                  <span className="text-teal-700 font-semibold text-[11px]">
                    Must Try: {rst.mustTry[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
