import { FaGithub, FaLinkedin } from 'react-icons/fa';

function Body() {
    return (
      <div className="body">
        <p className="bodyHello fade-in-up">Hello There</p>
        <p className="bodyIntro fade-in-up">
          Myself Abhiragh A R <br /> Here to Build, Learn and Have Fun
        </p>
        <div className="social-icons fade-in-up">
          <a
            href="https://github.com/your-github-username"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <FaGithub size={30} />
          </a>
          <a
            href="https://www.linkedin.com/in/your-linkedin-username"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin size={30} />
          </a>
        </div>
      </div>
    );
  }

  export default Body;