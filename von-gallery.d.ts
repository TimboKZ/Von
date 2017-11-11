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

    export interface VonConfigGroup extends Object {
        name?: string;
        prefix?: string;
        folder?: string;
        regex?: string;
    }

    export interface VonSchemaGroup extends VonConfigGroup {
        images: string[];
    }

}
