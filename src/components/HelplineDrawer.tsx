import { X, PhoneCall, ShieldAlert, HeartHandshake, Baby, Users } from 'lucide-react';

interface HelplineDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLanguage: string;
}

export function HelplineDrawer({ isOpen, onClose }: HelplineDrawerProps) {
  if (!isOpen) return null;

  const helplines = [
    {
      name: 'National Women Helpline (WCD)',
      number: '181',
      desc: '24x7 toll-free support for women facing domestic distress, legal questions, or scheme grievances.',
      icon: <ShieldAlert className="w-5 h-5 text-rose-600" />,
      badge: '24x7 Free'
    },
    {
      name: 'Childline India',
      number: '1098',
      desc: 'Free assistance for girl child protection, education assistance, and emergency rescue.',
      icon: <Baby className="w-5 h-5 text-amber-600" />,
      badge: 'Emergency'
    },
    {
      name: 'Senior Citizens Helpline (Elderline)',
      number: '14567',
      desc: 'Assistance for elder women, pension disputes, and healthcare support.',
      icon: <Users className="w-5 h-5 text-purple-600" />,
      badge: 'National'
    },
    {
      name: 'National Cyber Crime Portal',
      number: '1930',
      desc: 'Financial fraud, fake scheme calls, or digital harassment reporting.',
      icon: <HeartHandshake className="w-5 h-5 text-blue-600" />,
      badge: 'Govt Portal'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg max-h-[92dvh] sm:max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-stone-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-600 via-rose-600 to-rose-700 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse shrink-0" />
            <div>
              <h2 className="text-base sm:text-lg font-bold">Official Women & Safety Helplines</h2>
              <p className="text-[11px] sm:text-xs text-amber-100">Direct toll-free government hotlines</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-white/20 active:scale-95 transition-transform shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 sm:p-5 space-y-2.5 sm:space-y-3 bg-stone-50 overflow-y-auto max-h-[70vh]">
          {helplines.map((item) => (
            <div
              key={item.number}
              className="p-3.5 sm:p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-2.5 sm:gap-3">
                <div className="p-2 rounded-xl bg-stone-50 border border-stone-100 shrink-0 mt-0.5">
                  {item.icon}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="font-extrabold text-stone-900 text-sm sm:text-base">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                      {item.badge}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-1 leading-snug">
                    {item.desc}
                  </p>
                </div>
              </div>

              <a
                href={`tel:${item.number}`}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2.5 min-h-[44px] rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-extrabold text-sm shadow-md shrink-0"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call {item.number}</span>
              </a>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t border-stone-200 text-center">
          <p className="text-xs text-stone-500">
            All calls are free of cost from any mobile network in India.
          </p>
        </div>
      </div>
    </div>
  );
}
