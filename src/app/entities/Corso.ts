export type Corso = {
    id: string;
    titolo: string;
    descrizione: string;
    categoria: string;
    durataOre: number;
    obbligatorio: boolean;
    attivo: boolean;
}

export type AddCorsoDTO = {
    titolo: string;
    descrizione?: string;
    categoria: string;
    durataOre: number;
    obbligatorio?: boolean;
    attivo?: boolean;
}

export type UpdateCorsoDTO = {
    titolo?: string;
    descrizione?: string;
    categoria?: string;
    durataOre?: number;
    obbligatorio?: boolean;
    attivo?: boolean;
}