'use client'
import { useEffect, useMemo, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { motion } from 'framer-motion'

const CAMPAIGN_START_ISO = '2025-11-04T00:00:00+05:30'
const TOTAL_DAYS = 30
const GROUP_NAME = 'Vadakara Voters Team'
const DISTRICT_LABEL = 'Vadakara'
const LOGO_URL: string | null = null

type CaptionPair = [string, string]
type Lang = 'both' | 'en' | 'ml'

const CAPTIONS: CaptionPair[] = [
  ['Day 1 – Check your name in the 2002 Electoral Roll today!', 'ദിവസം 1 – 2002 വോട്ടർ പട്ടികയിൽ നിങ്ങളുടെ പേര് പരിശോധിക്കുക!'],
  ['Day 2 – Every vote counts. Make sure you are on the list.', 'ദിവസം 2 – ഓരോ വോട്ടും വിലപ്പെട്ടതാണ്. നിങ്ങളുടെ പേര് പട്ടികയിൽ ഉണ്ടോ എന്ന് ഉറപ്പാക്കൂ.'],
  ['Day 3 – Visit ceo.kerala.gov.in to confirm your voter details.', 'ദിവസം 3 – ceo.kerala.gov.in സന്ദർശിച്ച് നിങ്ങളുടെ വോട്ടർ വിവരങ്ങൾ സ്ഥിരീകരിക്കുക.'],
  ['Day 4 – Don’t miss your BLO’s visit – be at home this week!', 'ദിവസം 4 – നിങ്ങളുടെ BLOയുടെ സന്ദർശനം നഷ്ടപ്പെടുത്തരുത് – ഈ ആഴ്ച വീട്ടിൽ ഉണ്ടാവുക!'],
  ['Day 5 – Missing from the list? Fill Form 6 now.', 'ദിവസം 5 – പട്ടികയിൽ പേര് ഇല്ലേ? ഉടൻ ഫോം 6 പൂരിപ്പിക്കുക.'],
  ['Day 6 – Keep your Aadhaar and photo ID ready for verification.', 'ദിവസം 6 – ആധാർ കാർഡും ഫോട്ടോ ഐഡിയും പരിശോധനയ്‌ക്കായി തയ്യാറാക്കുക.'],
  ['Day 7 – Encourage your family to check their names too.', 'ദിവസം 7 – നിങ്ങളുടെ കുടുംബാംഗങ്ങളെയും അവരുടെ പേരുകൾ പരിശോധിക്കാൻ പ്രോത്സാഹിപ്പിക്കുക.'],
  ['Day 8 – Have your EPIC number? Verify your record online.', 'ദിവസം 8 – നിങ്ങളുടെ EPIC നമ്പർ ഉണ്ടോ? നിങ്ങളുടെ രേഖ ഓൺലൈനിൽ പരിശോധിക്കുക.'],
  ['Day 9 – First-time voter? Apply through Form 6 online.', 'ദിവസം 9 – ആദ്യമായി വോട്ട് ചെയ്യണോ? ഫോം 6 ഓൺലൈനിൽ പൂരിപ്പിക്കുക.'],
  ['Day 10 – Together we ensure 100% registration in VIWA members & family.', 'ദിവസം 10 – VIWA അംഗങ്ങളും കുടുംബങ്ങളും ചേർന്ന് 100% രജിസ്ട്രേഷൻ ഉറപ്പാക്കാം.'],
  ['Day 11 – SIR means a clean, accurate voter roll – take part!', 'ദിവസം 11 – SIR എന്നാൽ ശുദ്ധവും കൃത്യവുമായ വോട്ടർ പട്ടിക – പങ്കെടുക്കൂ!'],
  ['Day 12 – Help senior citizens in your area with voter checks.', 'ദിവസം 12 – നിങ്ങളുടെ പ്രദേശത്തിലെ മുതിർന്ന പൗരന്മാരെ വോട്ടർ പരിശോധനയിൽ സഹായിക്കുക.'],
  ['Day 13 – Check your roll at ceo.kerala.gov.in/voter-search.', 'ദിവസം 13 – ceo.kerala.gov.in/voter-search സന്ദർശിച്ച് പട്ടിക പരിശോധിക്കുക.'],
  ['Day 14 – Your vote is your right – protect it by registering.', 'ദിവസം 14 – നിങ്ങളുടെ വോട്ട് നിങ്ങളുടെ അവകാശമാണ് – രജിസ്റ്റർ ചെയ്ത് സംരക്ഷിക്കുക.'],
  ['Day 15 – Halfway there! Ensure your household is verified.', 'ദിവസം 15 – പകുതി വഴിയിലായി! നിങ്ങളുടെ വീട്ടുകാർ പരിശോധിച്ചതായി ഉറപ്പാക്കൂ.'],
  ['Day 16 – Talk to your BLO if you moved houses recently.', 'ദിവസം 16 – പുതിയ വിലാസത്തിലേക്ക് മാറിയെങ്കിൽ നിങ്ങളുടെ BLOയുമായി ബന്ധപ്പെടുക.'],
  ['Day 17 – Use voters.eci.gov.in to track your application.', 'ദിവസം 17 – നിങ്ങളുടെ അപേക്ഷയുടെ നില voters.eci.gov.in-ൽ പരിശോധിക്കുക.'],
  ['Day 18 – Share awareness in your WhatsApp groups today.', 'ദിവസം 18 – നിങ്ങളുടെ വാട്സ്ആപ്പ് ഗ്രൂപ്പുകളിൽ അവബോധം പങ്കിടൂ.'],
  ['Day 19 – Ensure college students are also enrolled.', 'ദിവസം 19 – കോളേജ് വിദ്യാർത്ഥികളും രജിസ്റ്റർ ചെയ്തിട്ടുണ്ടെന്ന് ഉറപ്പാക്കൂ.'],
  ['Day 20 – Check your polling booth information online.', 'ദിവസം 20 – നിങ്ങളുടെ പോളിംഗ് ബൂത്ത് വിവരങ്ങൾ ഓൺലൈനിൽ പരിശോധിക്കുക.'],
  ['Day 21 – Only 9 days left! Have you submitted Form 6?', 'ദിവസം 21 – ഇനി 9 ദിവസം മാത്രം! ഫോം 6 സമർപ്പിച്ചോ?'],
  ['Day 22 – SIR is for all – every eligible voter matters.', 'ദിവസം 22 – SIR എല്ലാവർക്കുമാണ് – ഓരോ വോട്ടറും പ്രധാനമാണ്.'],
  ['Day 23 – Recheck your details for spelling and accuracy.', 'ദിവസം 23 – നിങ്ങളുടെ വിവരങ്ങൾ ശരിയാണോ എന്ന് വീണ്ടും പരിശോധിക്കുക.'],
  ['Day 24 – Verify with your BLO – quick and easy.', 'ദിവസം 24 – നിങ്ങളുടെ BLOയുമായി സ്ഥിരീകരിക്കുക – വേഗത്തിലും എളുപ്പത്തിലും.'],
  ['Day 25 – Encourage neighbours to check their names today.', 'ദിവസം 25 – നിങ്ങളുടെ അയൽക്കാരെ ഇന്ന് അവരുടെ പേരുകൾ പരിശോധിക്കാൻ പ്രോത്സാഹിപ്പിക്കുക.'],
  ['Day 26 – Final week! Remind your friends and colleagues.', 'ദിവസം 26 – അവസാന ആഴ്ച! നിങ്ങളുടെ സുഹൃത്തുക്കളെയും സഹപ്രവർത്തകരെയും ഓർമ്മിപ്പിക്കുക.'],
  ['Day 27 – Upload missing documents if asked by BLO.', 'ദിവസം 27 – BLO ആവശ്യപ്പെട്ടാൽ കാണാതായ രേഖകൾ അപ്‌ലോഡ് ചെയ്യുക.'],
  ['Day 28 – Double-check your family’s inclusion.', 'ദിവസം 28 – നിങ്ങളുടെ കുടുംബാംഗങ്ങൾ ഉൾപ്പെട്ടിട്ടുണ്ടോ എന്ന് വീണ്ടും പരിശോധിക്കുക.'],
  ['Day 29 – Tomorrow is the last day – don’t delay!', 'ദിവസം 29 – നാളെ അവസാന ദിവസം – വൈകിക്കരുത്!'],
  ['Day 30 – Congratulations! You’ve completed the SIR Countdown. Kerala is ready to vote!', 'ദിവസം 30 – അഭിനന്ദനങ്ങൾ! നിങ്ങൾ SIR കൗണ്ട്ഡൗൺ പൂർത്തിയാക്കി. കേരളം വോട്ടിന് തയ്യാറായി!']
]

function useNow(tickMs = 1000) {
  const [now, setNow] = useState<Date>(() => new Date())
  useEffect(() => { const id = setInterval(() => setNow(new Date()), tickMs); return () => clearInterval(id) }, [tickMs])
  return now
}
const clamp = (n:number,min:number,max:number)=>Math.max(min,Math.min(n,max))

export default function Page(){
  const [lang,setLang] = useState<Lang>('both')
  const now = useNow(1000)
  const start = useMemo(()=>new Date(CAMPAIGN_START_ISO),[])
  const end = useMemo(()=>new Date(start.getTime()+TOTAL_DAYS*24*60*60*1000),[start])

  const msFromStart = Math.max(0, now.getTime()-start.getTime())
  const daysElapsed = Math.floor(msFromStart/(24*60*60*1000))+1
  const currentDay = clamp(daysElapsed,1,TOTAL_DAYS)

  const msRemaining = Math.max(0,end.getTime()-now.getTime())
  const seconds = Math.floor(msRemaining/1000)%60
  const minutes = Math.floor(msRemaining/(1000*60))%60
  const hours   = Math.floor(msRemaining/(1000*60*60))%24
  const days    = Math.floor(msRemaining/(1000*60*60*24))

  const [captionEn, captionMl] = CAPTIONS[currentDay-1]
  const shareUrl = typeof window!=='undefined'? window.location.href : 'https://example.com'

  const copyToClipboard = async()=>{
    try{ await navigator.clipboard.writeText(shareUrl); alert('Link copied! Share it in your WhatsApp group.') }catch(e){console.error(e)}
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-white to-[#f0f6ff]">
      <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className="w-full max-w-3xl">
        <div className="rounded-2xl shadow-xl border border-blue-200 bg-white p-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            {LOGO_URL ? (<img src={LOGO_URL} alt="Logo" className="h-10 w-10 object-contain" />) : null}
            <h1 className="text-3xl md:text-4xl font-extrabold text-blue-700 text-center">SIR Kerala 2025 – Live Countdown</h1>
          </div>
          <p className="text-center text-gray-600">Special Intensive Revision (SIR) • {DISTRICT_LABEL} • {GROUP_NAME}</p>

          <div className="flex items-center justify-center gap-2 mt-4">
            <button onClick={()=>setLang('both')} className={`px-3 py-1 rounded-lg text-sm border ${'both'===lang?'bg-blue-600 text-white border-blue-600':'border-blue-300 text-blue-700 hover:bg-blue-50'}`}>EN + ML</button>
            <button onClick={()=>setLang('en')} className={`px-3 py-1 rounded-lg text-sm border ${'en'===lang?'bg-blue-600 text-white border-blue-600':'border-blue-300 text-blue-700 hover:bg-blue-50'}`}>English</button>
            <button onClick={()=>setLang('ml')} className={`px-3 py-1 rounded-lg text-sm border ${'ml'===lang?'bg-blue-600 text-white border-blue-600':'border-blue-300 text-blue-700 hover:bg-blue-50'}`}>മലയാളം</button>
          </div>

          <div className="grid grid-cols-4 gap-3 mt-6 text-center">
            <TimeCell label="Days" value={days} />
            <TimeCell label="Hours" value={hours} />
            <TimeCell label="Minutes" value={minutes} />
            <TimeCell label="Seconds" value={seconds} />
          </div>
          <p className="mt-4 text-sm text-gray-500 text-center">Ends on {end.toLocaleString()}</p>

          <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200 text-center">
            <p className="text-sm font-semibold text-blue-700">Today • Day {currentDay} of {TOTAL_DAYS}</p>
            {(lang==='both'||lang==='en') && (<p className="text-lg md:text-xl font-bold text-gray-900 mt-2">{captionEn}</p>)}
            {(lang==='both'||lang==='ml') && (<p className="text-base md:text-lg font-medium text-gray-800 mt-1">{captionMl}</p>)}
            <p className="text-sm text-gray-600 mt-3">Resources: ceo.kerala.gov.in • voters.eci.gov.in • Helpline 1950</p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
              <button onClick={copyToClipboard} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Copy Share Link</button>
              <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent('SIR Kerala Live Countdown: ' + shareUrl)}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-100">Share via WhatsApp</a>
            </div>
            <div className="flex items-center justify-center mt-6"><QRCodeCanvas value={shareUrl} size={180} includeMargin /></div>
          </div>
        </div>
        <p className="text-center text-xs text-gray-500 mt-4">Configured start: {new Date(CAMPAIGN_START_ISO).toLocaleString()} • 30‑day auto captions • Updates every second</p>
      </motion.div>
    </div>
  )
}

function TimeCell({ label, value }: { label: string; value: number }){
  return (
    <div className="rounded-xl border border-blue-200 bg-white p-4 shadow-sm">
      <div className="text-3xl md:text-4xl font-bold text-blue-700 tabular-nums">{String(value).padStart(2,'0')}</div>
      <div className="text-xs uppercase tracking-wide text-gray-500 mt-1">{label}</div>
    </div>
  )
}
