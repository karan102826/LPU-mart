import React, { useState } from 'react';
import { X, Plus, Upload, CheckCircle2 } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ProductCategory, ProductCondition, ListingType } from '../../types';
import { LPU_CAMPUS_LOCATIONS } from '../../lib/escrow/handshake';

interface CreateListingModalProps {
  onClose: () => void;
}

export const CreateListingModal: React.FC<CreateListingModalProps> = ({ onClose }) => {
  const { addListing, user } = useMarketplace();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Laptops');
  const [condition, setCondition] = useState<ProductCondition>('Good');
  const [listingType, setListingType] = useState<ListingType>('both');
  const [price, setPrice] = useState<number>(1500);
  const [rentalRatePerDay, setRentalRatePerDay] = useState<number>(50);
  const [rentalDeposit, setRentalDeposit] = useState<number>(500);
  const [locationId, setLocationId] = useState<string>('loc_unimall');
  const [imageUrl, setImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'
  );
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addListing({
      title,
      description,
      category,
      condition,
      listingType,
      price: Number(price),
      rentalRatePerDay: listingType !== 'buy' ? Number(rentalRatePerDay) : undefined,
      rentalDeposit: listingType !== 'buy' ? Number(rentalDeposit) : undefined,
      images: [imageUrl],
      campusLocationId: locationId,
      available: true,
    });

    setIsDone(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#111114] border border-[#27272A] rounded-2xl overflow-hidden shadow-2xl my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#27272A] bg-[#09090B]">
          <div>
            <h3 className="text-base font-bold text-white">List Item on LPUmart</h3>
            <p className="text-xs text-[#A1A1AA]">
              Seller: {user.name} (Reg: {user.registrationNumber})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#18181B] text-[#A1A1AA] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isDone ? (
          <div className="p-10 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h4 className="text-lg font-bold text-white">Item Listed Successfully!</h4>
            <p className="text-xs text-[#A1A1AA]">
              Your item is now live on the student marketplace and protected by our governed escrow
              protocol.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-[#A1A1AA]">Product Title</label>
              <input
                type="text"
                required
                placeholder="e.g., Apple MacBook Air M1 or Engineering Graphics Drafter"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#09090B] border border-[#27272A] rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#FF6B00]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#A1A1AA]">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-[#09090B] border border-[#27272A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                >
                  <option value="Laptops">Laptops</option>
                  <option value="Smartphones">Smartphones</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Textbooks">Textbooks</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Household essentials">Household essentials</option>
                  <option value="Miscellaneous">Miscellaneous</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-[#A1A1AA]">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as any)}
                  className="w-full bg-[#09090B] border border-[#27272A] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                >
                  <option value="Brand New">Brand New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#A1A1AA]">Listing Offer Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['buy', 'rent', 'both'] as ListingType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setListingType(type)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-medium border transition-colors capitalize ${
                      listingType === type
                        ? 'bg-[#FF6B00] text-black border-[#FF6B00] font-bold'
                        : 'bg-[#09090B] text-[#A1A1AA] border-[#27272A] hover:text-white'
                    }`}
                  >
                    {type === 'both' ? 'Buy & Rent' : type === 'buy' ? 'Sell Only' : 'Rent Only'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-medium text-[#A1A1AA]">Selling Price (₹)</label>
                <input
                  type="number"
                  required
                  min={10}
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full bg-[#09090B] border border-[#27272A] rounded-xl px-3 py-2 text-xs text-white font-mono"
                />
              </div>

              {listingType !== 'buy' && (
                <>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#A1A1AA]">Daily Rent (₹)</label>
                    <input
                      type="number"
                      min={1}
                      value={rentalRatePerDay}
                      onChange={(e) => setRentalRatePerDay(Number(e.target.value))}
                      className="w-full bg-[#09090B] border border-[#27272A] rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#A1A1AA]">Deposit (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={rentalDeposit}
                      onChange={(e) => setRentalDeposit(Number(e.target.value))}
                      className="w-full bg-[#09090B] border border-[#27272A] rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#A1A1AA]">Preferred Campus Meeting Point</label>
              <select
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
                className="w-full bg-[#09090B] border border-[#27272A] rounded-xl px-3 py-2 text-xs text-white"
              >
                {LPU_CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#A1A1AA]">Description & Specs</label>
              <textarea
                required
                rows={3}
                placeholder="Include condition details, semester usage, included accessories, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#09090B] border border-[#27272A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-[#A1A1AA]">Product Photo URL</label>
              <input
                type="url"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-[#09090B] border border-[#27272A] rounded-xl px-3.5 py-2 text-xs text-white font-mono"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#FF8533] text-black font-bold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Publish Campus Listing
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
