/**
 * Typ pojedynczej usługi
 */
export type ServiceType = {
  id: string;
  title: string;
  description: string;
};

/**
 * Typ kategorii usług
 */
export type CategoryType = {
  id: string;
  name: string;
  services: ServiceType[];
};
