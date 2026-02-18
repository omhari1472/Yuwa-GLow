'use client';

import { useEffect, useState } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import API from '@/lib/api';
import type { Stockist, Distributor, PartnerAvailability } from '@/lib/types';
import LOCATIONS from '@/lib/locations';
import ScrollReveal from '@/components/shared/ScrollReveal';

type PartnerType = 'super_stockist' | 'distributor';

function PartnerModal({
  type,
  occupiedStates,
  occupiedDistricts,
  onClose,
}: {
  type: PartnerType;
  occupiedStates: string[];
  occupiedDistricts: string[];
  onClose: () => void;
}) {
  const [selectedState, setSelectedState] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const allStates = Object.keys(LOCATIONS).sort();
  const availableStates =
    type === 'super_stockist'
      ? allStates.filter((s) => !occupiedStates.includes(s))
      : allStates;

  const availableDistricts = selectedState
    ? (LOCATIONS[selectedState] || []).filter((d) => {
        if (type === 'distributor') {
          return !occupiedDistricts.includes(`${selectedState}|${d}`);
        }
        return true;
      })
    : [];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const fd = new FormData(e.currentTarget);
    fd.append('application_type', type);

    const res = await API.submitApplication(fd);
    if (res.success) {
      setSubmitted(true);
    } else {
      setError(res.message || 'Failed to submit. Please try again.');
    }
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'white', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: '#f0e8da' }}>
          <h2 className="font-serif text-xl font-semibold" style={{ color: '#2c2c2c' }}>
            Become a {type === 'super_stockist' ? 'Super Stockist' : 'Distributor'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        {submitted ? (
          <div className="p-10 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="font-serif text-xl mb-2">Application Received!</h3>
            <p className="text-sm text-gray-500 mb-6">We will review and contact you soon.</p>
            <button onClick={onClose} className="cta-link">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold tracking-wide mb-1.5" style={{ color: '#666' }}>Full Name *</label>
                <input type="text" name="name" required className="w-full px-4 py-3 text-sm border outline-none focus:border-[#C38636] transition-colors" style={{ border: '1.5px solid #e5e0d8', borderRadius: 8 }} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-wide mb-1.5" style={{ color: '#666' }}>Firm Name</label>
                <input type="text" name="company_name" className="w-full px-4 py-3 text-sm border outline-none focus:border-[#C38636] transition-colors" style={{ border: '1.5px solid #e5e0d8', borderRadius: 8 }} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold tracking-wide mb-1.5" style={{ color: '#666' }}>Email *</label>
                <input type="email" name="email" required className="w-full px-4 py-3 text-sm border outline-none focus:border-[#C38636] transition-colors" style={{ border: '1.5px solid #e5e0d8', borderRadius: 8 }} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold tracking-wide mb-1.5" style={{ color: '#666' }}>Phone *</label>
                <input type="tel" name="phone" required className="w-full px-4 py-3 text-sm border outline-none focus:border-[#C38636] transition-colors" style={{ border: '1.5px solid #e5e0d8', borderRadius: 8 }} />
              </div>
            </div>

            {/* State */}
            <div>
              <label className="block text-[11px] font-semibold tracking-wide mb-1.5" style={{ color: '#666' }}>State *</label>
              <select
                name="state" required
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-4 py-3 text-sm border outline-none focus:border-[#C38636] transition-colors"
                style={{ border: '1.5px solid #e5e0d8', borderRadius: 8, background: 'white' }}
              >
                <option value="">Select State</option>
                {availableStates.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* District (distributor only) */}
            {type === 'distributor' && (
              <div>
                <label className="block text-[11px] font-semibold tracking-wide mb-1.5" style={{ color: '#666' }}>District *</label>
                <select
                  name="district" required={type === 'distributor'}
                  disabled={!selectedState}
                  className="w-full px-4 py-3 text-sm border outline-none focus:border-[#C38636] transition-colors disabled:opacity-50"
                  style={{ border: '1.5px solid #e5e0d8', borderRadius: 8, background: 'white' }}
                >
                  <option value="">{selectedState ? 'Select District' : 'Select State First'}</option>
                  {availableDistricts.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold tracking-wide mb-1.5" style={{ color: '#666' }}>Business Address</label>
              <textarea name="address" rows={2} className="w-full px-4 py-3 text-sm border outline-none focus:border-[#C38636] transition-colors resize-none" style={{ border: '1.5px solid #e5e0d8', borderRadius: 8 }} />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="px-6 py-3 text-sm font-medium border hover:bg-gray-50 transition-colors" style={{ border: '1.5px solid #e5e0d8', borderRadius: 8 }}>
                Cancel
              </button>
              <button type="submit" disabled={submitting} className="flex-1 btn-ghost-gold">
                {submitting ? 'Submitting…' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default function PartnersPage() {
  const [stockists, setStockists] = useState<Stockist[]>([]);
  const [distributors, setDistributors] = useState<Distributor[]>([]);
  const [occupiedStates, setOccupiedStates] = useState<string[]>([]);
  const [occupiedDistricts, setOccupiedDistricts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<PartnerType | null>(null);
  const [openState, setOpenState] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      API.getStockists(),
      API.getDistributors(),
      API.getPartnerAvailability(),
    ]).then(([stockRes, distRes, availRes]) => {
      if (stockRes.success && Array.isArray(stockRes.data)) setStockists(stockRes.data);
      if (distRes.success && Array.isArray(distRes.data)) setDistributors(distRes.data);
      if (availRes.success && Array.isArray(availRes.data)) {
        setOccupiedStates(
          availRes.data.filter((a) => a.application_type === 'super_stockist').map((a) => a.state)
        );
        setOccupiedDistricts(
          availRes.data.filter((a) => a.application_type === 'distributor').map((a) => `${a.state}|${a.district}`)
        );
      }
      setLoading(false);
    });
  }, []);

  // Group distributors by state
  const distByState: Record<string, Distributor[]> = distributors.reduce((acc, d) => {
    if (!d.state) return acc;
    if (!acc[d.state]) acc[d.state] = [];
    acc[d.state].push(d);
    return acc;
  }, {} as Record<string, Distributor[]>);

  return (
    <>
      {/* Hero */}
      <section
        className="py-24 px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #1a1000, #2c1a00)' }}
      >
        <ScrollReveal>
          <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: '#DCB264' }}>
            Grow With Us
          </p>
          <h1 className="section-title text-4xl sm:text-6xl mb-4" style={{ color: 'rgba(255,255,255,0.95)' }}>
            Our Partner Network
          </h1>
          <p className="text-sm max-w-lg mx-auto mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Join India&apos;s fastest-growing premium beauty distribution network.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => setModal('super_stockist')} className="btn-ghost-gold" style={{ border: '1.5px solid #DCB264', color: '#DCB264' }}>
              Become a Stockist
            </button>
            <button onClick={() => setModal('distributor')} className="btn-ghost-gold" style={{ border: '1.5px solid #DCB264', color: '#DCB264' }}>
              Become a Distributor
            </button>
          </div>
        </ScrollReveal>
      </section>

      {/* Stats */}
      <section className="py-14 px-4" style={{ background: 'white' }}>
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
          {[
            { value: stockists.length || '10+', label: 'Super Stockists' },
            { value: Object.keys(distByState).length || '15+', label: 'States Covered' },
            { value: distributors.length || '50+', label: 'Distributors' },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-4xl font-semibold" style={{ color: '#C38636' }}>{stat.value}</p>
              <p className="text-[11px] tracking-[0.12em] uppercase mt-1" style={{ color: '#888' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Super Stockists */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <ScrollReveal className="mb-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: '#C38636' }}>Network</p>
              <h2 className="section-title text-3xl">Super Stockists</h2>
            </div>
            <button onClick={() => setModal('super_stockist')} className="cta-link hidden sm:block">Apply Now</button>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
          </div>
        ) : stockists.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-sm mb-4">We are expanding! Be the first in your state.</p>
            <button onClick={() => setModal('super_stockist')} className="cta-link">Apply Now</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {stockists.map((s) => (
              <ScrollReveal key={s.id}>
                <div
                  className="p-5 rounded-xl text-center"
                  style={{ background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}
                >
                  <MapPin size={20} className="mx-auto mb-2" style={{ color: '#C38636' }} />
                  <p className="font-semibold text-sm" style={{ color: '#2c2c2c' }}>{s.state}</p>
                  <p className="text-[10px] tracking-wide uppercase mt-1" style={{ color: '#C38636' }}>Super Stockist</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>

      {/* Distributors */}
      <section className="py-16 px-4 max-w-4xl mx-auto">
        <ScrollReveal className="mb-10">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: '#C38636' }}>Locations</p>
              <h2 className="section-title text-3xl">Distributors</h2>
            </div>
            <button onClick={() => setModal('distributor')} className="cta-link hidden sm:block">Apply Now</button>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
          </div>
        ) : Object.keys(distByState).length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-sm mb-4">We are expanding! Be the first in your region.</p>
            <button onClick={() => setModal('distributor')} className="cta-link">Apply Now</button>
          </div>
        ) : (
          <div className="space-y-3">
            {Object.keys(distByState).sort().map((state) => {
              const districts = distByState[state];
              const isOpen = openState === state;
              return (
                <div key={state} className="rounded-xl overflow-hidden" style={{ background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                  <button
                    className="w-full flex items-center justify-between px-6 py-4"
                    onClick={() => setOpenState(isOpen ? null : state)}
                  >
                    <div className="flex items-center gap-3">
                      <MapPin size={16} style={{ color: '#C38636' }} />
                      <span className="font-semibold text-sm" style={{ color: '#2c2c2c' }}>{state}</span>
                      <span className="text-[11px] text-gray-400">{districts.length} district{districts.length !== 1 ? 's' : ''}</span>
                    </div>
                    <ChevronDown size={16} className="transition-transform" style={{ color: '#888', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {districts.map((d) => (
                        <div key={d.id} className="flex items-center gap-2 text-[12px]" style={{ color: '#666' }}>
                          <MapPin size={12} style={{ color: '#C38636' }} />
                          {d.district}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Partner Modal */}
      {modal && (
        <PartnerModal
          type={modal}
          occupiedStates={occupiedStates}
          occupiedDistricts={occupiedDistricts}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
