import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Bot,
  Heart,
  PlusCircle,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ProductCategory, ProductCondition, Listing } from '../../types';
import { ProductDetailModal } from './ProductDetailModal';
import { CreateListingModal } from './CreateListingModal';

const CATEGORIES: ProductCategory[] = [
  'All',
  'Laptops',
  'Smartphones',
  'Electronics',
  'Furniture',
  'Textbooks',
  'Gaming',
  'Accessories',
  'Household essentials',
];

export const ProductCatalog: React.FC = () => {
  const { listings, favorites, toggleFavorite, openAIModal, user, orders } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('All');
  const [selectedType, setSelectedType] = useState<'all' | 'buy' | 'rent'>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high'>('newest');
  const [activeDetailListing, setActiveDetailListing] = useState<Listing | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter & sort logic
  const filteredListings = useMemo(() => {
    return listings
      .filter((listing) => {
        const matchesSearch =
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.category.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          selectedCategory === 'All' || listing.category === selectedCategory;

        const matchesType =
          selectedType === 'all' ||
          listing.listingType === 'both' ||
          listing.listingType === selectedType;

        const matchesCondition =
          selectedCondition === 'all' || listing.condition === selectedCondition;

        return matchesSearch && matchesCategory && matchesType && matchesCondition;
      })
      .sort((a, b) => {
        if (sortBy === 'price_low') return a.price - b.price;
        if (sortBy === 'price_high') return b.price - a.price;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [listings, searchQuery, selectedCategory, selectedType, selectedCondition, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-10 pb-24">
      {/* Hero Campaign Focal Point */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#111114] via-[#09090B] to-[#111114] border border-[#27272A] p-6 md:p-10">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FF9F43] tracking-wide uppercase">
            <Sparkles className="w-4 h-4" />
            <span>Lovely Professional University Student Marketplace</span>
            <span aria-hidden="true">·</span>
            <span>Governed AI Ecosystem</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Buy. Sell. Rent. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-[#FF9F43]">
              Right on campus.
            </span>
          </h1>

          <p className="text-sm md:text-base text-[#A1A1AA] max-w-2xl leading-relaxed">
            Trade electronics, textbooks, and hostel essentials directly with verified students.
            Protected by a 3-layer Governed AI Agent, cryptographic Handshake QR codes, and ₹2
            contribution to Vridh Ashram on every deal.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-2.5 rounded-lg bg-[#FF6B00] hover:bg-[#FF8533] text-black font-semibold text-sm transition-colors flex items-center gap-2 shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              List an Item
            </button>

            <button
              onClick={() => openAIModal()}
              className="px-5 py-2.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-white border border-[#27272A] font-medium text-sm transition-colors flex items-center gap-2"
            >
              <Bot className="w-4 h-4 text-[#FF9F43]" />
              Ask Campus AI (Free)
            </button>
          </div>
        </div>

        {/* Ambient Subtle Background Graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-[#FF6B00]/10 via-transparent to-transparent pointer-events-none" />
      </section>

      {/* Discovery & Search Controls */}
      <section className="space-y-4">
        {/* Search input + type toggle */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
            <input
              type="text"
              placeholder="Search laptops, books, gaming consoles, hostel furniture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111114] border border-[#27272A] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#71717A] focus:outline-none focus:border-[#FF6B00] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            {/* Buy / Rent segmented switch */}
            <div className="flex items-center p-1 bg-[#111114] border border-[#27272A] rounded-xl text-xs font-medium shrink-0">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedType === 'all'
                    ? 'bg-[#FF6B00] text-black font-semibold'
                    : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedType('buy')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedType === 'buy'
                    ? 'bg-[#FF6B00] text-black font-semibold'
                    : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                Buy Only
              </button>
              <button
                onClick={() => setSelectedType('rent')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  selectedType === 'rent'
                    ? 'bg-[#FF6B00] text-black font-semibold'
                    : 'text-[#A1A1AA] hover:text-white'
                }`}
              >
                Rentals
              </button>
            </div>

            {/* Sort selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#111114] border border-[#27272A] rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-[#FF6B00] shrink-0"
            >
              <option value="newest">Sort: Newest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills (Functional Buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-white text-black font-semibold'
                  : 'bg-[#111114] text-[#A1A1AA] border border-[#27272A] hover:text-white hover:border-[#3F3F46]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Product Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
          <span>Showing {filteredListings.length} campus items</span>
          <span>Approved LPU Student Listings</span>
        </div>

        {filteredListings.length === 0 ? (
          <div className="text-center py-16 bg-[#111114] border border-[#27272A] rounded-2xl space-y-3">
            <SlidersHorizontal className="w-8 h-8 text-[#71717A] mx-auto" />
            <h3 className="text-base font-semibold text-white">No matching products found</h3>
            <p className="text-xs text-[#A1A1AA] max-w-sm mx-auto">
              Try adjusting your search terms or filter selections. Students frequently add new
              listings between academic blocks.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedType('all');
              }}
              className="px-4 py-2 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] text-xs font-medium text-white transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => {
              const isFav = favorites.includes(listing.id);

              return (
                <div
                  key={listing.id}
                  className="group bg-[#111114] border border-[#27272A] rounded-2xl overflow-hidden hover:border-[#3F3F46] transition-all flex flex-col hover:-translate-y-1 shadow-sm"
                >
                  {/* Image Container with Aspect Ratio */}
                  <div
                    onClick={() => setActiveDetailListing(listing)}
                    className="relative aspect-[4/3] w-full bg-[#18181B] cursor-pointer overflow-hidden"
                  >
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Favorite Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(listing.id);
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/60 backdrop-blur-sm text-white hover:text-[#FF6B00] transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${isFav ? 'fill-[#FF6B00] text-[#FF6B00]' : ''}`}
                      />
                    </button>

                    {/* Rental Indicator Strip */}
                    {listing.rentalRatePerDay && (
                      <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-sm text-amber-400 text-[11px] font-mono px-2 py-0.5 rounded border border-amber-500/20">
                        Rent: ₹{listing.rentalRatePerDay}/day
                      </div>
                    )}
                  </div>

                  {/* Card Content Area */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      {/* Zero-Pill Clean Metadata with Typographic Separator */}
                      <div className="flex items-center gap-1.5 text-xs text-[#A1A1AA]">
                        <span className="text-[#FF9F43]">{listing.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{listing.condition}</span>
                        <span aria-hidden="true">·</span>
                        <span>{listing.sellerName}</span>
                      </div>

                      {/* Product Title */}
                      <h3
                        onClick={() => setActiveDetailListing(listing)}
                        className="text-base font-semibold text-white leading-snug cursor-pointer hover:text-[#FF6B00] transition-colors line-clamp-2"
                      >
                        {listing.title}
                      </h3>

                      {/* Description excerpt */}
                      <p className="text-xs text-[#71717A] line-clamp-2 leading-relaxed">
                        {listing.description}
                      </p>
                    </div>

                    {/* Price & Action Row */}
                    <div className="pt-2 border-t border-[#27272A] flex items-center justify-between">
                      <div>
                        <span className="text-xs text-[#A1A1AA] block">Price</span>
                        <span className="text-lg font-bold text-white font-mono tracking-tight tabular-nums">
                          ₹{listing.price.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Quick AI consultation button */}
                        <button
                          onClick={() => openAIModal(listing)}
                          title="Ask AI about this item (Free)"
                          className="p-2 rounded-lg bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-[#FF9F43] transition-colors flex items-center gap-1 text-xs"
                        >
                          <Bot className="w-4 h-4" />
                          <span className="font-mono text-[10px] text-emerald-400">Free</span>
                        </button>

                        {/* View & Purchase */}
                        <button
                          onClick={() => setActiveDetailListing(listing)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#FF6B00] hover:bg-[#FF8533] text-black text-xs font-semibold transition-colors"
                        >
                          View Deal
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Product Detail Modal */}
      {activeDetailListing && (
        <ProductDetailModal
          listing={activeDetailListing}
          onClose={() => setActiveDetailListing(null)}
          onOpenAI={() => {
            const lst = activeDetailListing;
            setActiveDetailListing(null);
            openAIModal(lst);
          }}
        />
      )}

      {/* Create Listing Modal */}
      {isCreateModalOpen && (
        <CreateListingModal onClose={() => setIsCreateModalOpen(false)} />
      )}
    </div>
  );
};
