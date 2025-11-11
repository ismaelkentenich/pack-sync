# 📦 Pack Sync - App de Gestão de entregas e escaneamento de pacotes

Uma aplicação moderna React Native construída com Expo e TypeScript para escaneamento e gerenciamento de entregas de pacotes. Possui arquitetura offline-first com persistência SQLite, escaneamento em tempo real de códigos de barras/QR e integração webhook para notificações de entrega.

## 🧩 Visão Geral do Projeto

O Pack Sync é uma solução completa de gerenciamento de pacotes desenvolvida para empresas de entrega e operações logísticas. A aplicação fornece:

- **📱 Compatibilidade multi-plataforma** - Construído com React Native e Expo para iOS e Android
- **🔍 Escaneamento de Código de Barras & QR** - Identificação de pacotes em tempo real usando câmera do dispositivo
- **💾 Persistência offline-first** - Banco de dados SQLite para armazenamento confiável sem dependência de internet
- **🔄 Gerenciamento de Estado Global** - Zustand para gerenciamento eficiente e previsível de estado
- **🌐 Integração com Webhook** - Notificações de entrega em tempo real para sistemas externos
- **🔐 Autenticação Firebase** - Autenticação segura de usuários e gerenciamento de sessão
- **📊 Rastreamento de Pacotes** - Rastreamento completo do ciclo de vida da entrega, da coleta à entrega


## ⚙️ Instruções de Instalação

### Pré-requisitos

- **Node.js** (v18 ou superior)
- **npm** ou **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **Android Studio** (para desenvolvimento Android)
- **Xcode** (para desenvolvimento iOS - somente macOS)

### Configuração

1. **Clone o repositório**
   ```bash
   git clone https://github.com/ismaelkentenich/pack-sync.git
   cd pack-sync
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   - Configure o arquivo `.env` com as variáveis necessárias
   - Atualize a configuração do Firebase e URL do webhook no `.env`

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm start
   ```

## 🚀 Como Executar o Projeto

### Modo de Desenvolvimento

```bash
# Inicia o servidor de desenvolvimento Expo
npm start

# Executa no Android (emulador ou dispositivo)
npm run android

# Executa no iOS (simulador ou dispositivo - somente macOS)
npm run ios

```

### Configuração do Ambiente

A aplicação requer as seguintes variáveis de ambiente no seu arquivo `.env`:

```env
WEBSOCKET_URL=https://example.com/webhook/fake-webhook-id
FIREBASE_API_KEY=fake-firebase-api-key
FIREBASE_AUTH_DOMAIN=fake-project.firebaseapp.com
FIREBASE_PROJECT_ID=fake-project
FIREBASE_STORAGE_BUCKET=fake-project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=000000000000
FIREBASE_APP_ID=1:000000000000:web:0000000000000000000000
```

### Inicialização do Banco de Dados

O banco de dados SQLite é automaticamente inicializado no primeiro lançamento da aplicação. A configuração cria:
- Tabela **packages** para dados de pacotes
- Tabela **user_sessions** para estado de autenticação
- Migrações automáticas e atualizações de schema

### Configuração de Teste do Webhook

