// Home.tsx - Main Application Home Page
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
import { useAuth } from "../context/AuthContext";

// Interface for community data structure
interface Community {
  name: string;
  color: string;
  lat: number;
  lon: number;
}

const Home: React.FC = () => {
  // Authentication context
  const { isLoggedIn } = useAuth();

  // State management for communities and map
  const [activeCommunity, setActiveCommunity] = useState<string | null>(null);
  const [visibleCommunities, setVisibleCommunities] = useState<Community[]>([]);
  const [selectedCommunities, setSelectedCommunities] = useState<string[]>([]);

  // State management for layers
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [layerDataMap, setLayerDataMap] = useState<Record<string, any>>({});

  // State management for UI components
  const [showCommunityPopup, setShowCommunityPopup] = useState(false);
  const [showContact, setShowContact] = useState(false);

  // References for smooth scrolling
  const contactFormRef = useRef<HTMLDivElement>(null);
  const aboutSectionRef = useRef<HTMLDivElement>(null);

  // Static data
  const communities = clusteredCommunities;
  const availableLayers = [
    { key: "bicycle_tracks", name: "מסלולי אופניים" },
    { key: "business_centers", name: "מרכזי עסקים" },
    { key: "community_centers", name: "מתנ״סים" },
    { key: "dog_gardens", name: "גינות כלבים" },
    { key: "education", name: "מוסדות חינוך" },
    { key: "elderly_social_clubs", name: "מועדוני קשישים" },
    { key: "health_clinics", name: "מרפאות" },
    { key: "playgrounds", name: "גני שעשועים" },
    { key: "shelters", name: "מקלטים" },
    { key: "synagogues", name: "בתי כנסת" },
  ];

  // Toggle layer visibility on map
  const toggleLayer = (layer: string) => {
    setSelectedLayers((prev) =>
      prev.includes(layer) ? prev.filter((l) => l !== layer) : [...prev, layer]
    );
  };

  // Find active community data
  const findActiveCommunity = (): Community | null => {
    if (!activeCommunity) return null;
    return communities.find((c) => c.name === activeCommunity) || null;
  };

  // Show community popup when active community changes
  useEffect(() => {
    if (activeCommunity) {
      setShowCommunityPopup(true);
    }
  }, [activeCommunity]);

  // Handle community popup close
  const handleClosePopup = () => {
    setShowCommunityPopup(false);
  };

  // Scroll to contact form section
  const scrollToContact = () => {
    setShowContact(true);
    setTimeout(() => {
      if (contactFormRef.current) {
        const headerHeight = 60; // Approximate header height
        const elementPosition = contactFormRef.current.offsetTop - headerHeight;
        window.scrollTo({
          top: elementPosition,
          behavior: "smooth",
        });
      }
    }, 100);
  };

  // Scroll to about section
  const scrollToAbout = () => {
    if (aboutSectionRef.current) {
      const headerHeight = 60; // Approximate header height
      const elementPosition = aboutSectionRef.current.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  // Handle contact form submission
  const handleContactSubmit = () => {
    setShowContact(false);
  };

  // Handle contact form hide (when scrolling out of view)
  const handleContactHide = () => {
    setShowContact(false);
  };

  // Toggle community visibility with checkbox functionality
  const toggleCommunityVisibility = (communityName: string) => {
    const matches = clusteredCommunities.filter(
      (c) => c.name === communityName
    );
    const alreadyVisible = visibleCommunities.some(
      (c) => c.name === communityName
    );

    if (alreadyVisible) {
      // Remove community from visible list
      setVisibleCommunities((prev) =>
        prev.filter((c) => c.name !== communityName)
      );
      setSelectedCommunities((prev) =>
        prev.filter((name) => name !== communityName)
      );
    } else {
      // Add community to visible list
      setVisibleCommunities((prev) => [...prev, ...matches]);
      setSelectedCommunities((prev) => [...prev, communityName]);
    }
  };

  // Legacy function for community toggling (used for other purposes)
  const toggleCommunityVisibilityLegacy = (communityName: string) => {
    const matches = clusteredCommunities.filter(
      (c) => c.name === communityName
    );
    const alreadyVisible = visibleCommunities.some(
      (c) => c.name === communityName
    );

    if (alreadyVisible) {
      setVisibleCommunities((prev) =>
        prev.filter((c) => c.name !== communityName)
      );
    } else {
      setVisibleCommunities((prev) => [...prev, ...matches]);
    }

    setActiveCommunity(communityName);
  };

  // Get unique community types for legend display
  const getUniqueCommunityTypes = () => {
    const seen = new Set<string>();
    return clusteredCommunities
      .filter((c) => {
        if (seen.has(c.name)) return false;
        seen.add(c.name);
        return true;
      })
      .map((c) => ({ name: c.name, color: c.color }));
  };

  // Render map section
  const renderMapSection = () => (
    <div className="flex-1 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
      <div className="bg-indigo-50 py-3 px-4 border-b border-gray-100">
        <h2 className="font-semibold text-indigo-900">מפה אינטראקטיבית</h2>
      </div>
      <Map
        communities={visibleCommunities}
        activeCommunity={activeCommunity}
        setActiveCommunity={setActiveCommunity}
        selectedLayers={selectedLayers}
        setLayerDataMap={setLayerDataMap}
      />
    </div>
  );

  // Render communities legend sidebar
  const renderLegendSidebar = () => (
    <div className="lg:w-1/4 bg-white rounded-xl shadow-lg border border-gray-100 max-h-[600px] flex flex-col">
      <div className="bg-indigo-50 py-3 px-4 border-b border-gray-100">
        <h2 className="font-semibold text-indigo-900">רשימת קהילות</h2>
      </div>
      <div className="p-4 overflow-y-auto flex-grow">
        <Legend
          communities={getUniqueCommunityTypes()}
          onToggleCommunity={toggleCommunityVisibilityLegacy}
          selectedCommunities={selectedCommunities}
          onToggleVisibility={toggleCommunityVisibility}
          allCommunityData={clusteredCommunities}
          isUserLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  );

  // Render layers panel sidebar
  const renderLayersPanel = () => (
    <div className="lg:w-1/6 bg-white rounded-xl shadow-lg border border-gray-100 max-h-[600px] flex flex-col">
      <div className="bg-indigo-50 py-3 px-4 border-b border-gray-100">
        <h2 className="font-semibold text-indigo-900">שכבות מידע</h2>
      </div>
      <div className="p-4 overflow-y-auto flex-grow">
        <LayersPanel
          availableLayers={availableLayers.map((layer) => layer.key)}
          selectedLayers={selectedLayers}
          onToggleLayer={toggleLayer}
          layerDataMap={layerDataMap}
        />
      </div>
    </div>
  );

  // Render main layout section
  const renderMainLayout = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row-reverse gap-6">
        {/* Map Section - Left Side */}
        {renderMapSection()}

        {/* Legend Sidebar - Right Side */}
        {renderLegendSidebar()}

        {/* Layers Panel - Far Right */}
        {renderLayersPanel()}
      </div>
    </div>
  );

  // Render contact form section with animation
  const renderContactSection = () => (
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
        <ContactForm
          onSubmit={handleContactSubmit}
          isVisible={showContact}
          onHide={handleContactHide}
        />
      </div>
    </div>
  );

  return (
    <div
      dir="rtl"
      className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-white text-right"
    >
      {/* Header Component */}
      <Header
        onContactClick={scrollToContact}
        onAboutClick={scrollToAbout}
        communities={getUniqueCommunityTypes()}
        layers={availableLayers}
        selectedCommunities={selectedCommunities}
        selectedLayers={selectedLayers}
        onToggleCommunity={toggleCommunityVisibility}
        onToggleLayer={toggleLayer}
      />

      {/* Site Introduction Section */}
      <SiteIntro />

      {/* Main Layout Section */}
      {renderMainLayout()}

      {/* Community Details Popup */}
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
      {renderContactSection()}
    </div>
  );
};

export default Home;
