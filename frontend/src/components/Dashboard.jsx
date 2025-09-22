import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';
import {
  Vault,
  BookOpen,
  MessageCircle,
  HelpCircle,
  GraduationCap,
  Search,
  ExternalLink,
  FileSpreadsheet,
  Menu,
  X,
  Copy,
  Eye,
  FileText
} from 'lucide-react';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('cofres');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const { toast } = useToast();

  const navigation = [
    { id: 'cofres', name: 'Cofres', icon: Vault },
    { id: 'manuais', name: 'Manuais', icon: BookOpen },
    { id: 'script', name: 'Script', icon: MessageCircle },
    { id: 'faq', name: 'FAQ', icon: HelpCircle },
    { id: 'treinamentos', name: 'Treinamentos', icon: GraduationCap },
  ];

  const mockCities = {
    'Apoio Filial_16': ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Porto Alegre'],
    'Técnico_66': ['Brasília', 'Salvador', 'Fortaleza', 'Curitiba'],
    'Técnico_06': ['Recife', 'Manaus', 'Belém', 'Goiânia']
  };

  const mockManuals = [
    {
      id: 'Manual_25',
      nome: 'João Silva Santos',
      cnpj: '12.345.678/0001-90',
      telefone: '(11) 98765-4321',
      motivo: 'Instalação de cofre modelo X25 - Filial Centro'
    },
    {
      id: 'Manual_30',
      nome: 'Maria Oliveira Lima',
      cnpj: '98.765.432/0001-10',
      telefone: '(21) 91234-5678',
      motivo: 'Manutenção preventiva cofre Y30 - Shopping Norte'
    },
    {
      id: 'Manual_15',
      nome: 'Carlos Eduardo Costa',
      cnpj: '11.222.333/0001-44',
      telefone: '(85) 97777-8888',
      motivo: 'Troca de fechadura digital - Modelo Z15'
    },
    {
      id: 'Manual_40',
      nome: 'Ana Paula Ferreira',
      cnpj: '55.666.777/0001-22',
      telefone: '(31) 96666-7777',
      motivo: 'Instalação sistema biométrico - Cofre W40'
    },
    {
      id: 'Manual_12',
      nome: 'Roberto Almeida',
      cnpj: '22.333.444/0001-55',
      telefone: '(41) 95555-4444',
      motivo: 'Reparo sistema eletrônico - Modelo V12'
    },
    {
      id: 'Manual_35',
      nome: 'Fernanda Santos',
      cnpj: '77.888.999/0001-33',
      telefone: '(51) 94444-3333',
      motivo: 'Atualização firmware - Cofre U35'
    }
  ];

  const mockScripts = [
    {
      title: 'Atendimento Inicial',
      content: 'Olá! Seja bem-vindo(a) ao suporte Prosegur. Meu nome é [NOME]. Como posso ajudá-lo(a) hoje? Por favor, me informe seu nome completo e o número do cofre para que eu possa localizar suas informações no sistema.'
    },
    {
      title: 'Suporte Técnico',
      content: 'Entendo sua situação. Vou orientá-lo(a) passo a passo para resolver este problema técnico. Primeiro, verifique se o cofre está conectado à energia elétrica. Em seguida, pressione o botão RESET por 5 segundos. Aguarde o sinal sonoro duplo antes de inserir a senha.'
    },
    {
      title: 'Vendas',
      content: 'Obrigado pelo interesse em nossos produtos Prosegur! Temos diversas opções de cofres que atendem desde residências até grandes empresas. Qual o tipo de estabelecimento e qual o nível de segurança que você necessita? Com base nisso, posso recomendar o modelo ideal.'
    },
    {
      title: 'Pós-venda',
      content: 'Agradecemos por escolher a Prosegur! Para garantir que você tenha a melhor experiência com seu cofre, oferecemos suporte 24h, manutenção preventiva gratuita no primeiro ano e garantia total de 3 anos. Você tem alguma dúvida sobre o funcionamento do seu equipamento?'
    }
  ];

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Erro",
        description: "Digite o nome de uma cidade para buscar",
        variant: "destructive"
      });
      return;
    }

    const results = [];
    Object.entries(mockCities).forEach(([sheet, cities]) => {
      if (cities.some(city => city.toLowerCase().includes(searchQuery.toLowerCase()))) {
        results.push(sheet);
      }
    });

    if (results.length > 0) {
      toast({
        title: "Resultados encontrados",
        description: `Cidade encontrada em: ${results.join(', ')}`,
      });
    } else {
      toast({
        title: "Não encontrado",
        description: "Cidade não encontrada nas planilhas",
        variant: "destructive"
      });
    }
  };

  const handleExcelDownload = (fileName) => {
    toast({
      title: "Download iniciado",
      description: `Abrindo planilha ${fileName}...`,
    });
    setTimeout(() => {
      window.open('#', '_blank');
    }, 500);
  };

  const handleCopyText = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Copiado!",
        description: `${type} copiado para a área de transferência`,
      });
    }).catch(() => {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o texto",
        variant: "destructive"
      });
    });
  };

  const handleCopyManualInfo = () => {
    const textToCopy = `Nome: \nCNPJ: \nTelefone: \nMotivo: `;
    handleCopyText(textToCopy, 'Informações do Manual');
  };

  const handleViewManual = (cofreModel) => {
    setSelectedPDF(`manual_cofre_${cofreModel}.pdf`);
    toast({
      title: "Manual carregado",
      description: `Exibindo manual do ${cofreModel}`,
    });
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'cofres':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Cofres</h1>
              <p className="text-gray-600">Gerencie e monitore todos os cofres corporativos</p>
            </div>
            
            {selectedPDF && (
              <Card className="border-l-4 border-l-yellow-500 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-yellow-600" />
                      Manual do Cofre - {selectedPDF}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedPDF(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white border rounded-lg p-4 min-h-96 flex items-center justify-center">
                    <div className="text-center">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Visualizador de PDF</p>
                      <p className="text-sm text-gray-500 mt-2">Manual: {selectedPDF}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card key={item} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-yellow-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Vault className="h-5 w-5 text-yellow-600" />
                      Cofre {item}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-center">
                      <Badge variant="outline" className="border-yellow-500 text-yellow-700">Modelo X{item}5</Badge>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                      onClick={() => handleViewManual(`Cofre ${item}`)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Manual
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'manuais':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Manuais</h1>
              <p className="text-gray-600">Documentação e informações técnicas</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockManuals.map((manual, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-yellow-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-yellow-600" />
                      {manual.id}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Nome:</span>
                        <span className="text-gray-900">{manual.nome}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">CNPJ:</span>
                        <span className="text-gray-900">{manual.cnpj}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-medium">Telefone:</span>
                        <span className="text-gray-900">{manual.telefone}</span>
                      </div>
                      <div className="mt-3">
                        <span className="text-gray-600 font-medium">Motivo:</span>
                        <p className="text-sm text-gray-900 mt-1">{manual.motivo}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                      onClick={handleCopyManualInfo}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'script':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Script WhatsApp</h1>
              <p className="text-gray-600">Templates e scripts para atendimento</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockScripts.map((script, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-yellow-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-yellow-600" />
                      {script.title}
                    </CardTitle>
                    <CardDescription>Script padrão para {script.title.toLowerCase()}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <p className="text-sm text-gray-700 font-medium mb-2">Script:</p>
                      <p className="text-sm text-gray-800 leading-relaxed">{script.content}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-yellow-500 text-yellow-700 hover:bg-yellow-50"
                      onClick={() => handleCopyText(script.content, 'Script')}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar Script
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">FAQ</h1>
              <p className="text-gray-600">Perguntas frequentes e planilhas de apoio</p>
            </div>
            
            <Card className="border-l-4 border-l-yellow-500">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5 text-yellow-600" />
                  Buscar Cidade nas Planilhas
                </CardTitle>
                <CardDescription>Digite o nome da cidade para encontrar em qual planilha ela está localizada</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite o nome da cidade..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Planilhas de Apoio</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['Apoio Filial_16', 'Técnico_66', 'Técnico_06'].map((sheet, index) => (
                  <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-yellow-500 cursor-pointer" onClick={() => handleExcelDownload(sheet)}>
                    <CardHeader className="text-center">
                      <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
                        <FileSpreadsheet className="h-8 w-8 text-yellow-600" />
                      </div>
                      <CardTitle className="text-lg">{sheet}</CardTitle>
                      <CardDescription>Planilha Excel</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="outline" className="w-full border-yellow-500 text-yellow-700 hover:bg-yellow-50" onClick={(e) => {e.stopPropagation(); handleExcelDownload(sheet);}}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Abrir Planilha
                      </Button>
                      <div className="mt-3 text-xs text-gray-500">
                        Cidades incluídas: {mockCities[sheet]?.slice(0, 2).join(', ')}...
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'treinamentos':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Treinamentos</h1>
              <p className="text-gray-600">Cursos e materiais de capacitação</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {['Segurança Corporativa', 'Atendimento ao Cliente', 'Sistemas Internos', 'Compliance', 'Liderança', 'Técnico Avançado'].map((training, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-yellow-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-yellow-600" />
                      {training}
                    </CardTitle>
                    <CardDescription>Duração: 2-4 horas</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Progresso:</span>
                      <Badge variant="secondary">{Math.floor(Math.random() * 100)}%</Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{width: `${Math.floor(Math.random() * 100)}%`}}></div>
                    </div>
                    <Button variant="outline" className="w-full border-yellow-500 text-yellow-700 hover:bg-yellow-50">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Continuar Treinamento
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-64 bg-white shadow-xl">
        <div className="flex flex-col h-full w-full">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-yellow-500 to-yellow-400">
            <h2 className="text-xl font-bold text-black">Dashboard Prosegur</h2>
            <p className="text-sm text-black opacity-80 mt-1">Sistema de Gestão</p>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-yellow-50 text-yellow-700 border-r-2 border-yellow-500'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white shadow-md"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 right-0 z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-yellow-500 to-yellow-400">
            <h2 className="text-xl font-bold text-black">Dashboard Prosegur</h2>
            <p className="text-sm text-black opacity-80 mt-1">Sistema de Gestão</p>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-yellow-50 text-yellow-700 border-r-2 border-yellow-500'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;