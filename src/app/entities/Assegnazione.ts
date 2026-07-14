import { Corso } from "./Corso";
import { User } from "./User";

export enum StatoAssegnazione {
    ASSEGNATO = "assegnato",
    COMPLETATO = "completato",
    SCADUTO = "scaduto",
    ANNULLATO = "annullato",
}

export type Assegnazione = {
    id: string;
    corsoId: Corso;
    dipendenteId: User;
    dataAssegnazione: string;
    dataScadenza: string;
    stato: StatoAssegnazione;
    dataCompletamento: string | null;
}

export type AddAssegnazioneDTO = {
    corsoId: string;
    dipendenteId: string;
    dataAssegnazione: string;
    dataScadenza: string;
}

export type UpdateAssegnazioneDTO = {
    corsoId?: string;
    dipendenteId?: string;
    dataAssegnazione?: string;
    dataScadenza?: string;
}