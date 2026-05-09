import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./InterestsPage.module.css";
import logo from "../../../assets/logo.png";


export default function InterestsPage({ data }) {
  const navigate = useNavigate();
  const interestKeys = Object.keys(data?.["الاهتمامات"] || {}).slice(0, 15);
  const [selectedKey, setSelectedKey] = useState("");
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isExiting, setIsExiting] = useState(false);
  const [isProgramsExiting, setIsProgramsExiting] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const programs = data?.["الاهتمامات"]?.[selectedKey] || [];

  useEffect(() => {
    if (!isExiting) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setShowGrid(false);
      setIsExiting(false);
    }, 520);

    return () => clearTimeout(timer);
  }, [isExiting]);

  useEffect(() => {
    if (!isProgramsExiting) {
      return undefined;
    }

    const timer = setTimeout(() => {
      setShowGrid(true);
      setSelectedKey("");
      setSelectedProgram(null);
      setIsProgramsExiting(false);
    }, 420);

    return () => clearTimeout(timer);
  }, [isProgramsExiting]);

  const handleSelect = (key) => {
    if (isExiting) {
      return;
    }
    setSelectedProgram(null);
    setSelectedKey(key);
    setIsExiting(true);
  };

  const handleBackToGrid = () => {
    setIsProgramsExiting(true);
  };

  const normalizeList = (value) => {
    if (Array.isArray(value)) {
      return value;
    }
    if (!value) {
      return [];
    }
    return [value];
  };

  const handleHeaderBack = () => {
    if (selectedProgram) {
      setSelectedProgram(null);
      return;
    }
    if (showGrid) {
      navigate("/");
      return;
    }
    handleBackToGrid();
  };

  return (
    <main className={style.interests} dir="rtl">
      <header>
        <button
          className={style.backButton}
          onClick={handleHeaderBack}
          aria-label="العودة"
        >
          الرجوع للخلف
        </button>
        <img src={logo} alt="Logo" className={style.logo} />
      </header>
      <section className={style.interestsContent}>
        {showGrid && (
          <div className={style.gridIntro}>
            <p className={style.interestsDescription}> تعرف على برامجنا المقدمة بناءا على اهتمامك الخاص</p>
            <div className={`${style.hexGrid} ${isExiting ? style.hexGridExit : ""}`}>
              {interestKeys.map((key, index) => (
                <button
                  key={key}
                  type="button"
                  className={`${style.hexItem} ${selectedKey === key && isExiting ? style.hexFocus : ""
                    } ${selectedKey !== key && isExiting ? style.hexFade : ""
                    }`}
                  style={{ animationDelay: `${index * 70}ms` }}
                  onClick={() => handleSelect(key)}
                  aria-pressed={selectedKey === key}
                >
                  <span className={style.hexLabel}>{key}</span>
                </button>
              ))}
            </div>
          </div>
        )}
        {!showGrid && selectedKey && (
          <div
            key={selectedKey}
            className={`${style.programsPanel} ${isProgramsExiting ? style.programsPanelExit : ""
              }`}
          >
            <div className={style.programsHeader}>
              <i className="modus-solid-icon-arrow-back" />
              <h2 className={style.programsTitle}>
                {selectedProgram
                  ? `${selectedKey} - ${selectedProgram["اسم البرنامج"]}`
                  : `برامج ${selectedKey}`}
              </h2>
            </div>
            {!selectedProgram &&
              (programs.length === 0 ? (
                <p className={style.programsEmpty}>لا توجد برامج متاحة الآن.</p>
              ) : (
                <ul className={style.programsList}>
                  {programs.map((program, index) => (
                    <li
                      key={`${program["اسم البرنامج"]}-${index}`}
                      className={`${style.programItem} ${isProgramsExiting ? style.programItemExit : ""
                        }`}
                      style={{ animationDelay: `${index * 90}ms` }}
                    >
                      <button
                        type="button"
                        className={style.programItemButton}
                        onClick={() => setSelectedProgram(program)}
                      >
                        <span className={style.programItemName}>
                          {program["اسم البرنامج"]}
                        </span>
                        <span className={style.programItemAction}>عرض المزيد</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ))}
            {selectedProgram && (
              <div
                key={selectedProgram["اسم البرنامج"]}
                className={style.programDetails}
              >
                <div className={style.detailsColumnLearned}>
                  <h3 className={style.detailsTitle}>المهارات المكتسبة</h3>
                  <ul className={style.detailsList}>
                    {normalizeList(selectedProgram["ماذا ستتعلم"]).map(
                      (item, index) => (
                        <li key={`${item}-${index}`} className={style.detailsItem}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className={style.detailsColumnJobs}>
                  <h3 className={style.detailsTitle}>الفرص الوظيفية</h3>
                  <ul className={style.detailsList}>
                    {normalizeList(selectedProgram["الفرص الوظيفية"]).map(
                      (item, index) => (
                        <li key={`${item}-${index}`} className={style.detailsItem}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <div className={style.detailsColumnFuture}>
                  <h3 className={style.detailsTitle}>أماكن العمل</h3>
                  <ul className={style.detailsList}>
                    {normalizeList(selectedProgram["اماكن العمل المستقبلية"]).map(
                      (item, index) => (
                        <li key={`${item}-${index}`} className={style.detailsItem}>
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
