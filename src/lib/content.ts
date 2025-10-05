// src/lib/content.ts
// Brazilian Portuguese content for the bakery website

export const siteContent = {
  // Site metadata
  siteName: "Padaria Artesanal Vovó Maria",
  siteTagline: "Tradição e sabor em cada pedacinho",
  siteDescription: "Padaria artesanal com receitas tradicionais, pães frescos diariamente e doces que despertam as melhores lembranças da infância.",

  // Navigation
  navigation: {
    home: "Início",
    menu: "Cardápio",
    about: "Nossa História",
    gallery: "Galeria",
    location: "Localização",
    contact: "Contato"
  },

  // Hero section
  hero: {
    title: "Padaria Artesanal Vovó Maria",
    subtitle: "Tradição e sabor em cada pedacinho",
    description: "Há mais de 30 anos trazendo para sua mesa o melhor dos pães artesanais, doces caseiros e salgados irresistíveis. Feito com amor, como na casa da vovó.",
    cta: {
      primary: "Ver Cardápio",
      secondary: "Nossa Localização"
    }
  },

  // Menu section
  menu: {
    title: "Nosso Cardápio",
    subtitle: "Delícias preparadas diariamente com ingredientes selecionados",
    description: "Confira nossa seleção especial de pães, doces e salgados preparados com receitas tradicionais e muito carinho.",
    viewAll: "Ver Cardápio Completo",
    priceLabel: "A partir de"
  },

  // About section
  about: {
    title: "Nossa História",
    subtitle: "Três décadas espalhando amor através da culinária",
    story: {
      paragraph1: "A Padaria Artesanal Vovó Maria nasceu em 1993 do sonho de Maria Conceição, uma apaixonada pela arte da panificação que aprendeu os segredos dos pães e doces com sua avó ainda na infância.",
      paragraph2: "Com receitas passadas de geração em geração, transformamos ingredientes simples em experiências inesquecíveis. Cada pão que sai do nosso forno carrega a tradição e o carinho de quem entende que cozinhar é um ato de amor.",
      paragraph3: "Hoje, continuamos fiéis às nossas origens: usamos fermentação natural, ingredientes selecionados e muito amor em cada receita. Nossa missão é fazer você se sentir em casa a cada mordida."
    },
    values: {
      title: "Nossos Valores",
      quality: {
        title: "Qualidade Premium",
        description: "Ingredientes selecionados e processos artesanais que garantem sabor único."
      },
      tradition: {
        title: "Tradição Familiar",
        description: "Receitas passadas de geração em geração, preservando sabores autênticos."
      },
      freshness: {
        title: "Frescor Diário",
        description: "Produção diária para garantir que você leve para casa o melhor sabor."
      }
    }
  },

  // Gallery section
  gallery: {
    title: "Nossa Galeria",
    subtitle: "Um pouquinho do que preparamos com amor para você",
    categories: {
      products: "Nossos Produtos",
      bakery: "Nossa Padaria",
      team: "Nossa Equipe"
    },
    imageAlt: {
      bread: "Pães artesanais frescos",
      pastry: "Doces e bolos caseiros",
      interior: "Interior aconchegante da padaria",
      baker: "Padeiro trabalhando com massa",
      display: "Vitrine com produtos frescos"
    }
  },

  // Location section
  location: {
    title: "Nossa Localização",
    subtitle: "Venha nos visitar e sentir o aroma dos pães frescos",
    address: {
      street: "Rua das Flores, 123",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567"
    },
    hours: {
      title: "Horário de Funcionamento",
      weekdays: "Segunda a Sexta: 06h às 19h",
      saturday: "Sábado: 06h às 18h",
      sunday: "Domingo: 07h às 16h"
    },
    phone: "(11) 1234-5678",
    whatsapp: "(11) 94907-6185",
    email: "udala.app@gmail.com",
    directions: "Como Chegar"
  },

  // Contact section
  contact: {
    title: "Entre em Contato",
    subtitle: "Estamos aqui para atender você da melhor forma",
    form: {
      name: {
        label: "Nome Completo",
        placeholder: "Digite seu nome"
      },
      email: {
        label: "E-mail",
        placeholder: "seu@email.com"
      },
      phone: {
        label: "Telefone",
        placeholder: "(11) 99999-9999"
      },
      subject: {
        label: "Assunto",
        placeholder: "Como podemos ajudar?"
      },
      message: {
        label: "Mensagem",
        placeholder: "Conte-nos como podemos ajudar você..."
      },
      submit: "Enviar Mensagem",
      sending: "Enviando...",
      success: "Mensagem enviada com sucesso! Retornaremos em breve.",
      error: "Ops! Algo deu errado. Tente novamente ou entre em contato pelo telefone."
    },
    info: {
      title: "Outras Formas de Contato",
      phone: "Telefone",
      whatsapp: "WhatsApp",
      email: "E-mail",
      visit: "Ou venha nos visitar pessoalmente!"
    }
  },

  // Footer
  footer: {
    description: "Padaria artesanal com tradição de família, servindo a comunidade há mais de 30 anos com produtos frescos e sabor incomparável.",
    sections: {
      about: {
        title: "Sobre Nós",
        links: [
          { text: "Nossa História", href: "#about" },
          { text: "Nossos Valores", href: "#about" },
          { text: "Equipe", href: "#about" }
        ]
      },
      products: {
        title: "Produtos",
        links: [
          { text: "Pães Artesanais", href: "#menu" },
          { text: "Doces Caseiros", href: "#menu" },
          { text: "Salgados", href: "#menu" },
          { text: "Bolos e Tortas", href: "#menu" }
        ]
      },
      contact: {
        title: "Contato",
        address: "Rua das Flores, 123 - Centro",
        phone: "(11) 1234-5678",
        whatsapp: "(11) 94907-6185",
        email: "udala.app@gmail.com"
      }
    },
    social: {
      facebook: "Facebook",
      instagram: "Instagram",
      whatsapp: "WhatsApp"
    },
    copyright: "© 2025 Mercúrio Digital. Todos os direitos reservados."
  },

  // Common labels
  common: {
    loading: "Carregando...",
    error: "Erro ao carregar",
    tryAgain: "Tentar novamente",
    close: "Fechar",
    previous: "Anterior",
    next: "Próximo",
    viewMore: "Ver mais",
    backToTop: "Voltar ao topo"
  }
};

export type SiteContent = typeof siteContent;