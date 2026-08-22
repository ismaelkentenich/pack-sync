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
    scanner: "Scanner",
    packages: "Lista de Pacotes",
    packageDetails: "Detalhes do Pacote",
  },

  auth: {
    login: {
      title: "Login",
      emailPlaceholder: "Digite seu e-mail",
      passwordPlaceholder: "Digite sua senha",
      submit: "Login",
      signup: "Cadastrar",
    },

    signup: {
      title: "Criar Conta",
      emailPlaceholder: "Digite seu e-mail",
      passwordPlaceholder: "Digite sua senha",
      confirmPassword: "Confirmar Senha",
      confirmPasswordPlaceholder: "Confirme sua senha",
      submit: "Cadastrar",
      alreadyHaveAccount: "Já tem conta?",
      success: "Conta criada com sucesso!",
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
    scanner: "Scanner",
    packageList: "Lista de Pacotes",
  },

  packages: {
    code: "Código",
    packageStatus: "Status do pacote",
    deliveryStatusLabel: "Status do envio",
    scannedAt: "Escaneado",

    details: {
      title: "Detalhes do Pacote",
      changeStatus: "Alterar status",
      receiver: "Recebedor",
    },

    list: {
      title: "Lista de Pacotes",
      searchPlaceholder: "Buscar por código...",
      all: "Todos",
      empty: "Nenhum pacote encontrado",
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
      title: "Alterar status de todos os pacotes",
      packagesInSession:
        "Pacotes bipados nesta sessão: {{count}}",
      selectStatus: "Selecione o novo status:",
      emptySession: "Nenhum pacote bipado nesta sessão.",
      success:
        "Status atualizado e pacotes enviados ao webhook!",
      error: "Falha ao atualizar os pacotes.",
    },

    feedback: {
      scannedSuccessfully:
        "Pacote {{code}} escaneado com sucesso!",
      alreadyScanned: "Pacote já escaneado",
      scanError: "Erro ao escanear pacote",
      allSentSuccessfully:
        "Todos os pacotes enviados com sucesso!",
      sendSomeFailed: "Falha ao enviar alguns pacotes.",
    },
  },

  scanner: {
    title: "Scanner",
    requestingPermission:
      "Solicitando permissão de câmera...",
    permissionRequired:
      "Para escanear os pacotes, ative a permissão da câmera.",
    grantPermission: "Conceder permissão",
    empty: "Nenhum pacote escaneado ainda",
  },
} as const;
