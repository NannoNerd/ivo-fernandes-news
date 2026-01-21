import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white py-16 relative z-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Ivo Fernandes News */}
          <div>
            <h3 className="text-cyan-400 text-xl font-bold mb-4">
              Ivo Fernandes News
            </h3>
            <p className="text-gray-300 leading-relaxed">
              Unindo tecnologia, inspiração e informação em um só lugar.
            </p>
          </div>

          {/* Navegação */}
          <div>
            <h3 className="text-cyan-400 text-xl font-bold mb-4">
              Navegação
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  to="/autocad-civil-3d" 
                  className="text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  Autocad Civil 3D
                </Link>
              </li>
              <li>
                <Link 
                  to="/motivacional" 
                  className="text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  Motivacionais
                </Link>
              </li>
              <li>
                <Link 
                  to="/criptomoedas" 
                  className="text-gray-300 hover:text-cyan-400 transition-colors"
                >
                  Criptomoedas
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-cyan-400 text-xl font-bold mb-4">
              Contato
            </h3>
            <p className="text-gray-300">
              Email: contato@ivofernandesnews.com.br
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-700 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Ivo Fernandes News - Todos os direitos reservados
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;