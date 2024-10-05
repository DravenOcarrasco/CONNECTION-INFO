(async function () {
    /**
     * Function to create a module context with WebSocket, storage, and custom data capabilities.
     * This function returns a context object with methods that allow interaction with WebSocket events, 
     * storage, and custom data management.
     *
     * @param {string} moduleName - The name of the module.
     * @returns {{
    *   CONTEXT.MODULE_NAME: string,
    *   SOCKET: object,
    *   KEYBOARD_COMMANDS: Array<object>,
    *   setStorage: (key: string, value: any, isGlobal: boolean) => Promise<object>,
    *   getStorage: (key: string, isGlobal: boolean) => Promise<object>,
    *   getVariable: (variableName: string, defaultValue: any, create: boolean, isGlobal: boolean) => Promise<any>,
    *   showMenu: (options: Array<object>) => void,
    *   getCustomData: (key: string) => any,
    *   setCustomData: (key: string, value: any) => void
    *   setMenuHandler: (handlerFunction: function) => void
    * }} - The context object with methods for WebSocket, storage, and custom data.
   */
    function createContext(moduleName) {
        return window.WSACTION.createModuleContext(moduleName);
    }

    // Criar o contexto para o módulo utilizando a função createModuleContext
    const CONTEXT = createContext("CONNECTION-INFO");

    const SOCKET = CONTEXT.SOCKET;
    CONTEXT.KEYBOARD_COMMANDS = []

    let swalInstance;

    // Exibe um modal de "Conectando" ao iniciar a conexão
    swalInstance = Swal.fire({
        title: 'Conectando...',
        text: 'Aguarde enquanto tentamos conectar ao WSActions.',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false
    });

    SOCKET.on('connect', () => {
        console.log(`${CONTEXT.MODULE_NAME} Connected to WebSocket server`);
        Swal.fire({
            title: 'Conectado!',
            text: 'Conexão estabelecida com o WSActions.',
            icon: 'success',
            timer: 2000, // Exibe por 2 segundos antes de fechar
            showConfirmButton: false
        });
    });

    SOCKET.on('disconnect', () => {
        console.log(`${CONTEXT.MODULE_NAME} Disconnected from WebSocket server`);

        // Exibe um modal "Desconectado"
        swalInstance = Swal.fire({
            title: 'Sem conexão com WSActions!',
            text: 'Você está sem conexão com o servidor WSActions.',
            icon: 'error',
            allowOutsideClick: false,
            showConfirmButton: false
        });
    });

    SOCKET.on('reconnecting', (attempt) => {
        console.log(`${CONTEXT.MODULE_NAME} Reconnecting to WebSocket server, attempt: ${attempt}`);

        // Atualiza o modal para "Reconectando"
        swalInstance = Swal.fire({
            title: 'Reconectando...',
            text: `Tentando reconectar ao WSActions (Tentativa ${attempt})`,
            icon: 'warning',
            allowOutsideClick: false,
            showConfirmButton: false
        });
    });

    SOCKET.on('reconnect', () => {
        console.log(`${CONTEXT.MODULE_NAME} Reconnected to WebSocket server`);

        // Atualiza o modal para "Reconectado"
        Swal.fire({
            title: 'Reconectado!',
            text: 'Conexão restabelecida com sucesso ao WSActions.',
            icon: 'success',
            timer: 2000, // Exibe por 2 segundos antes de fechar
            showConfirmButton: false
        });
    });

    // Register the extension in the global context
    if (window.extensionContext) {
        window.extensionContext.addExtension(CONTEXT.MODULE_NAME, {
            location: window.location,
            ...CONTEXT
        });
    }
})();
