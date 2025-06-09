// About.tsx - About Section Component with Repeating Scroll Animations
import React, { useEffect, useRef, useState } from "react";

// Interface for component props
interface AboutProps {
  id: string;
}

const About: React.FC<AboutProps> = ({ id }) => {
  // Refs for animation tracking
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Animation states
  const [sectionVisible, setSectionVisible] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [missionVisible, setMissionVisible] = useState(false);
  const [processVisible, setProcessVisible] = useState(false);
  const [teamVisible, setTeamVisible] = useState(false);
  const [stepVisibility, setStepVisibility] = useState<boolean[]>([
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

        if (target === sectionRef.current) {
          setSectionVisible(entry.isIntersecting);
        } else if (target === headerRef.current) {
          setHeaderVisible(entry.isIntersecting);
        } else if (target === contentRef.current) {
          setContentVisible(entry.isIntersecting);
        } else if (target === missionRef.current) {
          setMissionVisible(entry.isIntersecting);
        } else if (target === processRef.current) {
          setProcessVisible(entry.isIntersecting);
        } else if (target === teamRef.current) {
          setTeamVisible(entry.isIntersecting);
        } else {
          // Handle individual process steps
          const stepIndex = stepRefs.current.findIndex((ref) => ref === target);
          if (stepIndex !== -1) {
            setStepVisibility((prev) => {
              const newVisibility = [...prev];
              newVisibility[stepIndex] = entry.isIntersecting;
              return newVisibility;
            });
          }
        }
      });
    }, observerOptions);

    // Observe elements
    const elementsToObserve = [
      sectionRef.current,
      headerRef.current,
      contentRef.current,
      missionRef.current,
      processRef.current,
      teamRef.current,
      ...stepRefs.current.filter(Boolean),
    ];

    elementsToObserve.forEach((element) => {
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Render step indicator for the process section
  const renderStepIndicator = (stepNumber: number, index: number) => (
    <div
      className={`w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-3 transform transition-all duration-700 ease-out ${
        stepVisibility[index]
          ? "scale-100 rotate-0 opacity-100"
          : "scale-0 rotate-180 opacity-0"
      }`}
      style={{
        transitionDelay: stepVisibility[index]
          ? `${index * 200 + 300}ms`
          : "0ms",
      }}
    >
      {stepNumber}
    </div>
  );

  // Render process step card
  const renderProcessStep = (
    stepNumber: number,
    title: string,
    description: string,
    index: number
  ) => (
    <div
      ref={(el) => (stepRefs.current[index] = el)}
      className={`bg-indigo-50 p-5 rounded-lg transform transition-all duration-700 ease-out ${
        stepVisibility[index]
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-8 opacity-0 scale-95"
      }`}
      style={{
        transitionDelay: stepVisibility[index] ? `${index * 200}ms` : "0ms",
      }}
    >
      {renderStepIndicator(stepNumber, index)}
      <h4
        className={`text-lg font-medium text-indigo-900 mb-2 transform transition-all duration-700 ease-out ${
          stepVisibility[index]
            ? "translate-x-0 opacity-100"
            : "translate-x-4 opacity-0"
        }`}
        style={{
          transitionDelay: stepVisibility[index]
            ? `${index * 200 + 400}ms`
            : "0ms",
        }}
      >
        {title}
      </h4>
      <p
        className={`text-gray-600 transform transition-all duration-700 ease-out ${
          stepVisibility[index]
            ? "translate-x-0 opacity-100"
            : "translate-x-4 opacity-0"
        }`}
        style={{
          transitionDelay: stepVisibility[index]
            ? `${index * 200 + 500}ms`
            : "0ms",
        }}
      >
        {description}
      </p>
    </div>
  );

  // Render section header with title and decorative line
  const renderSectionHeader = (title: string) => (
    <div
      ref={headerRef}
      className={`text-center mb-10 transform transition-all duration-1000 ease-out ${
        headerVisible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-8 opacity-0 scale-95"
      }`}
    >
      <h2
        className={`text-3xl font-bold text-indigo-900 mb-4 transform transition-all duration-1000 ease-out ${
          headerVisible
            ? "translate-y-0 opacity-100"
            : "-translate-y-4 opacity-0"
        }`}
        style={{ transitionDelay: headerVisible ? "200ms" : "0ms" }}
      >
        {title}
      </h2>
      <div
        className={`w-24 h-1 bg-indigo-500 mx-auto mb-6 rounded-full transform transition-all duration-1000 ease-out ${
          headerVisible ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
        }`}
        style={{ transitionDelay: headerVisible ? "600ms" : "0ms" }}
      ></div>
    </div>
  );

  // Render mission and vision section
  const renderMissionVisionSection = () => (
    <div
      ref={missionRef}
      className={`grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 transform transition-all duration-1000 ease-out ${
        missionVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-12 opacity-0"
      }`}
    >
      <div
        className={`transform transition-all duration-1000 ease-out ${
          missionVisible
            ? "translate-x-0 opacity-100"
            : "translate-x-8 opacity-0"
        }`}
        style={{ transitionDelay: missionVisible ? "200ms" : "0ms" }}
      >
        <h3 className="text-xl font-semibold text-indigo-800 mb-4">
          המשימה שלנו
        </h3>
        <p className="text-gray-700 leading-relaxed">
          ב-CommUnity אנחנו מפתחים מערכת מתקדמת למיפוי וסיווג קהילות לשעת חירום.
          אנו מאמינים כי פינוי יעיל ומותאם תרבותית של אוכלוסיות בזמן חירום הוא
          קריטי להבטחת שלומם ורווחתם. המערכת שלנו נועדה לספק למנהלי חירום את
          הכלים הדרושים להבנה מעמיקה של מאפייני הקהילות השונות.
        </p>
      </div>
      <div
        className={`transform transition-all duration-1000 ease-out ${
          missionVisible
            ? "translate-x-0 opacity-100"
            : "-translate-x-8 opacity-0"
        }`}
        style={{ transitionDelay: missionVisible ? "400ms" : "0ms" }}
      >
        <h3 className="text-xl font-semibold text-indigo-800 mb-4">
          החזון שלנו
        </h3>
        <p className="text-gray-700 leading-relaxed">
          אנו שואפים ליצור מערכת לאומית שתשמש את כל גופי החירום בישראל, ותאפשר
          פינוי מותאם ומהיר של קהילות במצבי חירום. החזון שלנו הוא לבנות חוסן
          לאומי באמצעות הבנה עמוקה של צרכי הקהילות השונות והבטחת רציפות תפקודית
          גם בעיתות משבר.
        </p>
      </div>
    </div>
  );

  // Render how the system works section
  const renderSystemProcessSection = () => (
    <div
      ref={processRef}
      className={`mb-8 transform transition-all duration-1000 ease-out ${
        processVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-12 opacity-0"
      }`}
    >
      <h3
        className={`text-xl font-semibold text-indigo-800 mb-4 transform transition-all duration-1000 ease-out ${
          processVisible
            ? "translate-x-0 opacity-100"
            : "translate-x-4 opacity-0"
        }`}
        style={{ transitionDelay: processVisible ? "200ms" : "0ms" }}
      >
        איך המערכת עובדת?
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {renderProcessStep(
          1,
          "מיפוי מדויק",
          "המערכת מזהה ומסווגת קהילות על פי מגוון מאפיינים: דתיים, תרבותיים, צרכים מיוחדים, שפה וגורמים נוספים המשפיעים על צרכי הפינוי.",
          0
        )}
        {renderProcessStep(
          2,
          "תכנון אסטרטגי",
          "בהתבסס על הנתונים, המערכת מציעה תוכניות פינוי אופטימליות המשייכות כל קהילה למתקן קליטה המתאים לצרכיה הייחודיים.",
          1
        )}
        {renderProcessStep(
          3,
          "תיאום והפעלה",
          "בשעת חירום, המערכת מאפשרת למנהלי החירום לבצע את הפינוי בצורה מסודרת, תוך התחשבות בצרכים המיוחדים של כל קהילה.",
          2
        )}
      </div>
    </div>
  );

  // Render team information section
  const renderTeamSection = () => (
    <div
      ref={teamRef}
      className={`transform transition-all duration-1000 ease-out ${
        teamVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      }`}
    >
      <h3
        className={`text-xl font-semibold text-indigo-800 mb-4 transform transition-all duration-1000 ease-out ${
          teamVisible ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
        }`}
        style={{ transitionDelay: teamVisible ? "200ms" : "0ms" }}
      >
        מי אנחנו?
      </h3>
      <p
        className={`text-gray-700 leading-relaxed mb-6 transform transition-all duration-1000 ease-out ${
          teamVisible ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
        }`}
        style={{ transitionDelay: teamVisible ? "400ms" : "0ms" }}
      >
        CommUnity הוא פרויקט הגמר של צוות סטודנטים להנדסת תוכנה. הפרויקט נולד
        מתוך התובנה העמוקה שרכשנו במהלך אירועי החירום האחרונים בישראל, והרצון
        שלנו לתרום לחוסן הלאומי באמצעות הידע הטכנולוגי שרכשנו. לאחר חקר ספרות
        מעמיק, סקירה יסודית של פתרונות קיימים בשוק וראיונות עם מומחי חירום,
        זיהינו פער משמעותי במערכות הקיימות בתחום סיווג ופינוי קהילות בחירום.
        הפתרון שפיתחנו מבוסס על מתודולוגיות מתקדמות ונותן מענה ייחודי לאתגרים
        שזוהו.
      </p>
      <p
        className={`text-gray-700 leading-relaxed transform transition-all duration-1000 ease-out ${
          teamVisible ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"
        }`}
        style={{ transitionDelay: teamVisible ? "600ms" : "0ms" }}
      >
        פרויקט זה מהווה את שיאו של תואר הנדסת תוכנה, והוא משלב ידע מתקדם במערכות
        מידע, אלגוריתמיקה חכמה, ויזואליזציה מרחבית וממשק משתמש אינטואיטיבי. אנו
        גאים להציג מערכת שלא רק עומדת בסטנדרטים אקדמיים גבוהים, אלא גם בעלת
        פוטנציאל להשפיע באופן ממשי על ניהול מצבי חירום בישראל.
      </p>
    </div>
  );

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`py-16 bg-indigo-50/50 overflow-hidden transform transition-all duration-1000 ease-out ${
        sectionVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          {renderSectionHeader("אודות CommUnity")}

          {/* Main Content Container */}
          <div
            ref={contentRef}
            className={`bg-white p-8 rounded-xl shadow-lg border border-gray-100 transform transition-all duration-1000 ease-out ${
              contentVisible
                ? "translate-y-0 opacity-100 scale-100"
                : "translate-y-12 opacity-0 scale-95"
            }`}
          >
            {/* Mission and Vision Section */}
            {renderMissionVisionSection()}

            {/* System Process Section */}
            {renderSystemProcessSection()}

            {/* Team Information Section */}
            {renderTeamSection()}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
