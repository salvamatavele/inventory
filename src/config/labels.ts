export const labels = {
  common: {
    add: "Adicionar",
    all: "Todos",
    edit: "Editar",
    delete: "Excluir",
    save: "Salvar",
    cancel: "Cancelar",
    loading: "Carregando...",
    search: "Buscar...",
    noResults: "Nenhum resultado encontrado",
    actions: "Ações",
    error: "Ocorreu um erro",
    by: "por",
    errors: {
      default: "Algo deu errado",
    },
    confirmDelete: {
      title: "Confirmar exclusão",
      description: "Tem certeza que deseja excluir este item?",
      confirm: "Sim, excluir",
      cancel: "Cancelar"
    }
  },
  auth: {
    title: "Gestão de Inventário",
    signIn: "Iniciar Sessão",
    signOut: "Terminar Sessão",
    email: "Email",
    password: "Palavra-passe",
    invalidCredentials: "Credenciais inválidas",
  },
  navigation: {
    dashboard: "Painel",
    products: "Produtos",
    categories: "Categorias",
    suppliers: "Fornecedores",
    transactions: "Movimentos",
    reports: "Relatórios",
    users: "Utilizadores",
  },
  categories: {
    title: "Categorias",
    name: "Nome",
    description: "Descrição",
    productsCount: "Nº de Produtos",
    newCategory: "Nova Categoria",
    editCategory: "Editar Categoria",
    created: "Categoria criada com sucesso",
    updated: "Categoria atualizada com sucesso",
    deleted: "Categoria excluída com sucesso",
    validation: {
      nameRequired: "O nome é obrigatório",
    },
    messages: {
      created: "Categoria criada com sucesso",
      updated: "Categoria atualizada com sucesso",
      deleted: "Categoria excluída com sucesso",
      error: "Erro ao salvar categoria",
      deleteError: "Erro ao excluir categoria"
    }
  },
  suppliers: {
    title: "Fornecedores",
    name: "Nome",
    email: "E-mail",
    phone: "Telefone",
    address: "Endereço",
    productsCount: "Nº de Produtos",
    newSupplier: "Novo Fornecedor",
    editSupplier: "Editar Fornecedor",
    created: "Fornecedor criado com sucesso",
    updated: "Fornecedor atualizado com sucesso",
    deleted: "Fornecedor excluído com sucesso",
    deleteError: "Erro ao excluir fornecedor",
    validation: {
      nameRequired: "O nome é obrigatório",
      emailInvalid: "O email é inválido",
      emailRequired: "O email é obrigatório",
      phoneRequired: "O telefone é obrigatório",
      addressRequired: "A morada é obrigatória",
    },
    messages: {
      created: "Fornecedor criado com sucesso",
      updated: "Fornecedor atualizado com sucesso",
      error: "Erro ao salvar fornecedor"
    }
  },
  products: {
    title: "Produtos",
    name: "Nome",
    description: "Descrição",
    sku: "SKU",
    price: "Preço",
    quantity: "Quantidade",
    minQuantity: "Quantidade Mínima",
    category: "Categoria",
    supplier: "Fornecedor",
    status: "Status",
    newProduct: "Novo Produto",
    editProduct: "Editar Produto",
    selectCategory: "Selecionar Categoria",
    selectSupplier: "Selecionar Fornecedor",
    statuses: {
      GOOD: "Bom",
      REASONABLE: "Razoável",
      POOR: "Ruim",
      DAMAGED: "Danificado"
    },
    validation: {
      nameRequired: "O nome é obrigatório",
      skuRequired: "O SKU é obrigatório",
      pricePositive: "O preço deve ser positivo",
      quantityPositive: "A quantidade deve ser positiva",
      minQuantityPositive: "A quantidade mínima deve ser positiva",
      categoryRequired: "A categoria é obrigatória",
      supplierRequired: "O fornecedor é obrigatório",
      statusRequired: "O estado é obrigatório",
    },
    messages: {
      created: "Produto criado com sucesso",
      updated: "Produto atualizado com sucesso",
      deleted: "Produto excluído com sucesso",
      error: "Erro ao salvar produto",
      deleteError: "Erro ao excluir produto"
    }
  },
  dashboard: {
    title: "Dashboard",
    overview: "Visão geral do seu estoque",
    totalProducts: "Total de Produtos",
    categories: "Categorias",
    suppliers: "Fornecedores",
    lowStock: "Estoque Baixo",
    recentTransactions: "Transações Recentes",
    lowStockAlert: "Alerta de Estoque Baixo",
    items: "itens",
    inStock: "em estoque",
  },
  transactions: {
    title: "Transações",
    type: {
      IN: "Entrada",
      OUT: "Saída",
      ADJUSTMENT: "Ajuste",
    },
    status: {
      PENDING: "Pendente",
      COMPLETED: "Concluído",
      CANCELLED: "Cancelado",
    },
    messages: {
      created: "Transação criada com sucesso",
      updated: "Movimento atualizado com sucesso",
      deleted: "Movimento eliminado com sucesso",
      error: "Erro ao criar transação"
    },
    validation: {
      typeRequired: "O tipo é obrigatório",
      itemsRequired: "Adicione pelo menos um item",
      productRequired: "O produto é obrigatório",
      quantityRequired: "A quantidade é obrigatória",
      quantityPositive: "A quantidade deve ser positiva",
      priceRequired: "O preço é obrigatório",
      pricePositive: "O preço deve ser positivo",
    },
  },
  users: {
    title: "Usuários",
    name: "Nome",
    email: "E-mail",
    role: "Função",
    createdAt: "Data de Cadastro",
    newUser: "Novo Utilizador",
    editUser: "Editar Utilizador",
    password: "Palavra-passe",
    confirmPassword: "Confirmar Palavra-passe",
    roles: {
      admin: "Administrador",
      manager: "Gerente",
      user: "Usuário"
    },
    created: "Utilizador criado com sucesso",
    updated: "Utilizador atualizado com sucesso",
    deleted: "Utilizador eliminado com sucesso",
    validation: {
      nameRequired: "O nome é obrigatório",
      emailRequired: "O email é obrigatório",
      emailInvalid: "O email é inválido",
      passwordRequired: "A palavra-passe é obrigatória",
      passwordMinLength: "A palavra-passe deve ter pelo menos 6 caracteres",
      confirmPasswordRequired: "A confirmação da palavra-passe é obrigatória",
      passwordsMustMatch: "As palavras-passe não coincidem",
      roleRequired: "A função é obrigatória",
    },
  },
};