declare module 'von-gallery' {

    export interface VonConfig extends Object {

    }

    export interface VonSchema extends Object {

    }

    export interface VonOptions {
        directory: string;
        template: string;
        templatePath: string;
        output: string;
        config?: string;
    }

}
