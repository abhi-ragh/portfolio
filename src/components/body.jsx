import { FaGithub, FaLinkedin } from 'react-icons/fa';

function Body() {
  return (
    <div className="body">
      <p className="bodyHello fade-in-up">Hello There</p>
      <p className="bodyIntro fade-in-up">
        I'm Abhiragh A R<br />
        Building, Learning & Creating.
      </p>
      <p className="bodySubtext fade-in-up">
        Computer Science Engineering student passionate about creating innovative 
        software solutions and exploring new technologies.
      </p>
      <div className="social-icons fade-in-up">
        <a
          href="https://github.com/abhi-ragh"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <FaGithub size={28} />
        </a>
        <a
          href="https://www.linkedin.com/in/abhi-ragh"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedin size={28} />
        </a>
      </div>
    </div>
  );
}

export default Body;