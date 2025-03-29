// Home.tsx (עדכון)
import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import Legend from "../components/Legend";
import Map from "../components/Map";
import SiteIntro from "../components/SiteIntro";
import CommunityPopup from "../components/popups/CommunityPopup";
import ContactForm from "../components/ContactForm";
import About from "../components/About";

const Home: React.FC = () => {
  const [activeCommunity, setActiveCommunity] = useState<string | null>(null);
  const [showCommunityPopup, setShowCommunityPopup] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const contactFormRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef<HTMLDivElement>(null);

  const communities = [
    { name: "קהילה 1", lat: 32.0853, lon: 34.7818, color: "#5E72E4" },
    { name: "קהילה 2", lat: 31.7683, lon: 35.2137, color: "#3498DB" },
    { name: "קהילה 3", lat: 29.5577, lon: 34.9519, color: "#4CAF50" },
    { name: "קהילה 4", lat: 30.1234, lon: 34.9876, color: "#FF9800" },
    { name: "קהילה 5", lat: 30.6789, lon: 35.1234, color: "#8E44AD" },
  ];

  // פונקציה למציאת קהילה פעילה
  const findActiveCommunity = () => {
    if (!activeCommunity) return null;
    return communities.find((c) => c.name === activeCommunity) || null;
  };

  // כשמשתנה קהילה פעילה, הצג את הפופאפ
  useEffect(() => {
    if (activeCommunity) {
      setShowCommunityPopup(true);
    }
  }, [activeCommunity]);

  // פונקציה להתמודדות עם סגירת פופאפ
  const handleClosePopup = () => {
    setShowCommunityPopup(false);
  };

  // פונקציה שמטפלת בגלילה לטופס צור קשר
  const scrollToContact = () => {
    setShowContact(true);
    setTimeout(() => {
      if (contactFormRef.current) {
        contactFormRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // פונקציה שמטפלת בגלילה לסעיף אודות
  const scrollToAbout = () => {
    if (aboutSectionRef.current) {
      aboutSectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // פונקציה להסתרת טופס צור קשר אחרי הגשה
  const handleContactSubmit = () => {
    setShowContact(false);
  };

  return (
    <div
      dir="rtl"
      className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-white text-right"
    >
      {/* Header - עם העברת פונקציות הגלילה */}
      <Header onContactClick={scrollToContact} onAboutClick={scrollToAbout} />

      {/* Site Introduction */}
      <SiteIntro />

      {/* Main layout */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row-reverse gap-6">
          {/* Map - בצד שמאל */}
          <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="bg-indigo-50 py-3 px-4 border-b border-gray-100">
              <h2 className="font-semibold text-indigo-900">
                מפה אינטראקטיבית
              </h2>
            </div>
            <Map
              communities={communities}
              activeCommunity={activeCommunity}
              setActiveCommunity={setActiveCommunity}
            />
          </div>

          {/* Legend Sidebar - בצד ימין */}
          <div className="lg:w-1/4 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 h-[600px]">
            <div className="bg-indigo-50 py-3 px-4 border-b border-gray-100">
              <h2 className="font-semibold text-indigo-900">רשימת קהילות</h2>
            </div>
            <div className="p-4 h-full">
              <Legend
                communities={communities}
                setActiveCommunity={setActiveCommunity}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Community Popup */}
      <CommunityPopup
        community={findActiveCommunity()}
        isOpen={showCommunityPopup && !!activeCommunity}
        onClose={handleClosePopup}
      />

      {/* About Section */}
      <div ref={aboutSectionRef}>
        <About id="about" />
      </div>

      {/* Contact Form Section */}
      <div
        ref={contactFormRef}
        className={`container mx-auto px-4 py-8 transition-all duration-500 ${
          showContact
            ? "opacity-100 max-h-[2000px]"
            : "opacity-0 max-h-0 overflow-hidden"
        }`}
        id="contact"
      >
        <div className="max-w-3xl mx-auto">
          <ContactForm onSubmit={handleContactSubmit} isVisible={showContact} />
        </div>
      </div>
    </div>
  );
};

export default Home;
