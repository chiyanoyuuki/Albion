export class Data {
	public equipe: Entite[];
	public pnjsNeutres: Entite[];
	public quetesprincipales: Quete[];
	public quetessecondaires: Quete[];
	public lieuActuel: Lieu;
	public boutiques: Boutique[];
	public lieux: Lieu[];
	public catabombes: string[][];
	public pnjs: Entite[];
}

export class Entite {
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
	public team: boolean;
	public actif: boolean;
	public histoire: string;
	public classe: string;
	public stats: { nom: string, qte: number }[];
	public arme1: string;
	public arme2: string;
	public sorts: string[]
	public stuff: string[];
	public argent: number;
	public inventaire: { nom: string, qte: number }[];
	public formes: string[];
	public forme: string;
	public familier: Entite;
	public solo: boolean;
	public tournoi: boolean;
	public id: string;
	public type: string;
}

export class Boutique {
	public nom: string;
	public objets: Objet[];
}

export class Objet {
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

export class Lieu {
	public id: string;
	public nom: string;
	public image: string;
	public x: number;
	public y: number;
	public finx: number;
	public finy: number;
	public pnjs: Entite[];
	public desac: boolean;
	public parent: string;
	public ancienLieu: Lieu;
	public personnagesActuels: string[];
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
}

export class addEntity {
	public menuContextuel: MenuContextuel;
	public entite: Entite;
	public team: string;
}