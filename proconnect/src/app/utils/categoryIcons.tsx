import { ReactNode } from "react";
import { 
  FaHardHat, FaLaptopCode, FaHeartbeat, FaCut, FaChalkboardTeacher, 
  FaCar, FaUtensils, FaBroom, FaPaw, FaShieldAlt, FaQuestion 
} from "react-icons/fa";

// Função para limpar a string (remove acentos e caracteres especiais para comparação)
export const normalizeString = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") 
    .replace(/[^a-z0-9]/g, "")      
    .trim();
};

export const categoryGroups: Record<string, { icon: ReactNode, services: string[] }> = {
  "Reformas & Casa": {
    icon: <FaHardHat />,
    services: [
      "Eletricista", "Encanador", "Pintor", "Pedreiro", "Marceneiro", 
      "Serralheiro", "Vidraceiro", "Arquitetura e Urbanismo", "Engenheiro Civil",
      "Montador de Móveis", "Chaveiro", "Desentupidor", "Dedetizador / Controle de Pragas", 
      "Gesseiro / Drywall", "Tapeceiro / Estofador", "Decorador(a) de Interiores"
    ]
  },
  "Tecnologia & Digital": {
    icon: <FaLaptopCode />,
    services: [
      "Programador", "Desenvolvedor Web", "Designer Gráfico", "Fotógrafo", 
      "Fotógrafo(a)", "Videomaker", "Técnico em Informática / PC", "Técnico em Celulares",
      "Assistente Virtual / Secretária Remota", "Gestor(a) de Tráfego", 
      "Redator(a) / Copywriter", "Social Media"
    ]
  },
  "Saúde": {
    icon: <FaHeartbeat />,
    services: [
      "Enfermeiro(a)", "Nutricionista", "Psicólogo(a)", "Fisioterapeuta", 
      "Personal Trainer", "Veterinário(a)", "Cuidador(a) de Idosos", "Massoterapeuta",
      "Podólogo(a)", "Fonoaudiólogo(a)", "Acupunturista"
    ]
  },
  "Beleza & Estética": {
    icon: <FaCut />,
    services: [
      "Manicure", "Maquiador(a)", "Cabeleireiro(a)", "Manicure / Pedicure", "Esteticista",
      "Barbeiro", "Designer de Sobrancelhas", "Depilador(a)", "Tatuador(a) / Body Piercer"
    ]
  },
  "Educação & Consultoria": {
    icon: <FaChalkboardTeacher />,
    services: [
      "Professor(a) Particular", "Tradutor(a) / Intérprete", "Advogado", 
      "Contador(a)", "Consultor(a) Financeiro", "Corretor de Imóveis",
      "Professor(a) de Idiomas", "Professor(a) de Música", 
      "Tradutor(a) Juramentado(a)", "Síndico Profissional"
    ]
  },
  "Automotivo & Transporte": {
    icon: <FaCar />,
    services: [
      "Mecânico de Autos", "Eletricista de Autos", "Funileiro / Pintor Automotivo", 
      "Borracheiro", "Motorista de Aplicativo / Táxi", "Fretes e Mudanças",
      "Lavagem / Estética Automotiva", "Guincho / Reboque", "Entregador / Motoboy", 
      "Motorista Particular / Executivo"
    ]
  },
  "Eventos": {
    icon: <FaUtensils />,
    services: [
      "DJ / Som para Festas", "Animação de Festas", "Buffet e Banquete", 
      "Confeiteiro(a)", "Cozinheiro(a) / Chef", "Cerimonialista / Assessor(a) de Eventos", 
      "Bartender / Barman", "Recreador(a) Infantil"
    ]
  },
  "Domésticos": {
    icon: <FaBroom />,
    services: [
      "Jardineiro / Paisagista", "Limpeza / Diarista", "Babá / Cuidador(a) de Crianças", 
      "Costureira / Alfaiate", "Sapateiro", "Técnico em Refrigeração (Ar Condicionado)"
    ]
  },
  "Pets & Outros": {
    icon: <FaPaw />,
    services: [
      "Passeador(a) de Cães (Dog Walker)", "Banho e Tosa", "Adestrador(a)", 
      "Segurança e Monitoramento", "Detetive Particular", "Guia de Turismo"
    ]
  }
};

export const defaultIcon: ReactNode = <FaQuestion />;

export const getServiceIcon = (serviceName: string): ReactNode => {
  const normalizedSearch = normalizeString(serviceName);
  for (const group of Object.values(categoryGroups)) {
    if (group.services.some(s => normalizeString(s) === normalizedSearch)) {
      return group.icon;
    }
  }
  return defaultIcon;
};