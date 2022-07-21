export class Data {
	public entites: Entite[];
	public quetesprincipales: Quete[];
	public quetessecondaires: Quete[];
	public lieuActuel: Lieu;
	public boutiques: Boutique[];
	public lieux: Lieu[];
	public catabombes: string[][];
	public pnjs: Entite[];
	public positionsStuff: { emplacement: string, x: number, y: number }[];
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
	public sorts: { nom: string, image: string }[]
	public stuff: Equipement[];
	public argent: number;
	public inventaire: ObjetInventaire[];
	public formes: Forme[];
	public forme: Forme;
	public familier: Entite;
	public statutFamilier: string;
	public solo: boolean;
	public tournoi: boolean;
	public id: string;
	public type: string;
	public overrideX: number;
	public posLinkedX: number;
	public posLinkedY: number;
	public posHeight: number;
	public forceDivScale: number;
	public levels: { niveau: number, pdvmax: number, manamax: number }[];
	public boutique: string;
	public quetes: Quete[];
	public joueur: boolean;
}

export class Equipement {
	public emplacement: string;
	public objet: ObjetInventaire;
}

export class Forme {
	public nom: string;
	public image: string;
}

export class Boutique {
	public nom: string;
	public objets: ObjetInventaire[];
}

export class ObjetInventaire {
	public emplacement: string;
	public nom: string;
	public qte: number;
	public image: string;
	public prix: number;
}

export class Quete {
	public proprietaire: string;
	public nom: string;
	public type: string;
	public etatQuete: number;
	public etapeEnCours: Etape;
	public etapes: Etape[];
	public recompenses: ObjetInventaire[];
	public paiement: number;
}

export class Etape{
	public id: number;
	public nom: string;
	public description: string;
	public pnj: string;
	public objets: ObjetInventaire[];
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