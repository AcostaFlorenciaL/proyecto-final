import './inicio.css';
export default function Inicio() {
  const menuOptions = [
    { id: 1, title: 'Pizzas', image: 'img/pizza.jpg', alt: 'Pizzas' },
    { id: 2, title: 'Entre Panes', image: 'img/entrePanes.jpg', alt: 'Sandwiches' },
    { id: 3, title: 'Al Plato', image: 'img/alPlato.jpg', alt: 'Platos' },
    { id: 4, title: 'Bebidas', image: 'img/bebidas.jpg', alt: 'Bebidas' }
  ];

  return (
    <main>
      {/* Sección de Opciones del Menú */}
      <section className="my-5">
        <h2 className="text-center mb-4">Nuestras opciones</h2>
        <br />
        <div className="container">
          <div className="row row-cols-2 row-cols-md-4 g-4 justify-content-center">
            {menuOptions.map((option) => (
              <div key={option.id} className="col">
                <div className="card h-100 shadow-sm">
                  <img 
                    src={option.image} 
                    className="card-img-top" 
                    alt={option.alt}
                    style={{ height: '300px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <button className="btn btn-primary w-100">
                      {option.title}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Ubicación y Horarios */}
      <section id="ubicacion" className="my-5">
        <div className="container">
          <h2 className="text-center mb-4">En dónde estamos</h2>
          <div className="row justify-content-center">
            <div className="col-11 col-md-8 col-lg-8">
              <div className="ratio ratio-16x9">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3543.6483440207894!2d-65.59801942486789!3d-27.355460411847776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9423cf606d2c1f93%3A0x9a3e0dd70a67d834!2sUniversidad%20Tecnol%C3%B3gica%20Nacional%20%E2%80%93%20Facultad%20Regional%20Tucum%C3%A1n%20(U.T.N.%20%E2%80%93%20F.R.T.)%20%5BExtensi%C3%B3n%20%C3%81ulica%20Concepci%C3%B3n%5D!5e0!3m2!1ses!2sar!4v1762351982103!5m2!1ses!2sar"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación del restaurante"
                />
              </div>
            </div>
          </div>
          
          <h2 className="text-center mt-4">Horarios de atención</h2>
          <div className="row justify-content-center">
            <div className="col-auto text-center">
              <p className="mb-1 h3">Lunes a domingos 08:30 - 13:30 y 17:30 - 00:30</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}