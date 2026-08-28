export const ptBR = {
  common: {
    ok: "OK",
    email: "E-mail",
    password: "Senha",
    update: "Atualizar",
    sync: "Sincronizar",
    scanner: "Scanner",
    package: "Pacote",
    packages: "Pacotes",
    status: "Status",
    delivery: "Envio",
  },

  navigation: {
    home: "Início",
    scan: "Escanear",
    packages: "Pacotes",
    packageDetails: "Detalhes do Pacote",
    menu: "Menu",
  },

  auth: {
    login: {
      title: "Bem-vindo de volta.",
      description:
        "Entre para continuar gerenciando suas entregas.",
      emailPlaceholder: "Digite seu email",
      passwordPlaceholder: "Digite sua senha",
      submit: "Entrar",
      signup: "Criar conta",
      noAccount: "Ainda não possui uma conta?",
    },

    signup: {
      title: "Crie sua conta.",
      description:
        "Comece a organizar e acompanhar suas entregas em um só lugar.",
      emailPlaceholder: "Digite seu email",
      passwordPlaceholder: "Crie uma senha",
      confirmPassword: "Confirmar senha",
      confirmPasswordPlaceholder:
        "Digite sua senha novamente",
      submit: "Criar conta",
      alreadyHaveAccount: "Já possui uma conta?",
      login: "Entrar",
      backToLogin: "Voltar",
      success: "Conta criada com sucesso.",
    },

    validation: {
      requiredFields: "Preencha todos os campos.",
      invalidEmail: "Digite um e-mail válido.",
      invalidPassword:
        "A senha deve ter pelo menos 6 caracteres.",
      passwordsDoNotMatch: "As senhas não coincidem.",
    },

    errors: {
      invalidCredentials: "E-mail ou senha incorretos.",
      userNotFound: "Usuário não encontrado.",
      invalidEmail: "E-mail inválido.",
      userDisabled: "Conta desativada.",
      emailAlreadyInUse: "Este e-mail já está em uso.",
      operationNotAllowed:
        "Cadastro desativado no momento.",
      weakPassword:
        "Senha muito fraca. Use pelo menos 6 caracteres.",
      unknown: "Ocorreu um erro inesperado.",
    },
  },

  home: {
    greeting: "Olá,",
    headline: "Gerencie suas entregas com rapidez.",
    description:
      "Escaneie pacotes, acompanhe o status e mantenha suas entregas organizadas.",
    scanner: {
      title: "Escanear pacote",
      description:
        "Leia QR Code ou código de barras para adicionar um pacote.",
      action: "Começar",
    },
    overview: "Visão geral",
    stats: {
      packages: "Pacotes",
      pending: "Pendentes",
    },
    quickActions: "Ações",
    packageList: {
      title: "Todos os pacotes",
      description:
        "Consulte, acompanhe e gerencie seus pacotes.",
      action: "Ver pacotes",
    },
  },

  packages: {
    code: "Código",
    packageStatus: "Status do pacote",
    deliveryStatusLabel: "Status do envio",
    scannedAt: "Escaneado",

    details: {
      title: "Detalhes do pacote",
      description:
        "Informações e acompanhamento do pacote.",
      currentStatus: "Status atual",
      synchronization: "Sincronização",
      information: "Informações",
      code: "Código",
      scannedAt: "Escaneado em",
      receiver: "Recebedor",
      notAvailable: "Não informado",
      actions: "Ações",
      changeStatus: "Alterar status",
    },

    list: {
      title: "Pacotes",
      headline: "Gerencie seus pacotes",
      description:
        "Pesquise, filtre e acompanhe todos os seus pacotes em um só lugar.",
      searchPlaceholder: "Buscar pelo código do pacote...",
      filterByStatus: "Filtrar por status",
      clearFilters: "Limpar",
      all: "Todos",
      results: "Pacotes",
      packageCount_one: "{{count}} pacote",
      packageCount_other: "{{count}} pacotes",
      empty: "Nenhum pacote encontrado",
      emptyTitle: "Nenhum pacote ainda",
      emptyDescription:
        "Escaneie seu primeiro pacote para começar a acompanhar as entregas.",
      noResultsTitle: "Nenhum pacote encontrado",
      noResultsDescription:
        "Tente alterar a busca ou o filtro de status.",
    },

    actions: {
      viewDetails: "Ver detalhes",
      changeStatus: "Alterar status",
      updateAll: "Atualizar todos",
      syncPackages: "Sincronizar pacotes",
      viewAll: "Ver todos os pacotes",
      updateAndSync: "Atualizar e sincronizar",
    },

    status: {
      collected: "Coletado",
      outForDelivery: "Em rota de entrega",
      delivered: "Entregue",
    },

    deliveryStatus: {
      pending: "Pendente",
      sent: "Enviado",
    },

    updateStatus: {
      title: "Alteração de status",
      selectStatus: "Selecione o novo status do pacote:",
      receiverName: "Nome do recebedor:",
      receiverPlaceholder: "Ex: João da Silva",
      receiverRequired: "Informe o nome do recebedor.",
    },

    updateAll: {
      title: "Atualizar pacotes",
      description:
        "Escolha um status para aplicar aos pacotes desta sessão e sincronize as alterações.",
      packagesInSession_one:
        "{{count}} pacote nesta sessão",
      packagesInSession_other:
        "{{count}} pacotes nesta sessão",
      summaryDescription:
        "Todos os pacotes da sessão serão atualizados.",
      selectStatus: "Novo status",
      emptySession:
        "Não há pacotes na sessão atual para atualizar.",
      success:
        "Pacotes atualizados e sincronizados com sucesso.",
      error:
        "Não foi possível atualizar e sincronizar todos os pacotes.",
    },

    feedback: {
      scannedSuccessfully:
        "Pacote {{code}} escaneado com sucesso!",
      alreadyScanned: "Pacote já escaneado.",
      scanError: "Erro ao escanear pacote.",
      allSentSuccessfully:
        "Todos os pacotes enviados com sucesso!",
      sendSomeFailed: "Falha ao enviar alguns pacotes.",
    },

    errors: {
      receiverRequired:
        "Nome do recebedor é obrigatório para pacotes entregues.",
      invalidForSync: "Pacote inválido para sincronização.",
      syncFailed: "Falha ao sincronizar o pacote {{code}}.",
      multipleSyncFailed:
        "{{count}} pacote(s) falharam ao enviar.",
      updateStatusFailed: "Erro ao atualizar o status.",
      unknown: "Ocorreu um erro inesperado.",
    },
  },

  scanner: {
    title: "Escanear pacote",
    requestingPermission:
      "Verificando a permissão da câmera...",
    preparingCamera: "Preparando câmera",
    permissionTitle: "Acesso à câmera necessário",
    permissionRequired:
      "Permita o acesso à câmera para escanear QR Codes e códigos de barras dos pacotes.",
    permissionRequiredPermanently:
      "O acesso à câmera está desativado. Abra as configurações do dispositivo para permitir o acesso.",
    grantPermission: "Permitir acesso à câmera",
    openSettings: "Abrir configurações",
    instructionTitle: "Aponte para o código",
    instructionDescription:
      "Posicione o QR Code ou código de barras dentro da área destacada.",
    sessionTitle: "Sessão atual",
    sessionCount_one: "{{count}} pacote escaneado",
    sessionCount_other: "{{count}} pacotes escaneados",
    empty: "Nenhum pacote escaneado ainda",
    emptyTitle: "Nenhum pacote escaneado",
    emptyDescription:
      "Os pacotes adicionados nesta sessão aparecerão aqui.",
    turnTorchOn: "Ativar lanterna",
    turnTorchOff: "Desativar lanterna",
    toggleTorch: "Alternar lanterna",
  },

  accessibility: {
    input: {
      showPassword: "Mostrar senha",
      hidePassword: "Ocultar senha",
    },
    header: {
      back: "Voltar",
      logout: "Sair",
    },
    modal: {
      close: "Fechar modal",
    },
    navigation: {
      home: "Ir para início",
      scan: "Ir para o scanner",
      packages: "Ir para pacotes",
      menu: "Ir para menu",
    },
    menu: {
      scan: "Abrir scanner de pacotes",
      packages: "Abrir lista de pacotes",
      logout: "Sair da conta",
    },
  },

  menu: {
    title: "Menu",
    subtitle: "Acesse as principais funções do Pack Sync.",
    sections: {
      operations: "Operações",
      account: "Conta",
    },
    items: {
      scan: {
        title: "Escanear pacote",
        description:
          "Leia o código de barras ou QR Code de um pacote.",
      },
      packages: {
        title: "Lista de pacotes",
        description:
          "Consulte e gerencie os pacotes escaneados.",
      },
      logout: {
        title: "Sair",
        description: "Encerrar sua sessão no Pack Sync.",
      },
    },
  },
} as const;
