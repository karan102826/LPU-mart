import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  QrCode,
  MapPin,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Compass,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { LPU_CAMPUS_LOCATIONS, calculateDistanceMeters } from '../../lib/escrow/handshake';
import { Order } from '../../types';

export const HandshakeView: React.FC = () => {
  const {
    orders,
    acceptOrder,
    verifyAndCompleteHandshake,
    getOrCreateHandshake,
    handshakes,
    raiseDispute,
  } = useMarketplace();

  // Active selected order for Handshake
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    orders.find((o) => o.status === 'ACCEPTED_IN_ESCROW' || o.status === 'HANDSHAKE_READY')?.id ||
      orders[0]?.id ||
      ''
  );

  const selectedOrder = orders.find((o) => o.id === selectedOrderId);
  const currentHandshake = selectedOrderId ? handshakes[selectedOrderId] : null;

  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [scannedInputToken, setScannedInputToken] = useState<string>('');
  const [handshakeMessage, setHandshakeMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // GPS Simulation vs Real Device Coordinates
  const [useDeviceGPS, setUseDeviceGPS] = useState(false);
  const [simulatedDistance, setSimulatedDistance] = useState<'near' | 'far'>('near');
  const [currentLat, setCurrentLat] = useState<number>(31.2537);
  const [currentLng, setCurrentLng] = useState<number>(75.7038);

  const selectedLocation =
    LPU_CAMPUS_LOCATIONS.find((loc) => loc.id === selectedOrder?.meetingLocationId) ||
    LPU_CAMPUS_LOCATIONS[0];

  // Generate QR code when selected order / handshake updates
  useEffect(() => {
    if (selectedOrderId && !currentHandshake) {
      getOrCreateHandshake(selectedOrderId, selectedOrder?.meetingLocationId);
    }
  }, [selectedOrderId, currentHandshake]);

  useEffect(() => {
    if (currentHandshake?.buyerToken) {
      QRCode.toDataURL(currentHandshake.buyerToken, {
        width: 260,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('QR generation error:', err));
    }
  }, [currentHandshake?.buyerToken]);

  // Handle GPS coordinate updates
  useEffect(() => {
    if (useDeviceGPS && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentLat(pos.coords.latitude);
          setCurrentLng(pos.coords.longitude);
        },
        (err) => {
          console.warn('Browser GPS permission error:', err);
          setUseDeviceGPS(false);
        }
      );
    } else {
      // Simulator positions
      if (simulatedDistance === 'near') {
        // ~35 meters from Uni-Mall
        setCurrentLat(selectedLocation.latitude + 0.0003);
        setCurrentLng(selectedLocation.longitude + 0.0002);
      } else {
        // ~2.5 km away (outside campus bounds)
        setCurrentLat(selectedLocation.latitude + 0.025);
        setCurrentLng(selectedLocation.longitude + 0.02);
      }
    }
  }, [useDeviceGPS, simulatedDistance, selectedLocation]);

  const computedDistance = calculateDistanceMeters(
    currentLat,
    currentLng,
    selectedLocation.latitude,
    selectedLocation.longitude
  );

  const isWithin100m = computedDistance <= selectedLocation.radiusMeters;

  const handleVerifyHandshake = async () => {
    if (!selectedOrder) return;
    setIsVerifying(true);
    setHandshakeMessage(null);

    const tokenToValidate = scannedInputToken.trim() || currentHandshake?.buyerToken || '';

    const res = await verifyAndCompleteHandshake(
      selectedOrder.id,
      tokenToValidate,
      currentLat,
      currentLng
    );

    setIsVerifying(false);
    setHandshakeMessage({
      text: res.message,
      isError: !res.success,
    });
  };

  const handleQuickFillToken = () => {
    if (currentHandshake?.buyerToken) {
      setScannedInputToken(currentHandshake.buyerToken);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8 pb-24">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#FF6B00] tracking-wider uppercase">
          <QrCode className="w-4 h-4" />
          <span>Smart Campus Handshake & Escrow Lock</span>
          <span aria-hidden="true">·</span>
          <span>Dual-Token Cryptography</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
          Campus Escrow & Handshake Protocol
        </h1>
        <p className="text-xs sm:text-sm text-[#A1A1AA] max-w-3xl leading-relaxed">
          Physical handovers at Lovely Professional University are secured through dual cryptographically
          signed tokens and campus GPS geofencing. Funds remain locked in escrow until both buyer and
          seller perform mutual QR validation within 100 meters of an approved campus checkpoint.
        </p>
      </div>

      {/* Order Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {orders.map((order) => {
          const isSelected = order.id === selectedOrderId;
          return (
            <button
              key={order.id}
              onClick={() => {
                setSelectedOrderId(order.id);
                setHandshakeMessage(null);
                setScannedInputToken('');
              }}
              className={`px-4 py-2.5 rounded-xl border text-xs font-medium transition-all whitespace-nowrap shrink-0 flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#18181B] border-[#FF6B00] text-white shadow-sm'
                  : 'bg-[#111114] border-[#27272A] text-[#A1A1AA] hover:text-white'
              }`}
            >
              <span className="font-mono text-[#FF9F43]">#{order.id}</span>
              <span className="truncate max-w-[140px]">{order.listingTitle}</span>
              <span
                className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                  order.status === 'COMPLETED'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : order.status === 'DISPUTED'
                    ? 'bg-red-500/10 text-red-400'
                    : 'bg-[#FF6B00]/10 text-[#FF6B00]'
                }`}
              >
                {order.status === 'ACCEPTED_IN_ESCROW'
                  ? 'ESCROW ACTIVE'
                  : order.status === 'COMPLETED'
                  ? 'COMPLETED'
                  : order.status}
              </span>
            </button>
          );
        })}
      </div>

      {selectedOrder && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Buyer QR Code & Tokens (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-[#111114] border border-[#27272A] space-y-5 text-center flex flex-col items-center">
              <div className="flex items-center justify-between w-full border-b border-[#27272A] pb-3 text-xs">
                <span className="font-semibold text-white">Buyer Handshake Token QR</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-mono">
                  SHA-256 Signed
                </span>
              </div>

              {/* QR Image Box */}
              <div className="p-4 bg-white rounded-2xl shadow-xl">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Transaction Handshake QR" className="w-52 h-52 mx-auto" />
                ) : (
                  <div className="w-52 h-52 flex items-center justify-center text-xs text-black">
                    Generating Token QR...
                  </div>
                )}
              </div>

              <div className="space-y-1 max-w-sm">
                <div className="text-xs font-mono text-white tracking-wider break-all bg-[#09090B] px-3 py-1.5 rounded-lg border border-[#27272A]">
                  {currentHandshake?.buyerToken || 'LPU-BUY-PENDING'}
                </div>
                <p className="text-[11px] text-[#71717A] pt-1">
                  Buyer presents this QR to the seller upon item inspection at{' '}
                  <span className="text-white">{selectedLocation.name}</span>.
                </p>
              </div>

              {/* Token Security Status */}
              <div className="w-full pt-3 border-t border-[#27272A] grid grid-cols-2 gap-2 text-left text-xs">
                <div>
                  <span className="text-[10px] text-[#A1A1AA] block">Token TTL Window</span>
                  <span className="text-white font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#FF9F43]" />
                    15 Minutes
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-[#A1A1AA] block">Replay Protection</span>
                  <span className="text-emerald-400 font-mono">Single-Use Strict</span>
                </div>
              </div>
            </div>

            {/* Escrow Financial Ledger Card */}
            <div className="p-5 rounded-2xl bg-[#111114] border border-[#27272A] space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Escrow Settlement Breakdown
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-[#A1A1AA]">
                  <span>Item Gross Price</span>
                  <span className="font-mono text-white tabular-nums">
                    ₹{selectedOrder.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-[#A1A1AA]">
                  <span>Platform Commission (10%)</span>
                  <span className="font-mono text-emerald-400 tabular-nums">
                    ₹{selectedOrder.commissionAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-[#A1A1AA]">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF9F43]" />
                    Vridh Ashram Contribution
                  </span>
                  <span className="font-mono text-[#FF9F43] tabular-nums">
                    ₹{selectedOrder.charityAmount}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#27272A] flex justify-between font-bold text-white">
                  <span>Seller Payable Net</span>
                  <span className="font-mono text-white tabular-nums">
                    ₹{selectedOrder.sellerPayableAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {selectedOrder.status !== 'DISPUTED' && selectedOrder.status !== 'COMPLETED' && (
                <div className="pt-2">
                  <button
                    onClick={() =>
                      raiseDispute(
                        selectedOrder.id,
                        'Item condition does not match description; seller refused handover'
                      )
                    }
                    className="w-full py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-medium transition-colors"
                  >
                    Raise Handover Dispute (Freeze Funds)
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Handshake Verification & Geofence Map (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Campus Geofence Proximity Card */}
            <div className="p-5 rounded-2xl bg-[#111114] border border-[#27272A] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#FF6B00]" />
                  <h4 className="text-sm font-bold text-white">
                    Campus Geofence Proximity Guard (100m Lock)
                  </h4>
                </div>
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                    isWithin100m
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : 'bg-red-500/10 text-red-400'
                  }`}
                >
                  {isWithin100m ? 'IN RANGE (<100m)' : 'OUT OF RANGE'}
                </span>
              </div>

              {/* Interactive GPS Simulator Controls */}
              <div className="p-4 rounded-xl bg-[#09090B] border border-[#27272A] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#A1A1AA]">Meeting Location:</span>
                  <span className="text-white font-semibold flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#FF6B00]" />
                    {selectedLocation.name}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#A1A1AA]">Calculated Distance:</span>
                  <span className="text-white font-mono font-bold">
                    {computedDistance} meters
                  </span>
                </div>

                {/* Simulated Geolocation Toggle */}
                <div className="pt-2 border-t border-[#27272A] flex flex-wrap items-center gap-2">
                  <span className="text-[11px] text-[#71717A]">GPS Testing Mode:</span>
                  <button
                    onClick={() => {
                      setUseDeviceGPS(false);
                      setSimulatedDistance('near');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      !useDeviceGPS && simulatedDistance === 'near'
                        ? 'bg-[#FF6B00] text-black font-bold'
                        : 'bg-[#18181B] text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    Simulate At {selectedLocation.name} (35m)
                  </button>
                  <button
                    onClick={() => {
                      setUseDeviceGPS(false);
                      setSimulatedDistance('far');
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      !useDeviceGPS && simulatedDistance === 'far'
                        ? 'bg-red-500 text-white font-bold'
                        : 'bg-[#18181B] text-[#A1A1AA] hover:text-white'
                    }`}
                  >
                    Simulate Outside Campus (2.4 km)
                  </button>
                </div>
              </div>

              {/* Seller Handshake Verification Scanner Form */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white">
                    Seller Handshake Scanner & Token Input
                  </label>
                  <button
                    onClick={handleQuickFillToken}
                    className="text-[11px] text-[#FF9F43] hover:underline"
                  >
                    Auto-fill Buyer Token
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Scan or enter LPU-BUY-XXXX-XXXXXXXX"
                    value={scannedInputToken}
                    onChange={(e) => setScannedInputToken(e.target.value)}
                    className="flex-1 bg-[#09090B] border border-[#27272A] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-[#FF6B00]"
                  />
                  <button
                    onClick={handleVerifyHandshake}
                    disabled={isVerifying || selectedOrder.status === 'COMPLETED'}
                    className="px-5 py-2.5 rounded-xl bg-[#FF6B00] hover:bg-[#FF8533] disabled:opacity-50 text-black font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    {isVerifying ? 'Verifying...' : 'Validate Handshake'}
                  </button>
                </div>

                {/* Handshake Result Message */}
                {handshakeMessage && (
                  <div
                    className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 leading-relaxed ${
                      handshakeMessage.isError
                        ? 'bg-red-500/10 border border-red-500/20 text-red-300'
                        : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    {handshakeMessage.isError ? (
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    <span>{handshakeMessage.text}</span>
                  </div>
                )}

                {/* Order Completed Banner */}
                {selectedOrder.status === 'COMPLETED' && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                    <h5 className="text-sm font-bold text-white">Order Completed & Funds Released</h5>
                    <p className="text-[11px] text-emerald-300">
                      ₹{selectedOrder.sellerPayableAmount} paid to seller · ₹2 allocated to Vridh Ashram.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
