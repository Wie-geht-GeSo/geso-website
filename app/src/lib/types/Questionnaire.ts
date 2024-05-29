export interface RequestQuestionnaire {
    id: number;
    questionnaireName: string;
    questions: number[];
}

export interface RequestQuestion {
    id: number;
    question: string;
    searchFormulation: string;
    questionType: string;
    options: number[];
}

export interface Questionnaire {
    id: number;
    questionnaireName: string;
    questions: Question[];
}

export interface Question {
    id: number;
    question: string;
    searchFormulation: string;
    questionType: string;
    options: Option[];
}

export interface Option {
    id: number;
    option: string;
}
