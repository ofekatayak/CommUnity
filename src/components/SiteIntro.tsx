// SiteIntro.tsx - Main Site Introduction Section Component with Repeating Scroll Animations
import React, { useEffect, useRef, useState } from "react";

// Interface for feature card data
interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const SiteIntro: React.FC = () => {
  // Refs for animation tracking
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Animation states
  const [heroVisible, setHeroVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [cardVisibility, setCardVisibility] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  // Intersection Observer setup with repeating animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: "-50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target;

        if (target === heroRef.current) {
          setHeroVisible(entry.isIntersecting);
        } else if (target === featuresRef.current) {
          setFeaturesVisible(entry.isIntersecting);
        } else {
          // Handle individual cards
          const cardIndex = cardRefs.current.findIndex((ref) => ref === target);
          if (cardIndex !== -1) {
            setCardVisibility((prev) => {
              const newVisibility = [...prev];
              newVisibility[cardIndex] = entry.isIntersecting;
              return newVisibility;
            });
          }
        }
      });
    }, observerOptions);

    // Observe elements
    if (heroRef.current) observer.observe(heroRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);
    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Render location/map pin icon
  const renderLocationIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-indigo-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );

  // Render users/community icon
  const renderUsersIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-indigo-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );

  // Render search/magnifying glass icon
  const renderSearchIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-indigo-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );

  // Feature cards data
  const featureCards: FeatureCard[] = [
    {
      title: "זיהוי קהילות",
      description:
        "מיפוי קהילות לפי מכנים משותפים כגון צרכים מיוחדים, שפה, תרבות ודת, המאפשר התאמה מדויקת בעת פינוי חירום.",
      icon: renderLocationIcon(),
    },
    {
      title: "תכנון פינוי מותאם",
      description:
        "כלי למנהלי חירום לתכנון מראש של יעדי פינוי מתאימים לכל קהילה בהתבסס על הצרכים הייחודיים שלה.",
      icon: renderUsersIcon(),
    },
    {
      title: "ניהול משאבים חכם",
      description:
        "התאמת משאבים ייעודיים במקומות הקליטה בהתאם לצרכי הקהילות המפונות, המבטיח רציפות תפקודית במצבי חירום.",
      icon: renderSearchIcon(),
    },
  ];

  // Render individual feature card with animation
  const renderFeatureCard = (feature: FeatureCard, index: number) => (
    <div
      key={index}
      ref={(el) => (cardRefs.current[index] = el)}
      className={`bg-white p-6 rounded-xl shadow-md border border-gray-100 transform transition-all duration-700 ease-out ${
        cardVisibility[index]
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-8 opacity-0 scale-95"
      }`}
      style={{
        transitionDelay: cardVisibility[index] ? `${index * 200}ms` : "0ms",
      }}
    >
      {/* Icon Container with animation */}
      <div
        className={`w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 mx-auto md:mx-0 transform transition-all duration-700 ease-out ${
          cardVisibility[index] ? "rotate-0 scale-100" : "rotate-12 scale-0"
        }`}
        style={{
          transitionDelay: cardVisibility[index]
            ? `${index * 200 + 300}ms`
            : "0ms",
        }}
      >
        {feature.icon}
      </div>

      {/* Feature Title with slide animation */}
      <h3
        className={`text-lg font-semibold text-indigo-900 mb-2 transform transition-all duration-700 ease-out ${
          cardVisibility[index]
            ? "translate-x-0 opacity-100"
            : "translate-x-4 opacity-0"
        }`}
        style={{
          transitionDelay: cardVisibility[index]
            ? `${index * 200 + 500}ms`
            : "0ms",
        }}
      >
        {feature.title}
      </h3>

      {/* Feature Description with slide animation */}
      <p
        className={`text-gray-600 transform transition-all duration-700 ease-out ${
          cardVisibility[index]
            ? "translate-x-0 opacity-100"
            : "translate-x-4 opacity-0"
        }`}
        style={{
          transitionDelay: cardVisibility[index]
            ? `${index * 200 + 600}ms`
            : "0ms",
        }}
      >
        {feature.description}
      </p>
    </div>
  );

  // Render hero section with title and subtitle
  const renderHeroSection = () => (
    <div
      ref={heroRef}
      className={`max-w-4xl mx-auto text-center transform transition-all duration-1000 ease-out ${
        heroVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-12 opacity-0 scale-95"
      }`}
    >
      {/* Main title with bounce effect */}
      <h1
        className={`text-4xl font-bold text-indigo-900 mb-4 transform transition-all duration-1000 ease-out ${
          heroVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
        }`}
        style={{ transitionDelay: heroVisible ? "200ms" : "0ms" }}
      >
        ברוכים הבאים ל-CommUnity
      </h1>

      {/* Subtitle with delayed slide-in */}
      <p
        className={`text-xl text-gray-700 mb-8 transform transition-all duration-1000 ease-out ${
          heroVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        style={{ transitionDelay: heroVisible ? "600ms" : "0ms" }}
      >
        מערכת לסיווג ומיפוי קהילות לפינוי מותאם בשעת חירום
      </p>
    </div>
  );

  // Render features grid section
  const renderFeaturesGrid = () => (
    <div
      ref={featuresRef}
      className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 text-right transform transition-all duration-1000 ease-out ${
        featuresVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-16 opacity-0"
      }`}
    >
      {featureCards.map(renderFeatureCard)}
    </div>
  );

  return (
    <div className="bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-purple-500/10 overflow-hidden">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        {renderHeroSection()}

        {/* Features Grid */}
        {renderFeaturesGrid()}
      </div>
    </div>
  );
};

export default SiteIntro;
