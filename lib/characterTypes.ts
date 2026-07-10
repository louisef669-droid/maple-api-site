export type CharacterBasic = {
  character_name: string;
  character_class: string;
  character_level: number;
  character_image: string;
  world_name: string;
};

export type CharacterStat = {
  stat_name: string;
  stat_value: string;
};

export type EquipmentItem = {
  item_equipment_slot: string;
  item_name: string;
  item_icon?: string;
  starforce?: string;
  potential_option_grade?: string;
  potential_option_1?: string;
  potential_option_2?: string;
  potential_option_3?: string;
  additional_potential_option_grade?: string;
  additional_potential_option_1?: string;
  additional_potential_option_2?: string;
  additional_potential_option_3?: string;
};

export type UnionData = {
  union_level?: number;
  union_grade?: string;
};

export type ArtifactEffect = {
  name: string;
  level: number;
};

export type ArtifactCrystal = ArtifactEffect & {
  crystal_option_name_1?: string;
  crystal_option_name_2?: string;
  crystal_option_name_3?: string;
};

export type ArtifactData = {
  union_artifact_remain_ap?: number;
  union_artifact_effect?: ArtifactEffect[];
  union_artifact_crystal?: ArtifactCrystal[];
};

export type HexaCore = {
  hexa_core_type: string;
  hexa_core_name: string;
  hexa_core_level: number;
};

export type CharacterData = {
  basic: CharacterBasic;
  stat?: { final_stat?: CharacterStat[] } | null;
  equip?: { item_equipment?: EquipmentItem[] } | null;
  union?: UnionData | null;
  artifact?: ArtifactData | null;
  hexa?: { character_hexa_core_equipment?: HexaCore[] } | null;
};

export type StatValue = string | number;
