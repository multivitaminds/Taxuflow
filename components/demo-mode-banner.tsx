"use client"

export function DemoModeBanner() {
  return null
}

// Original code preserved for reference
// interface DemoModeBannerProps {
//   isDemoMode: boolean
//   userName?: string
// }

// export function DemoModeBanner({ isDemoMode }: DemoModeBannerProps) {
//   const [showLiveBanner, setShowLiveBanner] = useState(false)
//   const [isVisible, setIsVisible] = useState(true)

//   useEffect(() => {
//     // Check if user just activated their account
//     const activationTime = localStorage.getItem("account_activation_time")

//     if (activationTime) {
//       const timeSinceActivation = Date.now() - Number.parseInt(activationTime)
//       const threeMinutes = 3 * 60 * 1000 // 3 minutes in milliseconds

//       if (timeSinceActivation < threeMinutes) {
//         // Show live account banner
//         setShowLiveBanner(true)

//         // Set timeout to hide banner after remaining time
//         const remainingTime = threeMinutes - timeSinceActivation
//         const timer = setTimeout(() => {
//           setIsVisible(false)
//           localStorage.removeItem("account_activation_time")
//         }, remainingTime)

//         return () => clearTimeout(timer)
//       } else {
//         // More than 3 minutes have passed, clear the flag
//         localStorage.removeItem("account_activation_time")
//       }
//     }
//   }, [])

//   const handleSwitchToLive = async () => {
//     window.location.href = "/activate"
//   }

//   if (showLiveBanner && isVisible) {
//     return (
//       <div className="w-full bg-emerald-600 text-white py-3 px-6 flex items-center justify-center gap-2 h-12 border-b border-white/10">
//         <div className="flex items-center gap-2 text-sm">
//           <CheckCircle2 className="h-5 w-5" />
//           <span className="font-semibold">Live Account</span>
//           <span className="mx-2">-</span>
//           <span>You're using your production account with real data</span>
//         </div>
//       </div>
//     )
//   }

//   if (!isDemoMode || !isVisible) {
//     return null
//   }

//   return (
//     <div className="w-full bg-[#0A2540] text-white h-14 px-6 flex items-center justify-between border-b border-white/10">
//       <div className="flex items-center gap-3">
//         <div className="flex items-center gap-2 font-medium text-sm">
//           <Shield className="h-4 w-4" />
//           <span>Sandbox Mode</span>
//         </div>
//       </div>

//       <div className="flex-1 flex items-center justify-center px-8 max-w-4xl mx-auto">
//         <span className="text-sm text-white/90 text-center">
//           You're currently testing Taxu's payment system. Activate your live account to begin processing real customer
//           payments, onboarding clients, and receiving payouts.
//         </span>
//       </div>

//       <div className="flex items-center">
//         <Button
//           size="sm"
//           onClick={handleSwitchToLive}
//           className="bg-[#17C964] hover:bg-[#12A150] text-white font-medium px-4 h-9 rounded-md transition-colors shadow-none"
//         >
//           Activate Live Account →
//         </Button>
//       </div>
//     </div>
//   )
// }
