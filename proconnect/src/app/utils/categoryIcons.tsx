import { ReactNode } from "react"; // Importamos o tipo correto do React
import { 
  FaHammer, 
  FaCode, 
  FaPaintBrush, 
  FaStethoscope, 
  FaGraduationCap, 
  FaQuestion, 
  FaCut 
} from "react-icons/fa";

// Usamos ReactNode em vez de JSX.Element para ser mais abrangente e seguro
export const categoryIcons: Record<string, ReactNode> = {
  "Construção Civil": <FaHammer />,
  "Tecnologia": <FaCode />,
  "Design": <FaPaintBrush />,
  "Saúde": <FaStethoscope />,
  "Educação": <FaGraduationCap />,
  "Beleza": <FaCut />, // Adicionamos a categoria que você queria
};

export const defaultIcon: ReactNode = <FaQuestion />;