export class Data {
	public entites: Entite[];
	public quetes: Quete[];
	public lieuActuel: Lieu;
	public boutiques: Boutique[];
	public lieux: Lieu[];
	public catabombes: string[][];
	public positionsStuff: { emplacement: string, x: number, y: number }[];
	public objets: ObjetInventaire[];
	public itemDragged: { perso: Entite, item: ObjetInventaire } | undefined;
	public admin: boolean;
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
	public boutique: string;
	public quetes: Quete[];
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
	public forceDivScale: number;
	public overrideX: number;
	public overrideY: number;
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
	public taux: number;
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
	public perso: string;
}

export class Etape {
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
	public scaleFond: number;
	public canEnter: boolean;
	public canSeeInside: boolean;
	public to: string;
	public bords: boolean;
	public finFond: number;
	public musique: string;
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