1. Visite [https://webhook.site/](https://webhook.site/)
2. Copie sua URL única do webhook
3. Atualize `WEBSOCKET_URL` no seu arquivo `.env`
4. Reinicie o servidor de desenvolvimento
5. Teste a entrega do webhook através da funcionalidade "Enviar para Webhook" da aplicação

## 🧱 Estrutura do Projeto

A aplicação segue os princípios da Clean Architecture com uma estrutura de pastas bem organizada:

```
src/
├── app/navigation/          # Configuração React Navigation e definições de rotas
│   ├── AppStack.tsx        # Stack principal de navegação da aplicação
│   ├── AuthStack.tsx       # Navegação do fluxo de autenticação
│   └── types.ts           # Definições de tipos de navegação
├── components/             # Componentes de UI reutilizáveis
│   ├── Badge/             # Componentes de indicação de status
│   ├── Button/            # Componentes de botão customizados
│   ├── Card/              # Componentes de layout de card
│   ├── Header/            # Componentes de cabeçalho de tela
│   ├── Input/             # Componentes de entrada de formulário
│   └── PackageCard/       # Componentes de exibição de pacotes
├── features/              # Organização de telas baseada em funcionalidades
│   ├── auth/screens/      # Telas de autenticação (login, cadastro)
│   ├── home/screens/      # Telas de dashboard e início
│   ├── packages/          # Funcionalidades de gerenciamento de pacotes
│   │   ├── components/    # Componentes específicos de pacotes
│   │   └── screens/       # Telas de listagem e detalhes de pacotes
│   └── scanner/screens/   # Funcionalidade de escaneamento de código de barras
├── hooks/                 # Custom React hooks
│   ├── useAppNavigation.ts    # Utilitários de navegação
│   ├── useNetworkSync.ts      # Gerenciamento de sincronização offline
│   └── usePersistedAuth.ts    # Persistência de autenticação
├── services/              # Camada de lógica de negócio
│   ├── database/          # Operações do banco de dados SQLite
│   │   └── packages/      # Camada de acesso a dados de pacotes
│   ├── firebase/          # Configuração e serviços Firebase
│   ├── packages/          # Lógica de negócio de pacotes
│   └── webhook/           # Serviços de integração webhook
├── store/                 # Gerenciamento de estado global Zustand
│   ├── auth/              # Estado de autenticação
│   └── packages/          # Estado de gerenciamento de pacotes
├── theme/                 # Sistema de design e estilização
├── types/                 # Definições de tipos TypeScript
└── utils/                 # Funções auxiliares e utilitários
    ├── date.ts           # Utilitários de formatação de data
    ├── string.ts         # Helpers de manipulação de string
    └── validators.ts     # Funções de validação de entrada
```

### Responsabilidades da Arquitetura

- **components/**: Componentes de UI reutilizáveis, somente de apresentação
- **screens/**: Telas específicas de funcionalidades e layouts de página
- **store/**: Estado global da aplicação usando Zustand
- **services/**: Lógica de negócio, chamadas de API e processamento de dados
- **hooks/**: Custom React hooks para lógica compartilhada
- **utils/**: Funções auxiliares puras e utilitários
- **navigation/**: Configuração React Navigation e roteamento

## 💡 Decisões Técnicas

### Principais Escolhas Tecnológicas

**SQLite para Persistência Offline**
- Escolhido para armazenamento confiável de dados offline-first
- Permite funcionalidade completa da aplicação sem conectividade com internet

**Zustand para Gerenciamento de Estado**
- Alternativa leve ao Redux com boilerplate mínimo
- Design TypeScript-first com excelente inferência de tipos
- API simples adequada para desenvolvimento React Native
- Re-renderização eficiente com subscrições baseadas em seletores

**Expo Camera para Escaneamento**
- Escaneamento cross-platform de códigos de barras e QR
- Performance otimizada para escaneamento em tempo real
- Tratamento integrado de permissões de câmera
- Suporte para múltiplos formatos de código de barras

**Arquitetura Offline-First**
- Banco de dados SQLite local como única fonte da verdade
- Fila de sincronização em background para entrega de webhook
- Tratamento elegante de problemas de conectividade de rede
- Persistência de dados através das sessões da aplicação

### Motivações e Experiências

Durante o desenvolvimento, busquei expandir minhas experiências técnicas e explorar novas abordagens fora das tecnologias que utilizo no dia a dia profissional.

Escolhi SQLite e Zustand para sair da zona de conforto e experimentar ferramentas diferentes do Redux, que é o gerenciador de estado que mais utilizo atualmente.

 Essa escolha me permitiu entender melhor os conceitos de persistência offline, arquitetura reativa leve e sincronização de dados, além de aprimorar minha visão sobre performance e simplicidade de estado em projetos React Native.

## 🔗 Configuração do Webhook

### Instruções de Configuração

1. **Criar um endpoint webhook**
   - Visite [https://webhook.site/](https://webhook.site/)
   - Copie sua URL única do webhook (ex: `https://webhook.site/abc123-def456`)

2. **Configurar a aplicação**
   - Atualize `WEBSOCKET_URL` no seu arquivo `.env`
   - Reinicie o servidor de desenvolvimento para aplicar as mudanças

3. **Testar entrega do webhook**
   - Escaneie um pacote na aplicação
   - Mude seu status para "Entregue" e insira o nome do destinatário
   - Toque no botão "Enviar para Webhook"
   - Observe o payload no webhook.site

### Estrutura do Payload do Webhook

A aplicação envia a seguinte estrutura de payload JSON:

```json
{
  "code": "ABC123456",
  "clientName": "João Silva",
  "status": "Entregue",
  "deliveryStatus": "sent",
  "scanned_at": "2025-11-10T14:30:00.000Z"
}
```

**Descrição dos Campos:**
- `code`: Identificador do código de barras/QR do pacote
- `clientName`: Nome do destinatário (incluído apenas quando status é "Entregue")
- `status`: Status atual do pacote (veja definições de status abaixo)
- `deliveryStatus`: Status de entrega do webhook (`pending` | `sent`)
- `scanned_at`: Timestamp ISO de quando o pacote foi escaneado pela primeira vez

## 📦 Explicação dos Status de Pacote e Entrega

### Fluxo de Status do Pacote

**Coletado**
- O pacote foi coletado do remetente
- Status inicial quando o pacote entra no sistema
- Pronto para processamento de trânsito

**Em rota de entrega**
- O pacote está em trânsito para o destino final
- Atribuído ao veículo/entregador de entrega
- Entrega esperada dentro do prazo/dia atual

**Entregue**
- Pacote entregue com sucesso ao destinatário
- Requer confirmação do nome do destinatário
- Status final no ciclo de vida da entrega

### Estados de Status de Entrega

**pending**
- Dados do pacote ainda não enviados para webhook
- Enfileirado para próxima operação de sincronização
- Exibido com indicador pendente na UI

**sent**
- Dados do pacote transmitidos com sucesso para webhook
- Notificação de entrega confirmada enviada
- Marcado com indicador de sucesso na aplicação

## 🔄 Fluxo de Uso da Aplicação

### Jornada Completa do Usuário

1. **Autenticação**
   - Lance a aplicação e navegue para a tela de login
   - Insira credenciais de email e senha
   - Autenticação bem-sucedida redireciona para o dashboard principal

2. **Escaneamento de Pacotes**
   - Navegue para a tela do scanner via navegação inferior
   - Aponte a câmera do dispositivo para o código de barras/QR do pacote
   - A aplicação detecta e processa automaticamente o código do pacote
   - Pacote adicionado à sessão atual com status "Coletado"

3. **Gerenciamento de Status**
   - Visualize pacotes escaneados na tela de lista de pacotes
   - Toque no card do pacote para abrir modal de detalhes
   - Use modal de atualização de status para alterar o status do pacote:
     - Selecione "Em rota de entrega" para pacotes em trânsito
     - Selecione "Entregue" para pacotes entregues

4. **Confirmação de Entrega**
   - Ao marcar pacote como "Entregue":
     - Insira o nome completo do destinatário na entrada de texto
     - Confirme que os detalhes de entrega estão corretos
     - Salve as alterações para atualizar o registro do pacote

5. **Gerenciamento de Pacotes**
   - Visualize todos os pacotes em ordem cronológica
   - Use funcionalidade de busca para encontrar pacotes específicos
   - Filtre pacotes por status (Todos, Coletado, Em Trânsito, Entregue)
   - Ordene pacotes por data de escaneamento ou status

6. **Integração com Webhook**
   - Sincronização de pacote individual:
     - Abra detalhes do pacote
     - Toque no botão "Enviar para Webhook"
     - Observe mudança de status de "pending" para "sent"
   - Sincronização em lote:
     - Use função "Enviar Todos" para pacotes da sessão atual
     - Monitore progresso e confirme entrega bem-sucedida

7. **Gerenciamento de Sessão**
   - Reinicie a sessão atual para limpar lista temporária de pacotes
   - Mantenha histórico persistente de pacotes através das sessões
   - Revise performance de entrega e estatísticas


## 🧭 Próximos Passos

- Implementar testes unitários para garantir estabilidade e confiabilidade nas principais funções e serviços

- Implementar Storybook para componentes permitindo documentar visualmente os componentes e promover consistência no design

- Atualizar os designs e refinar a UI seguindo boas práticas de UX e identidade visual

- Implementar webhook dinâmico, permitindo que o próprio usuário adicione seu endpoint webhook, com vinculação no banco de dados

---

## 📄 Licença

Este projeto é privado e proprietário. Todos os direitos reservados.


