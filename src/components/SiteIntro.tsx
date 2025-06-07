// SiteIntro.tsx - Main Site Introduction Section Component
import React from "react";

// Interface for feature card data
interface FeatureCard {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const SiteIntro: React.FC = () => {
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

  // Render individual feature card
  const renderFeatureCard = (feature: FeatureCard, index: number) => (
    <div
      key={index}
      className="bg-white p-6 rounded-xl shadow-md border border-gray-100"
    >
      {/* Icon Container */}
      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4 mx-auto md:mx-0">
        {feature.icon}
      </div>

      {/* Feature Title */}
      <h3 className="text-lg font-semibold text-indigo-900 mb-2">
        {feature.title}
      </h3>

      {/* Feature Description */}
      <p className="text-gray-600">{feature.description}</p>
    </div>
  );

  // Render hero section with title and subtitle
  const renderHeroSection = () => (
    <div className="max-w-4xl mx-auto text-center">
      <h1 className="text-4xl font-bold text-indigo-900 mb-4">
        ברוכים הבאים ל-CommUnity
      </h1>
      <p className="text-xl text-gray-700 mb-8">
        מערכת לסיווג ומיפוי קהילות לפינוי מותאם בשעת חירום
      </p>
    </div>
  );

  // Render features grid section
  const renderFeaturesGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 text-right">
      {featureCards.map(renderFeatureCard)}
    </div>
  );

  return (
    <div className="bg-gradient-to-r from-indigo-500/10 via-blue-500/10 to-purple-500/10">
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
