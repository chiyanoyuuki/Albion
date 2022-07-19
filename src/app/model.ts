export class Data {
	public entites: Entite[];
	public quetesprincipales: Quete[];
	public quetessecondaires: Quete[];
	public lieuActuel: Lieu;
	public boutiques: Boutique[];
	public lieux: Lieu[];
	public catabombes: string[][];
	public pnjs: Entite[];
}

export class Entite {
	public lieu: string;
	public x: number;
	public y: number;
	public xcombat: number;
	public ycombat: number;
	public nom: string;
	public etat: string;
	public niveau: number;
	public pdvmax: number;
	public pdv: number;
	public manamax: number;
	public mana: number;
	public image: string;
	public team: number;
	public actif: boolean;
	public histoire: string;
	public classe: string;
	public stats: { nom: string, qte: number }[];
	public arme1: string;
	public arme2: string;
	public sorts: string[]
	public stuff: string[];
	public argent: number;
	public inventaire: ObjetInventaire[];
	public formes: {nom:string,image:string,minia:string}[];
	public forme: string;
	public familier: Entite;
	public solo: boolean;
	public tournoi: boolean;
	public id: string;
	public type: string;
	public overrideX: number;
	public levels: { niveau: number, pdvmax: number, manamax: number }[]
}

export class Boutique {
	public nom: string;
	public objets: ObjetAAcheter[];
}

export class ObjetInventaire { 
	public nom: string; 
	public qte: number; 
	public image: string }

export class ObjetAAcheter {
	public nom: string;
	public qte: number;
	public prix: number;
}

export class Quete {
	public nom: string;
	public description: string;
	public etat: string;
	public etape: number;
}

export class Position {
	public id: number;
	public startX: number;
	public startY: number;
}

export class Lieu {
	public id: string;
	public nom: string;
	public image: string;
	public x: number;
	public y: number;
	public position_start: Position[];
	public finx: number;
	public finy: number;
	public desac: boolean;
	public parent: string;
	public scale: number;
	public entreex: number;
	public entreey: number;
}

export class Combat {
	public p1: Entite;
	public p2: Entite;
}

export class Tournoi {
	public tour16: Combat[];
	public tour8: Combat[];
	public tour4: Combat[];
	public tour2: Combat[];
}

export class MenuContextuel {
	public x: number;
	public y: number;
	public type: string;
}

export class addEntity {
	public menuContextuel: MenuContextuel;
	public entite: Entite;
	public team: string;
}