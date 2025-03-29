// CommunityPopup.tsx - קומפוננטה שתציג סיווג ומאפיינים של קהילה
import React from "react";
import Popup from "./Popup";

interface Community {
  name: string;
  lat: number;
  lon: number;
  color: string;
}

interface CommunityPopupProps {
  community: Community | null;
  isOpen: boolean;
  onClose: () => void;
}

const CommunityPopup: React.FC<CommunityPopupProps> = ({
  community,
  isOpen,
  onClose,
}) => {
  if (!community) return null;

  // נתונים פיקטיביים לכל קהילה - בהמשך ניתן להחליף באובייקטים אמיתיים
  const communityData = {
    "קהילה 1": {
      category: "קהילה עירונית",
      size: "גדולה",
      demographics: "מגוון גילאים",
      characteristics: [
        "מיקום מרכזי",
        "נגישות גבוהה לתחבורה",
        "קרבה למוסדות חינוך",
        "אזור מסחרי פעיל",
      ],
      resources: ["מרכז קהילתי גדול", "פארק ציבורי", "מגרשי ספורט"],
      challenges: ["צפיפות אוכלוסין", "חניה מוגבלת", "רעש"],
    },
    "קהילה 2": {
      category: "קהילה מסורתית",
      size: "בינונית",
      demographics: "משפחות צעירות",
      characteristics: [
        "סביבה שקטה",
        "קשרים קהילתיים חזקים",
        "מסורת משותפת",
        "אירועים קהילתיים תכופים",
      ],
      resources: ["בית כנסת", "מרכז למידה", "גינה קהילתית"],
      challenges: ["משאבים מוגבלים", "שירותים ציבוריים מרוחקים"],
    },
    "קהילה 3": {
      category: "קהילה חקלאית",
      size: "קטנה",
      demographics: "מבוגרים וותיקים",
      characteristics: [
        "עיסוק בחקלאות",
        "שטחים פתוחים",
        "קשר לאדמה",
        "אורח חיים כפרי",
      ],
      resources: ["שדות חקלאיים", "מוסדות קהילתיים", "משאבי טבע"],
      challenges: [
        "ריחוק ממרכזים עירוניים",
        "תשתיות חלשות",
        "הזדקנות האוכלוסייה",
      ],
    },
    "קהילה 4": {
      category: "קהילה אקדמית",
      size: "בינונית",
      demographics: "סטודנטים ואנשי אקדמיה",
      characteristics: [
        "קרבה למוסדות אקדמיים",
        "אוכלוסייה משכילה",
        "תחלופה גבוהה",
        "מגוון תרבותי",
      ],
      resources: ["ספריות", "מרכזי מחקר", "חללי עבודה משותפים"],
      challenges: ["דיור יקר", "זמניות התושבים"],
    },
    "קהילה 5": {
      category: "קהילה תעשייתית",
      size: "גדולה",
      demographics: "מעמד פועלים",
      characteristics: [
        "קרבה לאזורי תעשייה",
        "הזדמנויות תעסוקה",
        "היסטוריה תעשייתית",
        "מחירי דיור נמוכים",
      ],
      resources: ["מפעלים", "מרכזי הכשרה מקצועית", "תחבורה ציבורית"],
      challenges: ["זיהום סביבתי", "התדרדרות תשתיות", "אבטלה"],
    },
  };

  const data = communityData[community.name as keyof typeof communityData];

  return (
    <Popup title={community.name} isOpen={isOpen} onClose={onClose}>
      <div className="space-y-6">
        {/* כרטיס כללי */}
        <div className="bg-indigo-50 p-4 rounded-lg">
          <div className="flex items-center gap-4 mb-3">
            <div
              className="w-12 h-12 rounded-full"
              style={{ backgroundColor: community.color }}
            ></div>
            <div>
              <h3 className="text-lg font-bold text-indigo-900">
                {community.name}
              </h3>
              <div className="text-sm text-indigo-700 flex gap-2 items-center">
                <span className="px-2 py-0.5 rounded-full bg-indigo-100">
                  {data.category}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-100">
                  {data.size}
                </span>
              </div>
            </div>
          </div>
          <div className="text-gray-700 mt-2">
            <div className="font-medium text-sm text-indigo-800">
              אוכלוסייה עיקרית:
            </div>
            <div>{data.demographics}</div>
          </div>
        </div>

        {/* מאפיינים */}
        <div>
          <h3 className="text-md font-semibold text-indigo-900 mb-2">
            מאפיינים עיקריים
          </h3>
          <ul className="bg-white rounded-lg border border-gray-100 shadow-sm p-2 mb-4">
            {data.characteristics.map((characteristic, index) => (
              <li
                key={index}
                className="py-2 px-3 border-b last:border-b-0 border-gray-100 flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0"></span>
                <span>{characteristic}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* משאבים ואתגרים */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-md font-semibold text-indigo-900 mb-2">
              משאבים
            </h3>
            <ul className="bg-white rounded-lg border border-gray-100 shadow-sm p-2">
              {data.resources.map((resource, index) => (
                <li
                  key={index}
                  className="py-2 px-3 border-b last:border-b-0 border-gray-100 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></span>
                  <span>{resource}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-md font-semibold text-indigo-900 mb-2">
              אתגרים
            </h3>
            <ul className="bg-white rounded-lg border border-gray-100 shadow-sm p-2">
              {data.challenges.map((challenge, index) => (
                <li
                  key={index}
                  className="py-2 px-3 border-b last:border-b-0 border-gray-100 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span>
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* מיקום */}
        <div>
          <h3 className="text-md font-semibold text-indigo-900 mb-2">מיקום</h3>
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-3 flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-indigo-700"
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
            </div>
            <div>
              <div className="font-medium">קואורדינטות</div>
              <div className="text-sm text-gray-500">
                {community.lat.toFixed(4)}, {community.lon.toFixed(4)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default CommunityPopup;
