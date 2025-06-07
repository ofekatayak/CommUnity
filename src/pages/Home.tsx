// Home.tsx (עדכון)
import React, { useState, useRef, useEffect } from "react";
import Header from "../components/Header";
import Legend from "../components/Legend";
import Map from "../components/Map";
import SiteIntro from "../components/SiteIntro";
import CommunityPopup from "../components/popups/CommunityPopup";
import ContactForm from "../components/ContactForm";
import About from "../components/About";
import { clusteredCommunities } from "../data/ClusterIntegration";
import LayersPanel from "../components/LayersPanel";


const Home: React.FC = () => {
  const [activeCommunity, setActiveCommunity] = useState<string | null>(null);
  const [visibleCommunities, setVisibleCommunities] = useState<typeof communities>([]);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [showCommunityPopup, setShowCommunityPopup] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [layerDataMap, setLayerDataMap] = useState<Record<string, any>>({});
  const contactFormRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef<HTMLDivElement>(null);
  const communities = clusteredCommunities;
  
  

  const toggleLayer = (layer: string) => {
  setSelectedLayers((prev) =>
    prev.includes(layer)
      ? prev.filter((l) => l !== layer)
      : [...prev, layer]
  );
  };
  const availableLayers = [
    "bicycle_tracks",
    "business_centers",
    "community_centers",
    "dog_gardens",
    "education",
    "elderly_social_clubs",
    "health_clinics",
    "playgrounds",
    "shelters",
    "synagogues",
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

  const handleContactSubmit = () => {
    setShowContact(false);
  };

  const toggleCommunityVisibility = (communityName: string) => {
    const matches = clusteredCommunities.filter((c) => c.name === communityName);
    const alreadyVisible = visibleCommunities.some((c) => c.name === communityName);

    if (alreadyVisible) {
      setVisibleCommunities((prev) => prev.filter((c) => c.name !== communityName));
    } else {
      setVisibleCommunities((prev) => [...prev, ...matches]);
    }

    setActiveCommunity(communityName);
  };

  const seen = new Set<string>();
  const uniqueCommunityTypes = clusteredCommunities.filter((c) => {
  if (seen.has(c.name)) return false;
  seen.add(c.name);
  return true;
}).map(c => ({ name: c.name, color: c.color }));

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
              communities={visibleCommunities}
              activeCommunity={activeCommunity}
              setActiveCommunity={setActiveCommunity}
              selectedLayers={selectedLayers}
              setLayerDataMap={setLayerDataMap}
            />
          </div>
          {/* Legend Sidebar - בצד ימין */}
          <div className="lg:w-1/4 bg-white rounded-xl shadow-lg border border-gray-100 max-h-[600px] flex flex-col">
            <div className="bg-indigo-50 py-3 px-4 border-b border-gray-100">
              <h2 className="font-semibold text-indigo-900">רשימת קהילות</h2>
            </div>
            <div className="p-4 overflow-y-auto flex-grow">
              <Legend
                 communities={uniqueCommunityTypes}
                  onToggleCommunity={toggleCommunityVisibility}
              />
            </div>
          </div>
          <div className="lg:w-1/6 bg-white rounded-xl shadow-lg border border-gray-100 max-h-[600px] flex flex-col">
            <div className="bg-indigo-50 py-3 px-4 border-b border-gray-100">
              <h2 className="font-semibold text-indigo-900">שכבות מידע</h2>
            </div>
            <div className="p-4 overflow-y-auto flex-grow">
              <LayersPanel
              availableLayers={availableLayers}
              selectedLayers={selectedLayers}
              onToggleLayer={toggleLayer}
              layerDataMap={layerDataMap}
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
