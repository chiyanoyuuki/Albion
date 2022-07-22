export class Data {
	public entites: Entite[];
	public quetesprincipales: Quete[];
	public quetessecondaires: Quete[];
	public lieuActuel: Lieu;
	public boutiques: Boutique[];
	public lieux: Lieu[];
	public catabombes: string[][];
	public positionsStuff: { emplacement: string, x: number, y: number }[];
	public objets: ObjetInventaire[];
	public itemDragged: { perso: Entite, item: ObjetInventaire } | undefined;
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
	public joueur: boolean;
	public histoire: string;
	public classe: string;
	public stats: { nom: string, qte: number }[];
	public sorts: Sort[]
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
	public overrideY: number;
	public posLinkedX: number;
	public posLinkedY: number;
	public posHeight: number;
	public forceDivScale: number;
	public levels: { niveau: number, pdvmax: number, manamax: number }[];
	public loot: ObjetInventaire[];
	public peutBouger: boolean;
}

export class Sort {
	public nom: string;
	public image: string;
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
	public taux: number;
}

export class Quete {
	public nom: string;
	public perso: string;
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
	public scaleFond: number;
	public entreex: number;
	public entreey: number;
	public canEnter: boolean;
	public canSeeInside: boolean;
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