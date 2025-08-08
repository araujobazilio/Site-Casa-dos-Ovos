import React from 'react';
import { Info } from 'lucide-react';

const EggClassificationTable = () => {
  const classifications = [
    {
      classification: 'P - Pequeno',
      weight: '< 53 g',
      commercial: 'Pequeno',
      quality: 'Classe A, B ou C',
      observations: 'Galinhas jovens, menor gema e clara.'
    },
    {
      classification: 'M - Médio',
      weight: '53 a 59 g',
      commercial: 'Médio',
      quality: 'Classe A, B ou C',
      observations: 'Mais comuns em granjas, preço intermediário.'
    },
    {
      classification: 'G - Grande',
      weight: '60 a 66 g',
      commercial: 'Grande',
      quality: 'Classe A, B ou C',
      observations: 'Muito usado em culinária, padrão comercial.'
    },
    {
      classification: 'XL - Extra',
      weight: '67 a 73 g',
      commercial: 'Extra, Extra Grande, Extra Top',
      quality: 'Classe A, B ou C',
      observations: 'Grande apelo comercial; "Extra Top" é apenas marketing.'
    },
    {
      classification: 'Jumbo',
      weight: '> 73 g',
      commercial: 'Jumbo, Super Jumbo',
      quality: 'Classe A, B ou C',
      observations: 'Raros, mais caros, casca pode ser mais fina.'
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Info className="text-blue-500 mr-3" size={40} />
            <h2 className="text-4xl font-bold text-gray-800">
              Classificação dos Ovos
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Entenda as diferentes classificações dos ovos e escolha o melhor para suas necessidades
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Classificação</th>
                  <th className="px-6 py-4 text-left font-semibold">Peso por Ovo</th>
                  <th className="px-6 py-4 text-left font-semibold">Nome Comercial</th>
                  <th className="px-6 py-4 text-left font-semibold">Qualidade Oficial</th>
                  <th className="px-6 py-4 text-left font-semibold">Observações</th>
                </tr>
              </thead>
              <tbody>
                {classifications.map((item, index) => (
                  <tr 
                    key={index} 
                    className={`${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    } hover:bg-blue-50 transition-colors duration-200`}
                  >
                    <td className="px-6 py-4 font-semibold text-blue-600">
                      {item.classification}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {item.weight}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {item.commercial}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {item.quality}
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-sm">
                      {item.observations}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-8 bg-blue-100 border-l-4 border-blue-500 p-6 rounded-r-lg">
          <div className="flex items-start">
            <Info className="text-blue-500 mr-3 mt-1 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Informação Importante
              </h3>
              <p className="text-blue-700">
                Todos os nossos ovos são de <strong>Classe A</strong>, garantindo a melhor qualidade e frescor. 
                A classificação por tamanho não interfere na qualidade nutricional, apenas no peso e tamanho do ovo.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EggClassificationTable;