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

  // Links das planilhas - você pode alterar estes links quando atualizar as planilhas
  const planilhaLinks = {
    'Apoio Filial_16': 'https://docs.google.com/spreadsheets/d/1exemplo_apoio_filial_16/edit#gid=0',
    'Técnico_66': 'https://docs.google.com/spreadsheets/d/1exemplo_tecnico_66/edit#gid=0',
    'Técnico_06': 'https://docs.google.com/spreadsheets/d/1exemplo_tecnico_06/edit#gid=0'
  };

  const mockManuals = [
    {
      id: 'Manual_25',
      nome: '',
      cnpj: '',
      telefone: '',
      motivo: ''
    },
    {
      id: 'Manual_30',
      nome: '',
      cnpj: '',
      telefone: '',
      motivo: ''
    },
    {
      id: 'Manual_15',
      nome: '',
      cnpj: '',
      telefone: '',
      motivo: ''
    },
    {
      id: 'Manual_40',
      nome: '',
      cnpj: '',
      telefone: '',
      motivo: ''
    },
    {
      id: 'Manual_12',
      nome: '',
      cnpj: '',
      telefone: '',
      motivo: ''
    },
    {
      id: 'Manual_35',
      nome: '',
      cnpj: '',
      telefone: '',
      motivo: ''
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

  const handleCopyText = async (text, type) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers or insecure contexts
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
      toast({
        title: "Copiado!",
        description: `${type} copiado para a área de transferência`,
      });
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o texto",
        variant: "destructive"
      });
    }
  };

  const handleCopyManualInfo = () => {
    const textToCopy = `Nome: \nCNPJ:** \nTelefone: \nMotivo: `;
    handleCopyText(textToCopy, 'Template do Manual');
  };

  const handleViewManual = (cofreModel) => {
    // Extrai o número do cofre do modelo (ex: "Cofre 1" -> "1")
    const cofreNumber = cofreModel.replace('Cofre ', '');
    
    // Define o PDF específico para o cofre
    setSelectedPDF(`manual_cofre_${cofreNumber}.pdf`);
    
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
              <Card className="border-l-4 border-l-yellow bg-yellow-50">
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
                  <div className="bg-white border rounded-lg overflow-hidden">
                    {/* Header do visualizador com botão de abrir externamente */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 border-b">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Visualizador de PDF</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.open(`/${selectedPDF}`, '_blank')}
                        className="border-yellow-500 text-yellow-700 hover:bg-yellow-50 flex items-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Abrir Externa
                      </Button>
                    </div>
                    {/* Iframe do PDF */}
                    <iframe
                      src={`/${selectedPDF}`}
                      title={`Manual - ${selectedPDF}`}
                      className="w-full border-0"
                      style={{ height: '400px' }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <Card key={item} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-yellow-500">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Vault className="h-5 w-5 text-yellow-500" />
                      Cofre {item}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-center">
                      <Badge variant="outline" className="border-yellow-500 text-black">Modelo X{item}5</Badge>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-yellow-500 text-black hover:bg-yellow-50"
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
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-red-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-red-800" />
                      {manual.id}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <div className="text-gray-600 font-medium">Nome:</div>
                        <div className="text-gray-900">{manual.nome}</div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-gray-600 font-medium">CNPJ:**</div>
                        <div className="text-gray-900">{manual.cnpj}</div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-gray-600 font-medium">Telefone:</div>
                        <div className="text-gray-900">{manual.telefone}</div>
                      </div>
                      <div className="mt-3">
                        <div className="text-gray-600 font-medium">Motivo:</div>
                        <p className="text-sm text-gray-900 mt-1">{manual.motivo}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-red-600 text-red-800 hover:bg-yellow-50"
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
                <Card key={index} className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-600">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5 text-green-800" />
                      {script.title}
                    </CardTitle>
                    <CardDescription>Script padrão para {script.title.toLowerCase()}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-yellow-50 p-4 rounded-lg border border-green-800">
                      <p className="text-sm text-gray-700 font-medium mb-2">Script:</p>
                      <p className="text-sm text-gray-800 leading-relaxed">{script.content}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full border-green-800 text-green-600 hover:bg-yellow-50"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex fixed left-6 top-6 bottom-6 w-72 z-10">
        <div className="flex flex-col h-full w-full bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl border border-white/50">
          {/* Header da Sidebar */}
          <div className="p-8 border-b border-gray-100">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-6 rounded-2xl text-center shadow-lg">
              <h2 className="text-2xl font-bold text-black tracking-tight">Guide Prosegur</h2>
              <p className="text-sm text-black/80 mt-2 font-medium">Sistema de Gestão</p>
            </div>
          </div>
          
          {/* Navegação */}
          <nav className="flex-1 p-6 space-y-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`group w-full flex items-center gap-4 px-6 py-4 text-left rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-500/25 scale-105'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className={`p-2 rounded-xl transition-all duration-300 ${
                    activeSection === item.id 
                      ? 'bg-black/10' 
                      : 'bg-gray-100 group-hover:bg-yellow-100'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-base tracking-wide">{item.name}</span>
                </button>
              );
            })}
          </nav>
          
          {/* Footer da Sidebar */}
          <div className="p-6 border-t border-gray-100">
            <div className="bg-gray-50 rounded-2xl p-4 text-center">
              <p className="text-xs text-gray-500 font-medium">Versão 2.0</p>
              <p className="text-xs text-gray-400 mt-1">Prosegur © 2025</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-6 right-6 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white/90 backdrop-blur-lg shadow-xl border-white/50 rounded-2xl h-12 w-12"
        >
          {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Sidebar */}
      <div className={`lg:hidden fixed inset-y-0 right-0 z-40 w-80 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full m-4 bg-white/90 backdrop-blur-lg shadow-2xl rounded-3xl border border-white/50">
          {/* Header Mobile */}
          <div className="p-6 border-b border-gray-100">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 p-6 rounded-2xl text-center shadow-lg">
              <h2 className="text-xl font-bold text-black tracking-tight">Guide Prosegur</h2>
              <p className="text-sm text-black/80 mt-1 font-medium">Sistema de Gestão</p>
            </div>
          </div>
          
          {/* Navegação Mobile */}
          <nav className="flex-1 p-6 space-y-3">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`group w-full flex items-center gap-4 px-6 py-4 text-left rounded-2xl transition-all duration-300 ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-500/25'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <div className={`p-2 rounded-xl transition-all duration-300 ${
                    activeSection === item.id 
                      ? 'bg-black/10' 
                      : 'bg-gray-100 group-hover:bg-yellow-100'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="font-semibold text-base tracking-wide">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30 rounded-3xl"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="lg:ml-80 flex flex-col">
        <main className="p-8 lg:p-12">
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 p-8 lg:p-12">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;