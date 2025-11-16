import React from 'react';
import './footer.css';


const Footer = () => {
  return (
    <footer className="custom-footer py-4">

      <div className="container">
        <div className="row text-center text-md-start align-items-center">
           
          <div className="col-md-4 mb-3 mb-md-0">
            <ul className="list-unstyled d-flex justify-content-center justify-content-md-start gap-3 mb-0">
              <li>
                <a
                  href="https://www.instagram.com/eco_revieww"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  <i className="bi bi-instagram me-1"></i> Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/share/1Cs6Z6kbZu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  <i className="bi bi-facebook me-1"></i> Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/eco_revieww"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link"
                >
                  <i className="bi bi-twitter-x me-1"></i> X
                </a>
              </li>
            </ul>
          </div>


          <div className="col-md-4 mb-3 mb-md-0 text-center">
            <p className="footer-text mb-1 fw-semibold">Contacto</p>
            <p className="footer-text mb-0">©2025 Grupo 3</p>
          </div>


          <div className="col-md-4 text-center text-md-end">
            <a href="mailto:participaeco@gmail.com" className="footer-link">
              <i className="bi bi-envelope me-1"></i> participaeco@gmail.com
            </a>
          </div>


        </div>
      </div>
    </footer>
  );
};


export default Footer;