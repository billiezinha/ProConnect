import React from 'react';
import { Mail, MessageCircle, Globe } from 'lucide-react';
import { FiInstagram } from 'react-icons/fi';
import styles from './Footer.module.css';
import { usePathname } from 'next/navigation';

const Footer = () => {
  const pathname = usePathname();
  if (pathname === '/login' || pathname === '/cadastro-usuario' || pathname === '/chat') {
    return null;
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Coluna 1: Sobre */}
          <div className={styles.column}>
            <h2 className={styles.brand}>ProConnect</h2>
            <p className={styles.description}>
              Conectando os melhores profissionais aos clientes que buscam excelência e praticidade.
            </p>
          </div>

          {/* Coluna 2: Contatos */}
          <div className={styles.column}>
            <h3 className={styles.title}>Contatos</h3>
            <ul className={styles.list}>
              <li>
                <a href="mailto:proconnect.startup@gmail.com" className={styles.link}>
                  <Mail size={18} /> proconnect.startup@gmail.com
                </a>
              </li>
              <li>
                <span className={styles.disabledLink}>
                  <MessageCircle size={18} /> WhatsApp (Em breve)
                </span>
              </li>
            </ul>
          </div>

          {/* Coluna 3: Redes Sociais */}
          <div className={styles.column}>
            <h3 className={styles.title}>Siga-nos</h3>
            <div className={styles.socials}>
              <a 
                href="https://www.instagram.com/proconnect.startup" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialIcon}
              >
                <FiInstagram size={24} />
              </a>
              <a href="#" className={styles.socialIcon}>
                <Globe size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p>&copy; {new Date().getFullYear()} ProConnect. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;