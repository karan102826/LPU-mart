import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  MapPin,
  Bot,
  Heart,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Listing } from '../../types';
import { useMarketplace } from '../../context/MarketplaceContext';
import { LPU_CAMPUS_LOCATIONS } from '../../lib/escrow/handshake';

interface ProductDetailModalProps {
  listing: Listing;
  onClose: () => void;
  onOpenAI: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  listing,
  onClose,
  onOpenAI,
}) => {
  const { createOrder, setActiveTab, favorites, toggleFavorite, user } = useMarketplace();

  const [orderType, setOrderType] = useState<'buy' | 'rent'>(
    listing.listingType === 'rent' ? 'rent' : 'buy'
  );
  const [rentalDays, setRentalDays] = useState<number>(3);
  const [selectedLocationId, setSelectedLocationId] = useState<string>(
    listing.campusLocationId || 'loc_unimall'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const isFav = favorites.includes(listing.id);

  const calculatedTotal =
    orderType === 'buy'
      ? listing.price
      : (listing.rentalRatePerDay || 50) * rentalDays;

  const commission = Math.round(calculatedTotal * 0.1);
  const charity = 2; // ₹2 Vridh Ashram

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      await createOrder(listing.id, orderType, orderType === 'rent' ? rentalDays : undefined, selectedLocationId);
      onClose();
      setActiveTab('handshake');
    } catch (err) {
      console.error('Order creation error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#111114] border border-[#27272A] rounded-2xl overflow-hidden shadow-2xl my-8">
        {/* Header Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272A] bg-[#09090B]">
          <div className="flex items-center gap-2 text-xs text-[#A1A1AA]">
            <span>Category: {listing.category}</span>
            <span aria-hidden="true">·</span>
            <span>Condition: {listing.condition}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFavorite(listing.id)}
              className="p-2 rounded-lg bg-[#18181B] border border-[#27272A] text-white hover:text-[#FF6B00] transition-colors"
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-[#FF6B00] text-[#FF6B00]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#18181B] border border-[#27272A] text-[#A1A1AA] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2-Column Split: Media Gallery Left, Contiguous Purchase Module Right */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
          {/* Left: Images */}
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-[#18181B] border border-[#27272A]">
              <img
                src={listing.images[activeImageIndex] || listing.images[0]}
                alt={listing.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnail selector if multiple images */}
            {listing.images.length > 1 && (
              <div className="flex gap-2">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImageIndex === idx ? 'border-[#FF6B00]' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={img} alt="thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Seller Campus Trust Card */}
            <div className="p-4 rounded-xl bg-[#09090B] border border-[#27272A] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#27272A] flex items-center justify-center font-bold text-white text-xs">
                    {listing.sellerName.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white flex items-center gap-1">
                      {listing.sellerName}
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    </h4>
                    <span className="text-[11px] text-[#A1A1AA]">
                      LPU Verified Student · {listing.sellerRating} ★
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
                    Escrow Protected
                  </span>
                </div>
              </div>
              <p className="text-xs text-[#71717A] pt-1">
                Student identity independently validated. Physical handover coordinated at verified
                campus checkpoints.
              </p>
            </div>
          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-bold text-white leading-snug">
                {listing.title}
              </h2>

              <p className="text-sm text-[#A1A1AA] leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>

              {/* Buy vs Rent Toggle if both supported */}
              {listing.listingType === 'both' && (
                <div className="flex items-center p-1 bg-[#09090B] border border-[#27272A] rounded-xl text-xs font-semibold">
                  <button
                    onClick={() => setOrderType('buy')}
                    className={`flex-1 py-2 rounded-lg transition-colors ${
                      orderType === 'buy'
                        ? 'bg-[#FF6B00] text-black'
                        : 'text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    Buy (₹{listing.price.toLocaleString('en-IN')})
                  </button>
                  <button
                    onClick={() => setOrderType('rent')}
                    className={`flex-1 py-2 rounded-lg transition-colors ${
                      orderType === 'rent'
                        ? 'bg-[#FF6B00] text-black'
                        : 'text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    Rent (₹{listing.rentalRatePerDay}/day)
                  </button>
                </div>
              )}

              {/* Rental Duration Stepper */}
              {orderType === 'rent' && (
                <div className="p-3 rounded-xl bg-[#09090B] border border-[#27272A] space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#A1A1AA] flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#FF9F43]" />
                      Rental Duration
                    </span>
                    <span className="text-white font-mono">{rentalDays} Days</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={30}
                    value={rentalDays}
                    onChange={(e) => setRentalDays(Number(e.target.value))}
                    className="w-full accent-[#FF6B00] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-[#71717A]">
                    <span>1 day</span>
                    <span>15 days</span>
                    <span>30 days</span>
                  </div>
                </div>
              )}

              {/* Campus Meeting Location Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#A1A1AA] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                  Designated Campus Handshake Hotspot
                </label>
                <select
                  value={selectedLocationId}
                  onChange={(e) => setSelectedLocationId(e.target.value)}
                  className="w-full bg-[#09090B] border border-[#27272A] rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-[#FF6B00]"
                >
                  {LPU_CAMPUS_LOCATIONS.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.zone})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-[#71717A]">
                  Both participants must be within 100m of this checkpoint during QR scanning.
                </p>
              </div>

              {/* Auditable Escrow & Social Impact Breakdown */}
              <div className="p-3.5 rounded-xl bg-[#09090B] border border-[#27272A] space-y-2 text-xs">
                <div className="flex justify-between text-[#A1A1AA]">
                  <span>Item Subtotal</span>
                  <span className="font-mono text-white tabular-nums">
                    ₹{calculatedTotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-[#A1A1AA]">
                  <span>Platform Safety Escrow (10%)</span>
                  <span className="font-mono text-emerald-400 tabular-nums">
                    ₹{commission.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-[#A1A1AA]">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#FF9F43]" />
                    Vridh Ashram Social Allocation
                  </span>
                  <span className="font-mono text-[#FF9F43] tabular-nums">₹{charity}</span>
                </div>
                <div className="pt-2 border-t border-[#27272A] flex justify-between font-bold text-white text-sm">
                  <span>Payable in Escrow</span>
                  <span className="font-mono text-[#FF6B00] tabular-nums">
                    ₹{calculatedTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Dual CTAs: Order in Escrow & Consult AI */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handlePlaceOrder}
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-[#FF6B00] hover:bg-[#FF8533] disabled:opacity-50 text-black font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <ShieldCheck className="w-4 h-4" />
                {isSubmitting ? 'Securing in Escrow...' : `Lock in Escrow (₹${calculatedTotal.toLocaleString('en-IN')})`}
              </button>

              <button
                onClick={onOpenAI}
                className="w-full py-2.5 rounded-xl bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-[#FF9F43] text-xs font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Bot className="w-4 h-4" />
                Ask Governed AI about this item (₹5 Session)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
