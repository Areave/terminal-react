export namespace Types {

    export interface State {
        readonly isAuthorized: boolean,
        readonly isLoading: boolean,
        readonly name: string
    }

    export interface MainState {
        token: string
    }

    export interface ErrorState {
        isError: boolean,
        errorType: number
    }

    export interface Action {
        type: string,
        payload?: Object
    }
    export interface WelcomeCompProps {
        setWelcome: (name: string) => void,
        name: string
    }
}