import { FaHammer, FaCode, FaPaintBrush, FaStethoscope, FaGraduationCap, FaQuestion, FaCut } from "react-icons/fa";

export const categoryIcons: Record<string, JSX.Element> = {
  "Construção Civil": <FaHammer />,
  "Tecnologia": <FaCode />,
  "Design": <FaPaintBrush />,
  "Saúde": <FaStethoscope />,
  "Educação": <FaGraduationCap />,
  "Beleza": <FaCut />,
};

export const defaultIcon = <FaQuestion />;