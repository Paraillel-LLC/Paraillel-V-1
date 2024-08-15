import { createContext, useState } from "react";

export const LessonPlanContext = createContext({
  lessons: [],
  addLessonToCale: ({ title, date }) => {},
});

const LessonPlanContextProvider = ({ children }) => {
  const [lessons, setLessons] = useState([]);

  const addLessonToCale = (lesson) => {
    setLessons((prevLessons) => [...prevLessons, lesson]);
  };

  return (
    <LessonPlanContext.Provider value={{ lessons, addLessonToCale }}>
      {children}
    </LessonPlanContext.Provider>
  );
};

export default LessonPlanContextProvider;