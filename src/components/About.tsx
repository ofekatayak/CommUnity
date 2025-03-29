// About.tsx
import React from "react";

interface AboutProps {
  id: string;
}

const About: React.FC<AboutProps> = ({ id }) => {
  return (
    <section id={id} className="py-16 bg-indigo-50/50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-indigo-900 mb-4">
              אודות CommUnity
            </h2>
            <div className="w-24 h-1 bg-indigo-500 mx-auto mb-6 rounded-full"></div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-xl font-semibold text-indigo-800 mb-4">
                  המשימה שלנו
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  ב-CommUnity אנחנו מפתחים מערכת מתקדמת למיפוי וסיווג קהילות
                  לשעת חירום. אנו מאמינים כי פינוי יעיל ומותאם תרבותית של
                  אוכלוסיות בזמן חירום הוא קריטי להבטחת שלומם ורווחתם. המערכת
                  שלנו נועדה לספק למנהלי חירום את הכלים הדרושים להבנה מעמיקה של
                  מאפייני הקהילות השונות.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-indigo-800 mb-4">
                  החזון שלנו
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  אנו שואפים ליצור מערכת לאומית שתשמש את כל גופי החירום בישראל,
                  ותאפשר פינוי מותאם ומהיר של קהילות במצבי חירום. החזון שלנו הוא
                  לבנות חוסן לאומי באמצעות הבנה עמוקה של צרכי הקהילות השונות
                  והבטחת רציפות תפקודית גם בעיתות משבר.
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">
                איך המערכת עובדת?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-indigo-50 p-5 rounded-lg">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-3">
                    1
                  </div>
                  <h4 className="text-lg font-medium text-indigo-900 mb-2">
                    מיפוי מדויק
                  </h4>
                  <p className="text-gray-600">
                    המערכת מזהה ומסווגת קהילות על פי מגוון מאפיינים: דתיים,
                    תרבותיים, צרכים מיוחדים, שפה וגורמים נוספים המשפיעים על צרכי
                    הפינוי.
                  </p>
                </div>
                <div className="bg-indigo-50 p-5 rounded-lg">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-3">
                    2
                  </div>
                  <h4 className="text-lg font-medium text-indigo-900 mb-2">
                    תכנון אסטרטגי
                  </h4>
                  <p className="text-gray-600">
                    בהתבסס על הנתונים, המערכת מציעה תוכניות פינוי אופטימליות
                    המשייכות כל קהילה למתקן קליטה המתאים לצרכיה הייחודיים.
                  </p>
                </div>
                <div className="bg-indigo-50 p-5 rounded-lg">
                  <div className="w-12 h-12 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xl font-bold mb-3">
                    3
                  </div>
                  <h4 className="text-lg font-medium text-indigo-900 mb-2">
                    תיאום והפעלה
                  </h4>
                  <p className="text-gray-600">
                    בשעת חירום, המערכת מאפשרת למנהלי החירום לבצע את הפינוי בצורה
                    מסודרת, תוך התחשבות בצרכים המיוחדים של כל קהילה.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-indigo-800 mb-4">
                מי אנחנו?
              </h3>
              <p className="text-gray-700 leading-relaxed mb-6">
                CommUnity הוא פרויקט הגמר של צוות סטודנטים להנדסת תוכנה. הפרויקט
                נולד מתוך התובנה העמוקה שרכשנו במהלך אירועי החירום האחרונים
                בישראל, והרצון שלנו לתרום לחוסן הלאומי באמצעות הידע הטכנולוגי
                שרכשנו. לאחר חקר ספרות מעמיק, סקירה יסודית של פתרונות קיימים
                בשוק וראיונות עם מומחי חירום, זיהינו פער משמעותי במערכות הקיימות
                בתחום סיווג ופינוי קהילות בחירום. הפתרון שפיתחנו מבוסס על
                מתודולוגיות מתקדמות ונותן מענה ייחודי לאתגרים שזוהו.
              </p>
              <p className="text-gray-700 leading-relaxed">
                פרויקט זה מהווה את שיאו של תואר הנדסת תוכנה, והוא משלב ידע מתקדם
                במערכות מידע, אלגוריתמיקה חכמה, ויזואליזציה מרחבית וממשק משתמש
                אינטואיטיבי. אנו גאים להציג מערכת שלא רק עומדת בסטנדרטים אקדמיים
                גבוהים, אלא גם בעלת פוטנציאל להשפיע באופן ממשי על ניהול מצבי
                חירום בישראל.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
